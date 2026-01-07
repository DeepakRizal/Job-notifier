import { matchSingleJob } from "../jobs/matcher.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import Match from "../models/Match.js";
import { sendEmail } from "../utils/email.js";
import crypto from "crypto";

const POSTED_AT_RANGES = {
  "24h": 1,
  "3 days": 3,
  "7 days": 7,
  "30 days": 30,
};

const EXPERIENCE_RANGES = {
  entry: { min: 0, max: 2 },
  mid: { min: 3, max: 5 },
  senior: { min: 6, max: 50 },
};

const MODE_KEYWORDS = {
  remote: /remote/i,
  onsite: /on[\s-]?site/i,
  hybrid: /hybrid/i,
};

const NOTIFY_WINDOW_HOURS = Number(process.env.NOTIFY_WINDOW_HOURS || 24);
const NOTIFY_WINDOW_MS = NOTIFY_WINDOW_HOURS * 60 * 60 * 1000;

function parseExperience(expStr) {
  if (!expStr) return null;

  const m = expStr.match(/(\d+)(?:\s*-\s*(\d+))?/);
  if (!m) return null;
  const min = parseInt(m[1], 10);
  const max = m[2] ? parseInt(m[2], 10) : min;
  return { min, max };
}

export const discoverJob = async (req, res, next) => {
  try {
    const body = req.body;

    const url = body.url || null;
    const sourceId = body.sourceId || null;

    let postedAt = null;

    if (body.postedAt) {
      const d = new Date(body.postedAt);

      if (!isNaN(d)) postedAt = d;
    }

    const doc = {
      title: body.title || "No title",
      company: body.company || "",
      location: body.location || "",
      description: body.description || "",
      url,
      source: body.source || "test",
      sourceId,
      postedAt,
      experience: body.experience,
      discoveredAt: new Date(),
      rawHTML: body.rawHTML,
      tags: body.tags,
    };

    doc.experience = parseExperience(doc.experience);
    doc.minExperience = doc.experience ? doc.experience.min : null;
    doc.maxExperience = doc.experience ? doc.experience.max : null;

    let fingerprint = body.fingerprint;
    if (!fingerprint) {
      const seed = (url || `${doc.title || ""}|${doc.company || ""}`).toString();
      fingerprint = crypto
        .createHash("sha256")
        .update(seed)
        .digest("hex");
    }
    doc.fingerprint = fingerprint;

    const ownerIds = body.owner || body.owners || [];
    const ownersArray = Array.isArray(ownerIds) ? ownerIds : [ownerIds];
    const validOwners = ownersArray.filter(
      (id) => id && typeof id === "string"
    );

    const query = fingerprint
      ? { fingerprint }
      : url
      ? { url }
      : sourceId
      ? { source: doc.source, sourceId }
      : { title: doc.title, company: doc.company };

    // Use $set for fields, but $setOnInsert for createdAt if you want to track creation
    // Add owners to the owners array if they don't already exist
    const update = {
      $set: doc,
      $setOnInsert: { createdAt: new Date() },
    };

    // Add owners to the owners array if there are valid owners
    if (validOwners.length > 0) {
      update.$addToSet = { owners: { $each: validOwners } };
    }

    // Ask Mongo for the raw result to detect upsert-insert
    const updateResult = await Job.updateOne(query, update, { upsert: true });

    // `result.value` is the Job doc, `result.lastErrorObject.upserted` exists when a new doc was inserted
    const wasInserted = !!(
      updateResult.upsertedId ||
      updateResult.upsertedCount ||
      updateResult.upserted
    );

    const job = await Job.findOne(query);

    const jobTime = job.postedAt
      ? new Date(job.postedAt)
      : new Date(job.discoveredAt || job.createdAt || Date.now());

    const ageMs = Date.now() - new Date(jobTime).getTime();
    const isFresh = ageMs <= NOTIFY_WINDOW_MS;

    if (!isFresh) {
      console.log(
        `Job too old (${Math.round(ageMs / 3600000)}h). Skipping notifications.`
      );
    } else {
      if (wasInserted) {
        console.log(
          "New job inserted — running matcher and notifying matches."
        );

        // run your matcher for this single job (returns created Match docs)
        const newMatches = await matchSingleJob(job);

        // notify matched users (example: email)
        for (const m of newMatches) {
          // load the user so we know where/how to notify
          const user = await User.findById(m.userId).lean();
          if (!user) continue;

          // only send email if preference allows and email exists
          if (
            user.notificationPreferences?.email &&
            user.email &&
            !user.emailUnsubscribed
          ) {
            const ok = await sendEmail(user.email, job);
            if (ok) {
              await Match.findByIdAndUpdate(m._id, {
                $set: { notified: true, notifiedAt: new Date() },
              });
            } else {
              console.warn("Failed to send email to", user.email);
            }
          }
        }
      } else {
        console.log("Existing job updated — skipping immediate notifications.");
      }
    }

    // finally return response
    return res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

export const getAllJobs = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    const roleParam = (req.query.role || "").trim() || null;
    const postedAt = (req.query.postedAt || "").trim() || null;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);

    console.log(req.query);

    const escapeForRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const andConditions = [];

    if (q) {
      const qRegex = new RegExp(escapeForRegex(q), "i");
      const qCondition = {
        $or: [
          { title: qRegex },
          { company: qRegex },
          { location: qRegex },
          { tags: { $in: [qRegex] } },
          { description: qRegex },
        ],
      };
      andConditions.push(qCondition);
    }

    if (roleParam) {
      const roleRegex = new RegExp(escapeForRegex(roleParam), "i");

      const roleCondition = {
        $or: [
          { role: roleParam },
          { tags: { $in: [roleRegex] } },
          { title: roleRegex },
          { description: roleRegex },
        ],
      };

      andConditions.push(roleCondition);
    }

    if (postedAt && POSTED_AT_RANGES[postedAt]) {
      const days = POSTED_AT_RANGES[postedAt];

      const cutOffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      andConditions.push({
        postedAt: { $gte: cutOffDate },
      });
    }

    const filter = andConditions.length ? { $and: andConditions } : {};

    const total = await Job.countDocuments(filter);

    // Prefer most recently posted jobs, falling back to newest discovered/created.
    const sort = { postedAt: -1, discoveredAt: -1, createdAt: -1 };

    const jobs = await Job.find(filter, {
      title: 1,
      company: 1,
      location: 1,
      postedAt: 1,
      tags: 1,
      url: 1,
      _id: 1,
    })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    return res.status(200).json({
      success: true,
      jobs,
      page,
      limit,
      total,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyJobs = async (req, res, next) => {
  try {
    const { skills = [] } = req.user;

    const q = (req.query.q || "").trim();
    const role = (req.query.role || "").trim() || null;
    const mode = (req.query.mode || "").toLowerCase().trim() || null;
    const postedAt = (req.query.postedAt || "").trim() || null;
    const experienceParam = (req.query.experience || "").trim();

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);

    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 20)
    );

    const escapeForRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const andConditions = [];

    // Search query
    if (q) {
      const qRegex = new RegExp(escapeForRegex(q), "i");
      andConditions.push({
        $or: [
          { title: qRegex },
          { company: qRegex },
          { location: qRegex },
          { description: qRegex },
          { tags: { $in: [qRegex] } },
        ],
      });
    }

    // Role filter
    if (role) {
      const roleRegex = new RegExp(escapeForRegex(role), "i");
      andConditions.push({
        $or: [
          { role },
          { title: roleRegex },
          { description: roleRegex },
          { tags: { $in: [roleRegex] } },
        ],
      });
    }

    // Posted at filter
    if (postedAt && POSTED_AT_RANGES[postedAt]) {
      const days = POSTED_AT_RANGES[postedAt];
      const cutOffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      andConditions.push({ postedAt: { $gte: cutOffDate } });
    }

    // Experience filter
    if (experienceParam) {
      const experienceLevels = experienceParam
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);

      const experienceConditions = experienceLevels
        .map((level) => EXPERIENCE_RANGES[level])
        .filter(Boolean)
        .map((range) => ({
          minExperience: { $lte: range.max },
          maxExperience: { $gte: range.min },
        }));

      if (experienceConditions.length > 0) {
        andConditions.push({ $or: experienceConditions });
      }
    }

    // Mode filter
    if (mode && MODE_KEYWORDS[mode]) {
      andConditions.push({
        location: MODE_KEYWORDS[mode],
      });
    }

    const filter = andConditions.length ? { $and: andConditions } : {};
    const sort = { postedAt: -1 };

    const jobs = await Job.find(filter, {
      title: 1,
      company: 1,
      location: 1,
      postedAt: 1,
      tags: 1,
      url: 1,
      experience: 1,
      _id: 1,
      description: 1,
    })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit + 1)
      .lean()
      .exec();

    const hasMorePages = jobs.length > limit;

    // Skill-based filtering
    const normalizedSkills = skills
      .map((s) => String(s).toLowerCase().trim())
      .filter(Boolean);

    const filteredJobs = jobs.filter((job) => {
      const jobText = `${job.title || ""} ${job.description || ""} ${
        job.company || ""
      } ${Array.isArray(job.tags) ? job.tags.join(" ") : ""}`.toLowerCase();

      return normalizedSkills.some((skill) => {
        if (jobText.includes(skill)) return true;

        if (Array.isArray(job.tags)) {
          return job.tags.some((tag) => {
            const normalizedTag = String(tag).toLowerCase().trim();
            return (
              normalizedTag.includes(skill) || skill.includes(normalizedTag)
            );
          });
        }

        return false;
      });
    });

    const jobsToReturn = hasMorePages
      ? filteredJobs.slice(0, limit)
      : filteredJobs;

    res.status(200).json({
      success: true,
      jobs: jobsToReturn,
      hasMore: hasMorePages,
    });
  } catch (error) {
    next(error);
  }
};

export const getAjob = async (req, res, next) => {
  const id = req.params.id;

  const projection = {
    title: 1,
    company: 1,
    location: 1,
    description: 1,
    experience: 1,
    minExperience: 1,
    maxExperience: 1,
    tags: 1,
    postedAt: 1,
    url: 1,
    source: 1,
    _id: 1,
  };

  const job = await Job.findById(id, projection);

  if (!job) {
    return res.status(404).json({
      status: false,
      message: "Job doesn't exist",
    });
  }

  res.status(200).json({
    success: true,
    job,
  });
};
