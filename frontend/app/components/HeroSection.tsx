import Link from "next/link";

export function HeroSection() {
  return (
    <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      <div className="lg:col-span-6 space-y-4">
        <h1 className="ui-page-header-title">
          Track your job hunt{" "}
          <span className="bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
            without the chaos
          </span>
        </h1>
        <p className="ui-page-header-subtitle max-w-2xl">
          Stop losing track of applications. See everything in one place, get
          matched with roles that fit, and never miss a follow-up again.
        </p>
      </div>

      <div className="lg:col-span-6">
        <div className="ui-card ui-card-neon p-6 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="ml-auto text-[10px] text-text-muted">Preview</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <div className="ui-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-text-title">My matches</h3>
                    <p className="text-[10px] text-text-muted">Updated 2m ago</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-text-body">Filters</div>
                    <div className="mt-1 flex gap-1.5">
                      <span className="ui-badge-soft text-[10px] px-2 py-0.5">React</span>
                      <span className="ui-badge-soft text-[10px] px-2 py-0.5">Node</span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2.5">
                  {[
                    { title: "React Developer", company: "Acme Ltd", score: 92 },
                    { title: "Node Developer", company: "Beta Inc", score: 78 },
                    { title: "Fullstack Engineer", company: "Gamma Co.", score: 85 },
                  ].map((job, idx) => (
                    <li key={idx} className="flex items-start justify-between gap-3 text-xs">
                      <div>
                        <div className="font-medium text-text-title">{job.title}</div>
                        <div className="text-text-muted text-[10px]">
                          {job.company} • {idx === 0 ? "1d" : idx === 1 ? "2d" : "4h"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-accent">{job.score}%</div>
                        <div className="text-[10px] text-text-muted">match</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="ui-card p-4 h-full flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-text-title">Notifications</h4>
                  <p className="text-[10px] text-text-muted mt-1">Immediate • Email</p>
                  <div className="mt-3 space-y-1.5">
                    <span className="block text-[10px] text-text-muted">Next alert</span>
                    <div className="text-xs font-medium text-text-title">2 new jobs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

