"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { AuthResponse, User } from "@/types/user";
import { isApiError } from "../../lib/errors";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = (await apiFetch<AuthResponse>("/auth/me", {
        method: "GET",
      })) as AuthResponse;

      setUser(data?.user);
    } catch (e: unknown) {
      setUser(null);

      if (isApiError(e)) {
        setError(e.message);
      } else {
        setError(e instanceof Error ? e.message : String(e));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const callRefresh = async () => {
      await refresh();
    };

    callRefresh();
  }, [refresh]);

  return { user, setUser, loading, error, refresh } as const;
}
