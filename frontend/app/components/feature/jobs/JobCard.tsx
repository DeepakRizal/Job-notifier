import { useState } from "react";

type JobStatus = "applied" | "interview" | "offer" | "rejected" | "saved";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  status: JobStatus;
  postedAgo: string;
  salaryRange?: string;
  skills?: string[];
  url?: string;
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
  skills = [],
  url,
}: JobCardProps) {
  const isPositive = status === "interview" || status === "offer";
  const isNegative = status === "rejected";
  const [showAllSkills, setShowAllSkills] = useState(false);

  const visibleSkills = showAllSkills ? skills : skills.slice(0, 4);

  return (
    <article className="ui-card ui-card-hover ui-card-neon p-5 md:p-6">
      <div className="flex flex-col gap-4">
        {/* Header Section */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold tracking-tight text-text-title md:text-xl">
              {title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
              <span className="ui-badge ui-badge-soft">{company}</span>
              <span className="ui-badge">{location}</span>
              {salaryRange && (
                <span className="ui-badge ui-badge-success text-[11px] md:text-xs font-semibold">
                  {salaryRange}
                </span>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={[
              "ui-badge text-[11px] md:text-xs w-fit",
              isPositive ? "ui-badge-success" : "",
              isNegative ? "border-danger/40 text-danger bg-red-50/80" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {statusLabel[status]}
          </span>
        </div>

        {/* Skills Tags */}
        {skills.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {visibleSkills.map((skill, idx) => (
              <span
                key={idx}
                className="ui-badge text-[10px] md:text-xs border-accent/20 text-accent bg-accent-subtle/50"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllSkills((prev) => !prev)}
                className="ui-badge text-[10px] md:text-xs text-text-muted hover:bg-surface-subtle transition-colors"
              >
                {showAllSkills ? "Show less" : `+${skills.length - 4} more`}
              </button>
            )}
          </div>
        )}

        {/* Footer Section */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-surface-border">
          <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
            <span className="rounded-full bg-surface-subtle px-2.5 py-1">
              Posted {postedAgo}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="ui-btn-ghost text-xs md:text-sm"
            >
              View Details
            </a>
            <a href={url} className="ui-btn-primary text-xs md:text-sm">
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
