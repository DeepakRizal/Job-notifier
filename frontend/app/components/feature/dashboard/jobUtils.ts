import type { JobDocument } from "@/types/job";

export interface TransformedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  postedAgo: string;
  salaryRange: string;
  skills: string[];
  url: string;
}

export function formatTimeSince(dateStr?: string | null): string {
  if (!dateStr) return "Recently";

  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (isNaN(seconds) || seconds < 0) return "Recently";
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function getCanonicalPostedAt(job: JobDocument): string | null {
  return job.postedAt ?? job.discoveredAt ?? job.createdAt ?? null;
}

export function formatExperienceRange(job: JobDocument): string {
  if (job.experience?.min != null && job.experience?.max != null) {
    return `${job.experience.min}-${job.experience.max} yrs`;
  }
  return "Experience N/A";
}

export function transformJob(job: JobDocument): TransformedJob {
  const canonicalPostedAt = getCanonicalPostedAt(job);

  return {
    id: job._id,
    title: job.title,
    company: job.company,
    location: job.location,
    postedAgo: formatTimeSince(canonicalPostedAt),
    salaryRange: formatExperienceRange(job),
    skills: job.tags ?? [],
    url: job.url ?? "",
  };
}

