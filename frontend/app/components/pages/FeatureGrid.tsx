import { Zap, Search, Clock, CheckCircle, Mail } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const features: Feature[] = [
  {
    icon: <Zap size={18} className="text-accent" />,
    title: "Smart matching",
    desc: "Jobs are matched using your skills and the job’s tags. If tags aren’t available, the matcher intelligently falls back to analyzing the job title — ensuring relevant results every time.",
  },
  {
    icon: <Search size={18} className="text-accent" />,
    title: "Continuous scraping",
    desc: "Workers automatically scrape major job portals and upsert listings in real-time so you never miss new opportunities.",
  },
  {
    icon: <Clock size={18} className="text-accent" />,
    title: "Flexible notifications",
    desc: "Choose how you want updates: instant alerts, hourly summaries, or daily digests via email, Telegram, or web push.",
  },
  {
    icon: <CheckCircle size={18} className="text-accent" />,
    title: "De-duplication & upsert",
    desc: "A fingerprint-based engine removes duplicates and keeps your feed clean, even across multiple job portals.",
  },
  {
    icon: <Mail size={18} className="text-accent" />,
    title: "Privacy-first",
    desc: "Your data stays yours. No selling, no sharing, no tracking — just the jobs you care about.",
  },
  {
    icon: <Zap size={18} className="text-accent" />,
    title: "Laser-focused for job seekers",
    desc: "No clutter, no fluff. Just a clean dashboard that shows the jobs that actually match you, updated constantly and designed to save your time.",
  },
];

export function FeatureGrid() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-text-title md:text-4xl">
          What Job-Notifier does for you
        </h2>
        <p className="text-base text-text-muted max-w-2xl md:text-lg">
          Built for developers and power job-seekers — focused, minimal, and
          private.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {features.map((feature, idx) => (
          <article
            key={idx}
            className="ui-card ui-card-hover p-6 group"
            tabIndex={0}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-subtle flex items-center justify-center shrink-0 group-hover:bg-accent-light transition-colors">
                {feature.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-text-title text-base mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-text-muted leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
