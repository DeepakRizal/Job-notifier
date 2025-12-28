"use client";

import { Bookmark, Building2, Clock, ExternalLink, MapPin } from "lucide-react";
import { useState } from "react";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  postedAgo: string;
  salaryRange?: string;
  skills?: string[];
  url?: string;
}

export function JobCard({
  id,
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
    <article className="job-card group relative bg-white rounded-xl overflow-hidden border border-stone-200/60 shadow-sm hover:shadow-md hover:border-stone-300/80 transition-all duration-300 ease-out">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-stone-900 mb-2.5 leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">
              {title}
            </h3>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-[18px] h-[18px] text-stone-400 shrink-0" />
                <span className="font-medium text-base text-stone-700">
                  {company}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <MapPin className="w-[18px] h-[18px] text-stone-400 shrink-0" />
                <span className="text-sm text-stone-600">{location}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsSaved(!isSaved)}
            aria-pressed={isSaved}
            aria-label={isSaved ? "Unsave job" : "Save job"}
            className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
              isSaved
                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                : "bg-stone-50 text-stone-400 hover:text-emerald-600 hover:bg-stone-100"
            }`}
            title={isSaved ? "Saved" : "Save job"}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {salaryRange && (
            <div className="px-3 py-1.5 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100">
              {salaryRange}
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-stone-600 bg-stone-50 border border-stone-100">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-medium">{postedAgo}</span>
          </div>
        </div>

        {skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-2">
              {visibleSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-medium text-stone-600 bg-stone-50 rounded-md border border-stone-100"
                >
                  {skill}
                </span>
              ))}

              {/* show more / less toggle */}
              {moreCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAllSkills((v) => !v)}
                  className="px-2.5 py-1 text-xs font-semibold text-emerald-600 bg-emerald-50/50 rounded-md border border-emerald-100 hover:bg-emerald-50 transition-colors"
                  aria-expanded={showAllSkills}
                >
                  {showAllSkills ? "Show less" : `+${moreCount} more`}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
          <a
            href={`/jobs/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-stone-700 bg-white border border-stone-200 hover:border-stone-300 hover:bg-stone-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-stone-500/20"
            aria-label="View job details"
          >
            <span>View Details</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            aria-label="Apply for this job"
          >
            Apply Now
          </a>
        </div>
      </div>
    </article>
  );
}
