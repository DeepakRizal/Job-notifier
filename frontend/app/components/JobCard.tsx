type JobStatus = "applied" | "interview" | "offer" | "rejected" | "saved";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  status: JobStatus;
  postedAgo: string;
  salaryRange?: string;
}

const statusLabel: Record<JobStatus, string> = {
  applied: "Applied",
  interview: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
  saved: "Saved",
};

export function JobCard({
  title,
  company,
  location,
  status,
  postedAgo,
  salaryRange,
}: JobCardProps) {
  const isPositive = status === "interview" || status === "offer";
  const isNegative = status === "rejected";

  return (
    <article className="ui-card ui-card-hover ui-card-neon flex items-start justify-between gap-4 p-5 md:p-6">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold tracking-tight text-text-title md:text-xl">
              {title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs md:text-[13px]">
              <span className="ui-badge ui-badge-soft">{company}</span>
              <span className="ui-badge">{location}</span>
              {salaryRange ? (
                <span className="ui-badge text-[11px] md:text-xs">
                  {salaryRange}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted md:text-[13px]">
          <span className="rounded-full bg-surface-subtle px-2 py-0.5">
            Posted {postedAgo}
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>Serious tracking · Fast updates · Auto-matching</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <span
          className={[
            "ui-badge text-[11px] md:text-xs",
            isPositive ? "ui-badge-success" : "",
            isNegative ? "border-danger/40 text-danger bg-red-50/80" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {statusLabel[status]}
        </span>

        <div className="flex items-center gap-2">
          <button className="ui-btn-ghost hidden text-xs md:inline-flex">
            Notes
          </button>
          <button className="ui-btn-secondary text-xs md:text-sm">
            Open board
          </button>
        </div>
      </div>
    </article>
  );
}


