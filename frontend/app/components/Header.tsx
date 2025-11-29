"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/settings", label: "Settings" },
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-surface-border bg-surface/95 backdrop-blur-sm supports-[backdrop-filter]:bg-surface/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-press text-[13px] font-semibold text-white shadow-sm">
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
            <div className="mx-1 h-4 w-px bg-surface-border" />
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-accent/10 text-accent"
                    : "text-text-muted hover:bg-surface-subtle hover:text-text-title"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

