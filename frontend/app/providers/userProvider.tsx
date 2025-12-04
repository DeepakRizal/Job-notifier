"use client";

import { useEffect } from "react";
import { useUserStore } from "@/lib/stores/user-store";

interface UserProviderProps {
  children: React.ReactNode;
}

export default function UserProvider({ children }: UserProviderProps) {
  const loadUser = useUserStore((s) => s.loadUser);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  return <>{children}</>;
}
