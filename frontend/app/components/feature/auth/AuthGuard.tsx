"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/hooks/useUser";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if (user && !loading) router.replace("/");
  }, [user, loading, router]);

  if (loading || !user)
    return <div className="p-6 text-center">Loading...</div>;
  return <>{children}</>;
}
