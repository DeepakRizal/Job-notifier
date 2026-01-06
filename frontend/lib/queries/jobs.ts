import { JobDetailResponse, JobDocument } from "@/types/job";
import { apiFetch } from "../api";

type JobsResponse = { success: boolean; jobs: JobDocument[]; hasMore: boolean };

export async function fetchJobs({
  q,
  role,
  page = 1,
  limit = 20,
}: {
  q?: string;
  role?: string | null;
  page?: number;
  limit?: number;
}) {
  const params = new URLSearchParams();
  // q -> backend expects `q`
  if (q) params.set("q", q);
  if (role) params.set("role", role);

  params.set("page", String(page));
  params.set("limit", String(limit));

  const url = `/jobs?${params.toString()}`;

  const res = (await apiFetch(url)) as JobsResponse;

  return res.jobs;
}

export async function fetchMyJobs({
  page = 1,
  q,
  role,
  postedAt,
  limit = 20,
  experience,
  mode,
}: {
  page?: number;
  q?: string;
  role?: string | null;
  postedAt?: string | undefined;
  limit?: number;
  experience?: string | undefined;
  mode?: string | undefined;
}) {
  const params = new URLSearchParams();

  if (q) params.set("q", q);

  if (role) params.set("role", role);
  if (postedAt) params.set("postedAt", postedAt);
  if (experience) params.set("experience", experience);
  if (mode) params.set("mode", mode);

  params.set("page", String(page));
  params.set("limit", String(limit));

  const url = `/jobs/mine?${params.toString()}`;

  const res = (await apiFetch(url)) as JobsResponse;

  return { jobs: res.jobs, hasMore: res.hasMore };
}

export async function fetchAJob(jobId: string) {
  const res = (await apiFetch(`/jobs/${jobId}`)) as JobDetailResponse;

  return res.job;
}
