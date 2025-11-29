export function JobDetailPanel() {
  return (
    <section className="ui-card ui-card-hover space-y-4 p-5 md:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-text-title">
            React Developer @ Acme
          </h2>
          <p className="mt-1 text-xs text-text-muted">
            Posted 2 days ago · Source: Naukri
          </p>
        </div>
        <span className="ui-badge-soft text-[11px] font-semibold">
          Match: 87%
        </span>
      </header>

      <div className="space-y-3 text-xs text-text-body">
        <div>
          <p className="mb-1 font-medium text-text-muted">Description</p>
          <p className="leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            vehicula, elit eu facilisis luctus, nibh neque fermentum massa, at
            condimentum velit justo a odio. This is placeholder copy to show
            real-world density.
          </p>
        </div>

        <div>
          <p className="mb-1 font-medium text-text-muted">Requirements</p>
          <ul className="list-disc space-y-0.5 pl-4">
            <li>React</li>
            <li>Node</li>
            <li>Git and modern CI/CD</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button className="ui-btn-primary motion-safe:transition-transform motion-safe:hover:scale-[1.01] motion-safe:active:scale-[0.98]">
          Apply Now
        </button>
        <button className="ui-btn-secondary text-xs">
          Save Job
        </button>
      </div>
    </section>
  );
}


