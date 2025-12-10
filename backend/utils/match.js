import {
  FRESHER_MAX_YEARS,
  FRESHER_SKILL_RATIO,
  DEFAULT_SKILL_RATIO,
  MIN_SKILL_MATCHES,
} from "../config/matchConfig.js";

function escapeRegExp(string) {
  return String(string).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Check if two terms match (bidirectional partial matching)
 * Examples: "react" matches "reactjs", "node" matches "nodejs"
 */
function termsMatch(term1, term2) {
  const t1 = term1.toLowerCase().trim();
  const t2 = term2.toLowerCase().trim();

  // Exact match
  if (t1 === t2) return true;

  // One contains the other (handles "react" vs "reactjs", "node" vs "nodejs")
  if (t1.includes(t2) || t2.includes(t1)) return true;

  // Handle common variations (e.g., "react.js" vs "reactjs")
  const normalize = (s) => s.replace(/[.\-_\s]/g, "").toLowerCase();
  if (normalize(t1) === normalize(t2)) return true;

  return false;
}

/**
 * Count how many skills appear in job text using flexible matching
 */
function countTextMatches(jobText, skills) {
  let count = 0;
  const lowerText = jobText.toLowerCase();

  for (const skill of skills) {
    const safe = escapeRegExp(skill);

    // Try word boundary match first (exact word)
    const exactRe = new RegExp(`\\b${safe}\\b`, "i");
    if (exactRe.test(jobText)) {
      count++;
      continue;
    }

    // Fallback: check if skill appears anywhere (for compound terms like "reactjs")
    if (lowerText.includes(skill.toLowerCase())) {
      count++;
    }
  }
  return count;
}

export function doesJobMatchUser(job, user) {
  // normalize job tags
  const jobTags = Array.isArray(job.tags)
    ? job.tags.map((t) => String(t).toLowerCase().trim()).filter(Boolean)
    : [];

  // normalize user skills
  const userSkills = Array.isArray(user.skills)
    ? user.skills.map((s) => String(s).toLowerCase().trim()).filter(Boolean)
    : [];

  if (userSkills.length === 0) return false;

  // compute tag-based matches (bidirectional)
  let tagMatches = 0;
  if (jobTags.length) {
    for (const skill of userSkills) {
      for (const tag of jobTags) {
        // Check both directions: skill in tag OR tag in skill
        if (termsMatch(skill, tag)) {
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

  // Must have at least MIN_SKILL_MATCHES
  if (matchCount < MIN_SKILL_MATCHES) return false;

  // skill ratio relative to user's skill set
  const skillRatio = matchCount / Math.max(1, userSkills.length);

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
