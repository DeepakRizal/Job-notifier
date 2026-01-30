"use client";

import { create } from "zustand";

import { AuthResponse, User } from "@/types/user";

import { isApiError } from "../errors";
import { apiFetch } from "../apiFetch";
import { getAccessToken, removeAccessToken, setAccessToken } from "../auth";
import { refreshClient } from "../refreshClient";

interface UserStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  authReady: boolean;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: true,
  error: null,
  authReady: false,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  logout: () => {
    removeAccessToken();
    set({ user: null });
  },

  loadUser: async () => {
    set({ loading: true, error: null });
    try {
      if (!getAccessToken()) {
        const refreshRes = await refreshClient.post("/auth/refresh");
        const newAccessToken = refreshRes.data?.accessToken ?? null;
        setAccessToken(newAccessToken);
      }

      const res = (await apiFetch("/auth/me")) as AuthResponse;
      set({ user: res.user });
    } catch (error) {
      if (!isApiError(error)) console.log(error);
      set({
        user: null,
        error: (error as Error).message ?? "Failed to load user",
      });
    } finally {
      set({ loading: false, authReady: true });
    }
  },
}));
