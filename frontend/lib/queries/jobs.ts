import { JobDocument } from "@/types/job";
import { apiFetch } from "../api";

type JobsResponse = { success: boolean; jobs: JobDocument[] };

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
  if (q) params.set("role", q);
  if (role) params.set("role", role);

  params.set("page", String(page));
  params.set("limit", String(limit));

  const url = `/jobs?${params.toString()}`;

  const res = (await apiFetch(url)) as JobsResponse;

  return res.jobs;
}

export async function fetchMyJobs() {
  const res = (await apiFetch("/jobs/mine", {
    method: "GET",
  })) as JobsResponse;

  return res.jobs;
}
