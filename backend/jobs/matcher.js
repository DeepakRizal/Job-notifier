import User from "../models/User.js";
import Match from "../models/Match.js";
import { doesJobMatchUser } from "../utils/match.js";

export async function matchSingleJob(job) {
  // load users (small-scale). For many users, page through them.
  const users = await User.find({}).lean();

  const createdMatches = [];

  for (const user of users) {
    if (!user || !Array.isArray(user.skills) || user.skills.length === 0)
      continue;

    const isMatch = doesJobMatchUser(job, user);
    if (!isMatch) continue;

    // Upsert match to avoid duplicates (atomic-ish)
    // We use $setOnInsert so we don't overwrite notified flag later
    const match = await Match.findOneAndUpdate(
      { userId: user._id, jobId: job._id },
      {
        $setOnInsert: {
          userId: user._id,
          jobId: job._id,
          notified: false,
          createdAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    createdMatches.push(match);
  }

  return createdMatches;
}
