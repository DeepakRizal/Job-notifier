import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="ui-page-shell">
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          {/* 404 Number with accent */}
          <div className="mb-8">
            <h1 className="text-8xl font-bold tracking-tight text-accent md:text-9xl">
              404
            </h1>
            <div className="mt-4 h-1 w-24 mx-auto bg-linear-to-r from-accent to-accent-press rounded-full" />
          </div>

          {/* Main Message */}
          <div className="ui-card p-8 md:p-10 mb-8">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-subtle">
                <Search size={32} className="text-accent" />
              </div>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-text-title mb-3 md:text-3xl">
              Page Not Found
            </h2>

            <p className="text-base text-text-body leading-relaxed mb-2 max-w-md mx-auto">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>

            <p className="text-sm text-text-muted">
              Don&apos;t worry, let&apos;s get you back on track.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="ui-btn-primary w-full sm:w-auto">
              <Home size={18} />
              Go Home
            </Link>

            <Link
              href="/dashboard"
              className="ui-btn-secondary w-full sm:w-auto"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-surface-border">
            <p className="text-xs text-text-muted mb-4">Quick Links</p>
            <nav className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link
                href="/dashboard"
                className="text-text-muted transition-colors hover:text-accent"
              >
                Dashboard
              </Link>
              <span className="text-surface-border">·</span>
              <Link
                href="/settings"
                className="text-text-muted transition-colors hover:text-accent"
              >
                Settings
              </Link>
              <span className="text-surface-border">·</span>
              <Link
                href="/login"
                className="text-text-muted transition-colors hover:text-accent"
              >
                Login
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
