import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-surface-border bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Left: Copyright */}
          <div className="text-center md:text-left">
            <p className="text-xs text-text-muted">
              © {currentYear} Job-Notifier. All rights reserved.
            </p>
          </div>

          {/* Right: Links */}
          <nav className="flex flex-wrap items-center justify-center gap-4 text-xs text-text-muted">
            <Link
              href="/dashboard"
              className="transition-colors hover:text-text-title"
            >
              Dashboard
            </Link>
            <Link
              href="/settings"
              className="transition-colors hover:text-text-title"
            >
              Settings
            </Link>
            <Link
              href="/login"
              className="transition-colors hover:text-text-title"
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

