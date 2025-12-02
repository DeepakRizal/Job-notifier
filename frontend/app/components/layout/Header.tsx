"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { useUserStore } from "@/lib/stores/user-store";
import { useShallow } from "zustand/shallow";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, loading, setUser } = useUserStore(
    useShallow((s) => ({
      user: s.user,
      loading: s.loading,
      setUser: s.setUser,
    }))
  );

  if (loading) return <nav>Loading...</nav>;

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
      });

      setUser(null);

      router.push("/login");
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-surface-border bg-surface/95 backdrop-blur-sm supports-backdrop-filter:bg-surface/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-accent to-accent-press text-[13px] font-semibold text-white shadow-sm">
              JN
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight text-text-title">
                Job-Notifier
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {user && (
              <Link
                href="/dashboard"
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "bg-accent/10 text-accent"
                    : "text-text-muted hover:bg-surface-subtle hover:text-text-title"
                }`}
              >
                Dashboard
              </Link>
            )}
            {user && (
              <Link
                href="/settings"
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive("/settings")
                    ? "bg-accent/10 text-accent"
                    : "text-text-muted hover:bg-surface-subtle hover:text-text-title"
                }`}
              >
                Settings
              </Link>
            )}

            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-text-muted hover:bg-surface-subtle hover:text-text-title transition-colors"
              >
                Logout
              </button>
            )}

            {!user && (
              <Link
                href="/login"
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive("/login")
                    ? "bg-accent/10 text-accent"
                    : "text-text-muted hover:bg-surface-subtle hover:text-text-title"
                }`}
              >
                Login
              </Link>
            )}

            {!user && (
              <Link
                href="/register"
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive("/register")
                    ? "bg-accent/10 text-accent"
                    : "text-text-muted hover:bg-surface-subtle hover:text-text-title"
                }`}
              >
                Register
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-text-muted hover:bg-surface-subtle hover:text-text-title transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={20} className="text-text-title" />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu - Overlay */}
      {mobileMenuOpen && (
        <div className="fixed top-[57px] left-0 right-0 z-50 md:hidden border-b border-surface-border bg-surface shadow-md animate-[slideDown_200ms_ease-out]">
          <nav className="mx-auto max-w-7xl px-4 py-3 space-y-1">
            {user && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive("/dashboard")
                      ? "bg-accent/10 text-accent"
                      : "text-text-muted hover:bg-surface-subtle hover:text-text-title"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive("/settings")
                      ? "bg-accent/10 text-accent"
                      : "text-text-muted hover:bg-surface-subtle hover:text-text-title"
                  }`}
                >
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted hover:bg-surface-subtle hover:text-text-title transition-colors"
                >
                  Logout
                </button>
              </>
            )}

            {!user && (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive("/login")
                      ? "bg-accent/10 text-accent"
                      : "text-text-muted hover:bg-surface-subtle hover:text-text-title"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive("/register")
                      ? "bg-accent/10 text-accent"
                      : "text-text-muted hover:bg-surface-subtle hover:text-text-title"
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
