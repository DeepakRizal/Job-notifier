interface Step {
  number: number;
  title: string;
  desc: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Tell us your skills",
    desc: "Add keywords you care about. Short terms like 'react', 'node', 'nextjs' work best.",
  },
  {
    number: 2,
    title: "We find new jobs",
    desc: "Workers scrape portals, upsert listings, and fingerprint duplicates.",
  },
  {
    number: 3,
    title: "Get instant alerts",
    desc: "Receive a notification when a high-scoring match appears. Open the job, apply fast.",
  },
];

export function HowItWorks() {
  return (
    <section className="mt-12">
      <div className="ui-card p-8">
        <h3 className="text-xl font-bold tracking-tight text-text-title">How it works</h3>
        <p className="text-text-muted mt-1 text-sm">Three steps to cleaner job hunting.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step) => (
            <div key={step.number} className="ui-card ui-card-hover p-5 flex flex-col gap-3">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accent-press text-white font-bold text-sm">
                {step.number}
              </div>
              <h5 className="font-semibold text-text-title text-sm">{step.title}</h5>
              <p className="text-xs text-text-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

