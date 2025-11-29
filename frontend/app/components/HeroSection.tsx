"use client";

import Link from "next/link";
import { Zap, Clock } from "lucide-react";

export function HeroSection() {
  return (
    <header className="relative overflow-hidden py-16">
      {/* Decorative gradient blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-36 -top-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-30 transform-gpu"
        style={{
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(79,70,229,0.12) 50%, rgba(129,140,248,0.10) 100%)",
        }}
      />

      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Headline & CTAs */}
          <div className="lg:col-span-7">
            <div className="max-w-3xl mx-auto text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
                Be the first{" "}
                <span className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] bg-clip-text text-transparent">
                  to apply
                </span>
              </h1>

              <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                Get instant notifications for new job postings that match your
                skills. Apply before others and increase your chances of landing
                your dream role.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center sm:items-start sm:justify-start gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#3B82F6] text-white font-medium shadow-sm hover:bg-[#2563EB] active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(59,130,246,0.18)] transition-transform will-change-transform"
                  aria-label="Create an account"
                >
                  <Zap size={16} />
                  Get started — it&apos;s free
                </Link>
              </div>

              {/* Stats / trust row */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500 justify-center lg:justify-start">
                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/60 border border-slate-100 shadow-sm">
                    <Zap size={14} />
                  </span>
                  <span>
                    <strong className="text-slate-800">1.2k+</strong> matches
                    found
                  </span>
                </div>

                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/60 border border-slate-100 shadow-sm">
                    <Clock size={14} />
                  </span>
                  <span>
                    <strong className="text-slate-800">Realtime</strong> alerts
                  </span>
                </div>

                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/60 border border-slate-100 shadow-sm">
                    🚀
                  </span>
                  <span>
                    <strong className="text-slate-800">99.9%</strong> uptime
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Mini product preview */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              id="demo"
              className="w-full max-w-[360px] rounded-2xl border border-slate-100 bg-white/75 backdrop-blur-sm p-4 shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
              role="img"
              aria-label="Dashboard preview"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="ml-auto text-xs text-slate-400">Preview</div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-100 p-3 bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      React Developer
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Acme Ltd • 2 days
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-emerald-600">
                      92%
                    </span>
                    <span className="text-xs text-slate-400">match</span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-500">
                  Senior role — React, Next.js, TypeScript. Fast apply link
                  available.
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full border border-slate-200 bg-slate-50">
                    react
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full border border-slate-200 bg-slate-50">
                    nextjs
                  </span>
                  <span className="ml-auto text-xs text-slate-400">
                    Apply →
                  </span>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-400 flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-emerald-100" />
                <span>Upsert + dedupe example</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
