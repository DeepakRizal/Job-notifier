export function doesJobMatchUser(job, user) {
  const jobTags = Array.isArray(job.tags)
    ? job.tags.map((t) => t.toLowerCase().trim())
    : [];

  const userSkills = Array.isArray(user.skills)
    ? user.skills.map((s) => s.toLowerCase().trim())
    : [];

  if (jobTags.length === 0) {
    const jobText =
      `${job.title} ${job.description} ${job.company} ${job.location}`.toLowerCase();
    return userSkills.some((skill) => jobText.includes(skill));
  }

  return userSkills.some((skill) => jobTags.some((tag) => tag.includes(skill)));
}
