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
    desc: "Match jobs to your skills using a token-based matcher that prioritizes title and company.",
  },
  {
    icon: <Search size={18} className="text-accent" />,
    title: "Continuous scraping",
    desc: "Workers scrape popular job portals and upsert listings so you never miss fresh roles.",
  },
  {
    icon: <Clock size={18} className="text-accent" />,
    title: "Flexible notifications",
    desc: "Immediate, hourly, or daily digests via email, Telegram, or web push. Set it once and relax.",
  },
  {
    icon: <CheckCircle size={18} className="text-accent" />,
    title: "De-duplication & upsert",
    desc: "Fingerprinting and upserts prevent duplicates and keep your feed clean.",
  },
  {
    icon: <Mail size={18} className="text-accent" />,
    title: "Privacy-first",
    desc: "Your data stays with you. We never sell your email or activity.",
  },
  {
    icon: <Zap size={18} className="text-accent" />,
    title: "Developer friendly",
    desc: "Open endpoints, easy self-hosting, and a worker you can tweak with Playwright or Cheerio.",
  },
];

export function FeatureGrid() {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold tracking-tight text-text-title">
        What Job-Notifier does for you
      </h2>
      <p className="text-text-muted mt-2 max-w-2xl">
        Built for developers and power job-seekers — focused, minimal, and private.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, idx) => (
          <article key={idx} className="ui-card ui-card-hover p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-subtle flex items-center justify-center flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-semibold text-text-title text-sm">{feature.title}</h4>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

