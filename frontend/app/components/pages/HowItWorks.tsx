import { Settings, Search, Bell } from "lucide-react";

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
    desc: "Add keywords you care about. Short terms like 'react', 'node', 'nextjs' work best.",
    icon: <Settings size={24} className="text-accent" />,
  },
  {
    number: 2,
    title: "We find new jobs",
    desc: "Workers scrape portals, upsert listings, and fingerprint duplicates.",
    icon: <Search size={24} className="text-accent" />,
  },
  {
    number: 3,
    title: "Get instant alerts",
    desc: "Receive a notification when a high-scoring match appears. Open the job, apply fast.",
    icon: <Bell size={24} className="text-accent" />,
  },
];

export function HowItWorks() {
  return (
    <section className="space-y-6">
      <div className="ui-card p-8 md:p-10">
        <div className="space-y-2 mb-8">
          <h3 className="text-3xl font-bold tracking-tight text-text-title md:text-4xl">How it works</h3>
          <p className="text-base text-text-muted md:text-lg">Three steps to cleaner job hunting.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div 
              key={step.number} 
              className="ui-card ui-card-hover p-6 flex flex-col gap-4 group"
              tabIndex={0}
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-accent-subtle group-hover:bg-accent-light transition-colors mx-auto">
                {step.icon}
              </div>
              <div className="space-y-2 text-center">
                <h5 className="font-semibold text-text-title text-lg">
                  {step.title}
                </h5>
                <p className="text-sm text-text-muted leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

