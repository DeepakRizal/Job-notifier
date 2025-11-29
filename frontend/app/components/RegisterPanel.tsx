"use client";

import Link from "next/link";

export function RegisterPanel() {
  return (
    <section className="ui-card ui-card-hover mx-auto max-w-md p-6 md:p-8 motion-safe:animate-[fadeIn_320ms_ease-out]">
      <div className="space-y-2 mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-text-title">
          Create your account
        </h2>
        <p className="text-xs text-text-muted">
          Start tracking your job applications in minutes.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-muted" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            className="ui-input"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-1.5">
          <label
            className="text-xs font-medium text-text-muted"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            className="ui-input"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <label
            className="text-xs font-medium text-text-muted"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className="ui-input"
            placeholder="••••••••"
          />
          <p className="text-[10px] text-text-muted">
            Must be at least 8 characters
          </p>
        </div>

        <div className="space-y-1.5">
          <label
            className="text-xs font-medium text-text-muted"
            htmlFor="confirm-password"
          >
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            className="ui-input"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="ui-btn-primary mt-2 w-full motion-safe:transition-transform motion-safe:active:scale-[0.98]"
        >
          Create Account
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="ui-btn-ghost px-0 py-0 text-[11px] font-medium text-accent hover:bg-transparent"
        >
          Sign in here
        </Link>
      </p>
    </section>
  );
}
