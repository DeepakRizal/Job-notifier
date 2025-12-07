import { Bookmark, Building2, Clock, ExternalLink, MapPin } from "lucide-react";
import { useState } from "react";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  postedAgo: string;
  salaryRange?: string;
  skills?: string[];
  url?: string;
}

export function JobCard({
  title,
  company,
  location,
  postedAgo,
  salaryRange,
  skills = [],
  url,
}: JobCardProps) {
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const initialVisibleCount = 4;
  const visibleSkills = showAllSkills
    ? skills
    : skills.slice(0, initialVisibleCount);
  const moreCount = Math.max(0, skills.length - initialVisibleCount);

  return (
    <article className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-transparent">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-sm text-slate-700">
                  {company}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-sm">{location}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsSaved(!isSaved)}
            aria-pressed={isSaved}
            aria-label={isSaved ? "Unsave job" : "Save job"}
            className={`shrink-0 p-2 rounded-md transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
              isSaved
                ? "bg-blue-50 text-blue-600"
                : "bg-transparent text-slate-400 hover:text-slate-600"
            }`}
            title={isSaved ? "Saved" : "Save job"}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Salary & Time (subtle) */}
        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
          {salaryRange && (
            <div className="px-2 py-1 rounded-md text-sm font-medium text-green-700 bg-green-50/60">
              {salaryRange}
            </div>
          )}
          <div className="flex items-center gap-1 px-2 py-1 rounded-md text-sm text-slate-600 bg-slate-50/60">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{postedAgo}</span>
          </div>
        </div>

        {/* Skills — plain small text, no borders */}
        {skills.length > 0 && (
          <div className="mb-5">
            <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500 leading-none">
              {visibleSkills.map((skill, idx) => (
                <span key={idx} className="text-xs font-medium mr-1">
                  {skill}
                  {/* separator dot except last */}
                  {idx !== visibleSkills.length - 1 && (
                    <span className=" text-slate-300">·</span>
                  )}
                </span>
              ))}

              {/* show more / less toggle */}
              {moreCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAllSkills((v) => !v)}
                  className="ml-1 text-xs font-medium text-slate-600 cursor-pointer hover:text-blue-600 transition-colors"
                  aria-expanded={showAllSkills}
                >
                  {showAllSkills ? "Show less" : `+${moreCount} more`}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-transparent hover:bg-slate-50 rounded-lg transition-colors"
            aria-label="View job details"
          >
            <span>View Details</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-lg shadow-md transition-transform transform hover:-translate-y-0.5"
            style={{
              background:
                "linear-gradient(90deg, rgba(37,99,235,1) 0%, rgba(29,78,216,1) 100%)",
            }}
            aria-label="Apply for this job"
          >
            Apply Now
          </a>
        </div>
      </div>
    </article>
  );
}
