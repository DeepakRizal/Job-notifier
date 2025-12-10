"use client";

import Link from "next/link";
import { Zap, Clock, Shield, ArrowRight } from "lucide-react";
import { useUserStore } from "@/lib/stores/user-store";

export function HeroSection() {
  const { user } = useUserStore();

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        {/* Top-right gradient blob */}
        <div
          aria-hidden
          className="absolute -right-40 -top-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(5,150,105,0.1) 50%, transparent 70%)",
          }}
        />
        {/* Bottom-left gradient blob */}
        <div
          aria-hidden
          className="absolute -left-40 bottom-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 60%)",
          }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="max-w-2xl">
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-stone-900">
              Be the first{" "}
              <span className="relative">
                <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  to apply
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                >
                  <path
                    d="M2 10C50 4 150 4 198 10"
                    stroke="url(#underline-gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="underline-gradient"
                      x1="0"
                      y1="0"
                      x2="200"
                      y2="0"
                    >
                      <stop stopColor="#10b981" />
                      <stop offset="1" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-8 text-lg sm:text-xl text-stone-600 leading-relaxed max-w-xl">
              Get instant notifications for new job postings that match your
              skills. Apply before others and increase your chances of landing
              your dream role.
            </p>

            {/* CTAs */}
            {!user && (
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-3 px-7 py-4 rounded-xl bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 hover:shadow-emerald-500/30 hover:shadow-xl active:scale-[0.98] transition-all duration-200"
                >
                  <Zap
                    size={20}
                    className="transition-transform group-hover:rotate-12"
                  />
                  Get started — it&apos;s free
                </Link>
              </div>
            )}

            {user && (
              <form className="mt-6 flex gap-2 max-w-md">
                <input
                  placeholder="e.g. mern stack developer fresher"
                  className="flex-1 rounded-lg px-4 py-3 border border-stone-200 outline-none"
                  aria-label="Search query"
                />
                <button
                  type="submit"
                  className="rounded-lg px-4 py-3 bg-emerald-500 cursor-pointer text-white font-semibold"
                >
                  Track
                </button>
              </form>
            )}

            {/* Trust indicators */}
            <div className="mt-12 pt-8 border-t border-stone-100">
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-stone-100 shadow-sm">
                    <Clock size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900">Realtime</div>
                    <div className="text-stone-500 text-xs">Instant alerts</div>
                  </div>
                </div>

                <div className="w-px h-8 bg-stone-200 hidden sm:block" />

                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-stone-100 shadow-sm">
                    <Shield size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900">Private</div>
                    <div className="text-stone-500 text-xs">
                      Your data stays yours
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product Preview */}
          <div className="relative lg:pl-8">
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-linear-to-tr from-emerald-100/50 to-amber-50/30 rounded-3xl blur-2xl scale-95 -z-10" />

            <div className="relative bg-white rounded-2xl border border-stone-200/60 shadow-2xl shadow-stone-200/50 overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 border-b border-stone-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="w-full max-w-xs mx-auto h-6 rounded-md bg-white border border-stone-200 flex items-center px-3">
                    <span className="text-[10px] text-stone-400">
                      job-notifier.app/dashboard
                    </span>
                  </div>
                </div>
                <div className="text-xs text-stone-400">Preview</div>
              </div>

              {/* Dashboard content */}
              <div className="p-5">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="text-lg font-bold text-emerald-700">24</div>
                    <div className="text-[10px] text-emerald-600">
                      New today
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <div className="text-lg font-bold text-stone-700">156</div>
                    <div className="text-[10px] text-stone-500">This week</div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="text-lg font-bold text-amber-700">92%</div>
                    <div className="text-[10px] text-amber-600">Match rate</div>
                  </div>
                </div>

                {/* Job card */}
                <div className="rounded-xl border border-stone-100 p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-stone-900">
                          Senior React Developer
                        </div>
                        <span className="px-1.5 py-0.5 text-[9px] font-medium bg-emerald-100 text-emerald-700 rounded">
                          NEW
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        Acme Technologies • Remote • Posted 2h ago
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-emerald-600">
                        92%
                      </span>
                      <div className="text-[10px] text-stone-400">match</div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-stone-600 line-clamp-2">
                    We&apos;re looking for a senior React developer with Next.js
                    and TypeScript experience to join our growing team...
                  </p>

                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] px-2 py-1 rounded-full bg-stone-100 text-stone-600 font-medium">
                      React
                    </span>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-stone-100 text-stone-600 font-medium">
                      Next.js
                    </span>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-stone-100 text-stone-600 font-medium">
                      TypeScript
                    </span>
                    <span className="ml-auto text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                      Apply now <ArrowRight size={10} />
                    </span>
                  </div>
                </div>

                {/* Mini job list */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-100">
                    <div>
                      <div className="text-xs font-medium text-stone-800">
                        Full Stack Engineer
                      </div>
                      <div className="text-[10px] text-stone-500">
                        TechCorp • 4h ago
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600">
                      87%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-100">
                    <div>
                      <div className="text-xs font-medium text-stone-800">
                        Frontend Lead
                      </div>
                      <div className="text-[10px] text-stone-500">
                        StartupXYZ • 6h ago
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600">
                      84%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
