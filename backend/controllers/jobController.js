import { matchSingleJob } from "../jobs/matcher.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import Match from "../models/Match.js";
import { sendEmail } from "../utils/email.js";

const NOTIFY_WINDOW_HOURS = Number(process.env.NOTIFY_WINDOW_HOURS || 5);
const NOTIFY_WINDOW_MS = NOTIFY_WINDOW_HOURS * 60 * 60 * 1000;

export const test = async (req, res, next) => {
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
      discoveredAt: new Date(),
      rawHTML: body.rawHTML,
      tags: body.tags,
    };

    // upsert by url if available, otherwise by sourceId, otherwise insert new
    const query = url
      ? { url }
      : sourceId
      ? { source: doc.source, sourceId }
      : { title: doc.title, company: doc.company };

    // Use $set for fields, but $setOnInsert for createdAt if you want to track creation
    const update = {
      $set: doc,
      $setOnInsert: { createdAt: new Date() },
    };

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

    console.log(isFresh);

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
              // mark match as notified (atomic):
              await Match.findByIdAndUpdate(m._id, {
                $set: { notified: true, notifiedAt: new Date() },
              });
            } else {
              // if send failed, leave notified=false so you can retry later / log failure
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

//Handler to get all jobs
export const getAllJobs = async (req, res, next) => {
  const jobs = await Job.find({});

  res.status(200).json({
    success: true,
    jobs,
  });
};

export const getMyJobs = async (req, res, next) => {
  //read the skills
  const { skills } = req.user;

  //query the jobs from the database
  const jobs = await Job.find();

  // filter the jobs that matches the user skills
  const filteredJobs = jobs.filter((job) => {
    const jobTextRaw = `${job.title || ""} ${job.description || ""} ${
      job.company || ""
    }`;

    const jobText = jobTextRaw
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .split(" ")
      .filter(Boolean);

    return skills.some((skill) => jobText.includes(skill));
  });

  // return those jobs to the logged in user
  res.status(200).json({
    success: true,
    jobs: filteredJobs,
  });
};
