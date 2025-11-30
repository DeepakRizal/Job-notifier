import axios, { AxiosRequestConfig } from "axios";
import { ApiError } from "./errors";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function apiFetch<T = unknown>(
  path: string,
  opts: AxiosRequestConfig = {}
) {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  try {
    const res = await axios({
      url,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        ...(opts.headers || {}),
      },
      ...opts,
    });

    return res.data as T;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const data = err.response?.data;

      throw new ApiError(
        data?.error || err.message || "API error",
        status,
        data
      );
    }
  }
}
