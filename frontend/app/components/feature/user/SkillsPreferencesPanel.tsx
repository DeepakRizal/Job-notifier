export function SkillsPreferencesPanel() {
  return (
    <section className="ui-card ui-card-hover space-y-4 p-5 md:p-6">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight text-text-title">
          Skills & preferences
        </h2>
        <span className="ui-badge text-[10px]">Used for auto-matching</span>
      </header>

      <div className="space-y-3">
        <p className="text-xs font-medium text-text-muted">Skills</p>
        <div className="flex flex-wrap items-center gap-2">
          <button className="ui-chip ui-chip-active">react</button>
          <button className="ui-chip">node</button>
          <button className="ui-chip">nextjs</button>
          <button className="ui-chip text-accent">+ Add</button>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium text-text-muted">
          Your preferences
        </p>
        <div className="space-y-2 text-xs text-text-body">
          <div className="flex items-center justify-between">
            <span>Email notifications</span>
            <div className="ui-toggle-pill ui-toggle-pill-on">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-success text-[10px] text-white">
                ✓
              </span>
              <span>ON</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Frequency</span>
            <div className="inline-flex items-center gap-1 rounded-full bg-surface-subtle px-2 py-1">
              <button className="ui-chip ui-chip-active px-2 py-0 text-[11px]">
                immediate
              </button>
              <button className="ui-chip px-2 py-0 text-[11px]">
                hourly
              </button>
              <button className="ui-chip px-2 py-0 text-[11px]">
                daily
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


