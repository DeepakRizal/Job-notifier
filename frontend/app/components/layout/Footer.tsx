"use client";

import { useUserStore } from "@/lib/stores/user-store";
import Link from "next/link";
import { useShallow } from "zustand/shallow";

export function Footer() {
  const year = new Date().getFullYear();

  const { user, loading, setUser } = useUserStore(
    useShallow((s) => ({
      user: s.user,
      loading: s.loading,
      setUser: s.setUser,
    }))
  );

  return (
    <footer className="border-t border-surface-border bg-surface/50 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold text-text-title">
              Job-Notifier
            </h3>
            <p className="mt-2 text-sm text-text-muted leading-relaxed">
              Smart job alerts tailored to your skills. Stay ahead, never miss
              the right opportunity.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-text-title mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-text-muted">
              {user ? (
                <>
                  <li>
                    <Link href="/dashboard" className="hover:text-text-title">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/settings" className="hover:text-text-title">
                      Settings
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/login" className="hover:text-text-title">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="hover:text-text-title">
                      Create Account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-text-title mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <Link href="/about" className="hover:text-text-title">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-text-title">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-text-title">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-text-title mb-3">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <Link href="/privacy" className="hover:text-text-title">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-text-title">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-surface-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-text-muted">
          <p>© {year} Job-Notifier. All rights reserved.</p>

          <div className="flex items-center gap-5 mt-4 md:mt-0">
            <a
              href="https://github.com/DeepakRizal"
              target="_blank"
              className="hover:text-text-title transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://x.com/DeepakRiza1"
              target="_blank"
              className="hover:text-text-title transition-colors"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
