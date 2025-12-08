import { Zap, Search, Clock, CheckCircle, Shield, Target } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: <Target size={22} />,
    title: "Smart matching",
    desc: "Jobs are matched using your skills and the job's tags. If tags aren't available, the matcher intelligently falls back to analyzing the job title.",
    color: "emerald",
  },
  {
    icon: <Search size={22} />,
    title: "Continuous scraping",
    desc: "Workers automatically scrape major job portals and upsert listings in real-time so you never miss new opportunities.",
    color: "teal",
  },
  {
    icon: <Clock size={22} />,
    title: "Flexible notifications",
    desc: "Choose how you want updates: instant alerts, hourly summaries, or daily digests via email, Telegram, or web push.",
    color: "cyan",
  },
  {
    icon: <CheckCircle size={22} />,
    title: "De-duplication & upsert",
    desc: "A fingerprint-based engine removes duplicates and keeps your feed clean, even across multiple job portals.",
    color: "emerald",
  },
  {
    icon: <Shield size={22} />,
    title: "Privacy-first",
    desc: "Your data stays yours. No selling, no sharing, no tracking — just the jobs you care about.",
    color: "teal",
  },
  {
    icon: <Zap size={22} />,
    title: "Built for speed",
    desc: "No clutter, no fluff. A clean dashboard that shows the jobs that actually match you, designed to save your time.",
    color: "amber",
  },
];

const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    border: "group-hover:border-emerald-200",
  },
  teal: {
    bg: "bg-teal-50",
    icon: "text-teal-600",
    border: "group-hover:border-teal-200",
  },
  cyan: {
    bg: "bg-cyan-50",
    icon: "text-cyan-600",
    border: "group-hover:border-cyan-200",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
    border: "group-hover:border-amber-200",
  },
};

export function FeatureGrid() {
  return (
    <section>
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
          <Zap size={14} className="text-emerald-600" />
          <span className="text-xs font-medium text-emerald-700">Features</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
          Everything you need to{" "}
          <span className="text-emerald-600">land your next role</span>
        </h2>
        <p className="mt-4 text-lg text-stone-600 leading-relaxed">
          Built for developers and power job-seekers — focused, minimal, and private.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => {
          const colors = colorClasses[feature.color];
          return (
          <article
            key={idx}
              className={`group relative p-6 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${colors.border}`}
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors.bg} ${colors.icon} mb-5 transition-transform group-hover:scale-110`}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  {feature.title}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                  {feature.desc}
                </p>

              {/* Decorative corner gradient on hover */}
              <div
                className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at top right, ${
                    feature.color === "emerald"
                      ? "rgba(16,185,129,0.08)"
                      : feature.color === "teal"
                      ? "rgba(20,184,166,0.08)"
                      : feature.color === "cyan"
                      ? "rgba(6,182,212,0.08)"
                      : "rgba(245,158,11,0.08)"
                  } 0%, transparent 70%)`,
                }}
              />
          </article>
          );
        })}
      </div>
    </section>
  );
}
