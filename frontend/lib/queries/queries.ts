import { apiFetch } from "../api";

export interface Query {
  _id: string;
  query: string;
  active: boolean;
  createdAt: string;
  lastScrapedAt?: string;
}

export interface CreateQueryResponse {
  success: boolean;
  query: string;
  id: string;
}

export interface GetQueriesResponse {
  success: boolean;
  queries: Query[];
}

export async function createQuery(query: string): Promise<CreateQueryResponse> {
  const res = (await apiFetch("/queries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: { query },
  })) as CreateQueryResponse;

  return res;
}

export async function getMyQueries(): Promise<Query[]> {
  const res = (await apiFetch("/queries/mine", {
    method: "GET",
  })) as GetQueriesResponse;

  return res.queries || [];
}

export async function deleteQuery(queryId: string): Promise<void> {
  await apiFetch(`/queries/${queryId}`, {
    method: "DELETE",
  });
}

export async function toggleQueryActive(
  queryId: string,
  active: boolean
): Promise<void> {
  await apiFetch(`/queries/${queryId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: { active },
  });
}

export async function updateQuery(
  queryId: string,
  query: string
): Promise<void> {
  await apiFetch(`/queries/${queryId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: { query },
  });
}
