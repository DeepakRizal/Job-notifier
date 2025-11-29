import { JobCard } from "./JobCard";

export function JobsDashboard() {
  return (
    <section className="ui-card ui-card-hover grid gap-6 p-4 md:grid-cols-[220px,minmax(0,1fr)] md:p-6">
      {/* Sidebar */}
      <aside className="border-r border-surface-border pr-4 text-sm text-text-muted md:pr-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Navigation
          </p>
          <nav className="mt-3 space-y-1.5 text-sm">
            <button className="flex w-full items-center justify-between rounded-lg bg-surface-subtle px-2.5 py-1.5 text-left text-text-title">
              <span>My Jobs</span>
              <span className="ui-badge text-[10px]">7</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left hover:bg-surface-subtle">
              <span>Saved</span>
              <span className="ui-badge text-[10px]">12</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left hover:bg-surface-subtle">
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="space-y-2 text-xs">
          <p className="font-medium text-text-muted">Snapshot</p>
          <p>3 in interview · 1 offer · 0 rejected</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="space-y-4">
        {/* Header */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-text-title">
              My Jobs
            </h2>
            <p className="text-xs text-text-muted">
              Track where you&apos;ve applied and what needs follow-up.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-surface-subtle" />
            <span className="text-xs text-text-muted">Profile</span>
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-surface-border bg-surface-subtle/60 p-3 text-xs">
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-text-muted">
            Filter
          </span>
          <span className="ui-chip ui-chip-active">React</span>
          <span className="ui-chip">Node</span>
          <span className="ui-chip">Next.js</span>

          <span className="h-4 w-px bg-surface-border" />

          <button className="ui-chip">
            Sort
          </button>

          <div className="relative ml-auto flex-1 min-w-[140px] max-w-[220px]">
            <input
              className="ui-input h-8 pl-3 pr-8 text-xs"
              placeholder="Search jobs…"
            />
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-text-muted">
              ⌘K
            </span>
          </div>
        </div>

        {/* Job card list */}
        <div className="space-y-3">
          <JobCard
            title="React Developer"
            company="Acme Corp"
            location="Remote · India"
            status="interview"
            postedAgo="2 days ago"
            salaryRange="Match: 87%"
          />
          <JobCard
            title="Fullstack Engineer"
            company="Naukri"
            location="Hybrid · Bangalore"
            status="applied"
            postedAgo="5 days ago"
          />
        </div>
      </div>
    </section>
  );
}


