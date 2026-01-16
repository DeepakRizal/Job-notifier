import axios from "axios";
import { getAccessToken, setAccessToken } from "./auth";
import { refreshClient } from "./refreshClient";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    console.log("This code is running.");
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;

      const refreshRes = await refreshClient.post("/auth/refresh");
      setAccessToken(refreshRes.data.accessToken);

      error.config.headers.Authorization = `Bearer ${refreshRes.data.accessToken}`;

      return api(error.config);
    }
    return Promise.reject(error);
  }
);

export default api;
