import {
  FRESHER_MAX_YEARS,
  FRESHER_SKILL_RATIO,
  DEFAULT_SKILL_RATIO,
} from "../config/matchConfig.js";

function escapeRegExp(string) {
  return String(string).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countTextMatches(jobText, skills) {
  let count = 0;
  for (const skill of skills) {
    const safe = escapeRegExp(skill);
    const re = new RegExp(`\\b${safe}\\b`, "i");
    if (re.test(jobText)) count++;
  }
  return count;
}

export function doesJobMatchUser(job, user) {
  // normalize job tags
  const jobTags = Array.isArray(job.tags)
    ? job.tags.map((t) => String(t).toLowerCase().trim())
    : [];

  // normalize user skills
  const userSkills = Array.isArray(user.skills)
    ? user.skills.map((s) => String(s).toLowerCase().trim()).filter(Boolean)
    : [];

  if (userSkills.length === 0) return false;

  // compute tag-based matches
  let tagMatches = 0;
  if (jobTags.length) {
    for (const skill of userSkills) {
      for (const tag of jobTags) {
        if (tag.includes(skill)) {
          tagMatches++;
          break;
        }
      }
    }
  }

  // compute text-based matches (fallback)
  const jobText = `${job.title || ""} ${job.description || ""} ${
    job.company || ""
  } ${job.location || ""} ${
    Array.isArray(job.tags) ? job.tags.join(" ") : ""
  }`.toLowerCase();

  const textMatches = countTextMatches(jobText, userSkills);

  // choose stronger signal
  const matchCount = Math.max(tagMatches, textMatches);

  // skill ratio relative to user's skill set
  const skillRatio = matchCount / Math.max(1, userSkills.length);

  console.log(skillRatio);

  // fresher check: user.experience assumed numeric years
  const userExp = Number(user.experience || 0);
  const isFresher = userExp <= FRESHER_MAX_YEARS;

  // job entry-level check: treat missing maxExperience as entry-level
  const jobMax = job.maxExperience == null ? null : Number(job.maxExperience);
  const jobIsEntry = jobMax == null || jobMax <= FRESHER_MAX_YEARS;

  if (isFresher) {
    // fresher must be entry-level job AND meet skill ratio
    return jobIsEntry && skillRatio >= FRESHER_SKILL_RATIO;
  }

  // non-fresher uses default threshold
  return skillRatio >= DEFAULT_SKILL_RATIO;
}
