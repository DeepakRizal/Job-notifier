import { Settings, Search, Bell, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Step {
  number: number;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Tell us your skills",
    desc: "Add keywords you care about — 'react', 'node', 'python'. Short terms work best for accurate matching.",
    icon: <Settings size={28} />,
  },
  {
    number: 2,
    title: "We find new jobs",
    desc: "Our workers continuously scrape job portals, dedupe listings, and surface only what matches your profile.",
    icon: <Search size={28} />,
  },
  {
    number: 3,
    title: "Get instant alerts",
    desc: "Receive notifications the moment a high-scoring match appears. Open the link and apply before anyone else.",
    icon: <Bell size={28} />,
  },
];

export function HowItWorks() {
  return (
    <section>
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 mb-6">
          <span className="text-xs font-medium text-stone-600">How it works</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
          Three simple steps to{" "}
          <span className="text-emerald-600">cleaner job hunting</span>
        </h2>
        <p className="mt-4 text-lg text-stone-600 leading-relaxed">
          Set up once, get matched automatically. No more endless scrolling through job boards.
        </p>
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Connection line - desktop only */}
        <div className="hidden lg:block absolute top-24 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-emerald-200 via-teal-200 to-emerald-200" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative">
              {/* Mobile connection line */}
              {idx < steps.length - 1 && (
                <div className="lg:hidden absolute left-8 top-20 w-0.5 h-full bg-gradient-to-b from-emerald-200 to-transparent" />
              )}
              
              <div className="relative bg-white rounded-2xl border border-stone-100 p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Step number badge */}
                <div className="absolute -top-4 left-8 inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/30">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mt-4 mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 border border-emerald-100">
                {step.icon}
              </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-stone-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
          <div className="text-left">
            <p className="font-semibold text-stone-900">Ready to get started?</p>
            <p className="text-sm text-stone-600">Create your account in under 60 seconds.</p>
          </div>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
          >
            Start free
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
