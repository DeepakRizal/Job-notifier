import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import mongoose from "mongoose";
import Job from "../models/Job.js";
import User from "../models/User.js";
import Match from "../models/Match.js";

// safe regex escape so skill like "c++" won't break regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildJobText(job) {
  const parts = [];
  if (job.title) parts.push(job.title);
  if (job.description) parts.push(job.description);
  if (job.company) parts.push(job.company);
  if (job.location) parts.push(job.location);

  console.log(parts);
  return parts.join(" ").toLowerCase();
}

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected");
  } catch (err) {
    console.error("DB connection failed", err);
    process.exit(1);
  }
}

async function findJobsToProcess() {
  // for now process jobs discovered in last 14 days to keep scope reasonable
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  return Job.find({ discoveredAt: { $gte: since } })
    .sort({ discoveredAt: -1 })
    .lean();
}

async function runMatcher() {
  await connectDb();

  const THRESHOLD = 0.1; // 60%

  const jobs = await findJobsToProcess();
  if (!jobs.length) {
    console.log("No recent jobs to process.");
    await mongoose.disconnect();
    return;
  }

  // load all users once (if you have many users later, load in pages)
  const users = await User.find({}).lean();

  console.log(
    `Loaded ${jobs.length} jobs and ${users.length} users. Starting matching...`
  );

  let totalMatches = 0;
  for (const job of jobs) {
    const jobText = buildJobText(job);

    for (const user of users) {
      const skills = Array.isArray(user.skills)
        ? user.skills.map((s) => String(s).toLowerCase().trim()).filter(Boolean)
        : [];
      if (skills.length === 0) continue;

      // skip if a Match already exists for this user-job pair
      const existing = await Match.findOne({
        userId: user._id,
        jobId: job._id,
      }).lean();
      if (existing) continue;

      // count how many skills appear in jobText using word-boundary regex
      let matchCount = 0;
      for (const skill of skills) {
        const safe = escapeRegExp(skill);
        const re = new RegExp(`\\b${safe}\\b`, "i");
        if (re.test(jobText)) matchCount++;
      }

      const ratio = matchCount / skills.length;
      if (ratio >= THRESHOLD) {
        // create a Match document
        await Match.create({
          userId: user._id,
          jobId: job._id,
          notified: false,
        });
        totalMatches++;
        console.log(
          `MATCH: user=${user.email || user._id} job="${
            job.title
          }" matches=${matchCount}/${skills.length} (ratio=${ratio.toFixed(2)})`
        );
      }
    }
  }

  console.log(`Matching finished. Total new matches created: ${totalMatches}`);
  await mongoose.disconnect();
  process.exit(0);
}

runMatcher().catch((err) => {
  console.error("Matcher error:", err);
  process.exit(1);
});
