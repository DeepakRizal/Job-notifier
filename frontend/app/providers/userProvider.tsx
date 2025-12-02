"use client";

import { useEffect } from "react";
import { useUserStore } from "@/lib/stores/user-store";

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const loadUser = useUserStore((s) => s.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return <>{children}</>;
}
