"use client";

import { create } from "zustand";

import { AuthResponse, User } from "@/types/user";
import { apiFetch } from "../api";
import { isApiError } from "../errors";

interface UserStore {
  user: User | null;
  loading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: true,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null }),

  loadUser: async () => {
    set({ loading: true, error: null });
    try {
      const res = (await apiFetch("/auth/me")) as AuthResponse;
      set({ user: res.user });
    } catch (error) {
      if (!isApiError(error)) console.log(error);
      set({
        user: null,
        error: (error as Error).message ?? "Failed to load user",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
