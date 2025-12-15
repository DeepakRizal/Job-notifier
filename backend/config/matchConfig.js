export const FRESHER_MAX_YEARS = Number(process.env.FRESHER_MAX_YEARS || 1);

// Skill ratio thresholds
// Fresher: 30% of skills must match (e.g., 2 out of 6 skills)
export const FRESHER_SKILL_RATIO = Number(
  process.env.FRESHER_SKILL_RATIO || 0.3
);
// Non-fresher: 20% of skills must match (e.g., 2 out of 10 skills)
export const DEFAULT_SKILL_RATIO = Number(
  process.env.DEFAULT_SKILL_RATIO || 0.2
);

// Minimum number of skills that must match (regardless of ratio)
export const MIN_SKILL_MATCHES = Number(process.env.MIN_SKILL_MATCHES || 1);
