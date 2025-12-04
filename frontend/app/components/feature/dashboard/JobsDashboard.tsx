"use client";
import { useQuery } from "@tanstack/react-query";
import { JobCard } from "../jobs/JobCard";
import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { fetchJobs } from "@/lib/queries/jobs";
import { JobDocument } from "@/types/job";
import ArcLoader from "../../layout/ArcLoader";

type JobStatus = "applied" | "interview" | "offer" | "rejected" | "saved";

type JobRole =
  | "Frontend Developer"
  | "Backend Developer"
  | "Full Stack Developer"
  | "Mobile Developer"
  | "DevOps Engineer";

const roleFilters: JobRole[] = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile Developer",
  "DevOps Engineer",
];

function timeSince(dateStr?: string | null) {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(seconds) || seconds < 0) return "Recently";
  if (seconds < 10) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return date.toLocaleDateString();
}

export function JobsDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<JobRole | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    data: jobs,
    isLoading,
    error,
  } = useQuery<JobDocument[], Error>({
    queryKey: ["jobs", { q: searchQuery.trim(), role: selectedFilter }],
    queryFn: () =>
      fetchJobs({
        q: searchQuery.trim() || undefined,
        role: selectedFilter || undefined,
      }),
    staleTime: 30_000,
  });

  console.log(jobs);

  const filteredJobs = (jobs ?? []).map((job: JobDocument) => {
    const minExp = job.experience?.min ?? job.minExperience ?? null;
    const maxExp = job.experience?.max ?? job.maxExperience ?? null;
    const expText =
      minExp != null && maxExp != null
        ? `${minExp}-${maxExp} yrs exp`
        : minExp != null
        ? `${minExp}+ yrs exp`
        : "Experience N/A";

    return {
      id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      status: "saved" as JobStatus,
      postedAgo: timeSince(job.createdAt ?? job.discoveredAt),
      matchScore: 0,
      skills: job.tags ?? [],
      salaryRange: expText,
      description: job.description ?? "",
      rawHTML: job.rawHTML ?? "",
      source: job.source ?? "",
      url: job.url ?? "",
    };
  });

  if (isLoading) {
    return <ArcLoader />;
  }

  if (error) {
    return <div>Error loading jobs: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="ui-card p-3">
        <div className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                placeholder="Search jobs by title, company, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ui-input w-full pl-10 pr-4"
              />
            </div>

            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-between gap-3 rounded-lg border border-surface-border bg-surface px-4 py-2.5 transition-colors hover:bg-surface-subtle sm:shrink-0"
            >
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-text-muted" />
                <span className="text-sm font-medium text-text-title whitespace-nowrap">
                  Filter by role
                </span>
                {selectedFilter && (
                  <span className="ui-badge text-[10px]">{selectedFilter}</span>
                )}
              </div>
              {isFilterOpen ? (
                <ChevronUp size={18} className="text-text-muted shrink-0" />
              ) : (
                <ChevronDown size={18} className="text-text-muted shrink-0" />
              )}
            </button>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isFilterOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-surface-border mt-1">
              <button
                onClick={() => setSelectedFilter(null)}
                className={`ui-chip ${
                  selectedFilter === null ? "ui-chip-active" : ""
                }`}
              >
                All Roles
              </button>
              {roleFilters.map((role) => (
                <button
                  key={role}
                  onClick={() =>
                    setSelectedFilter(selectedFilter === role ? null : role)
                  }
                  className={`ui-chip ${
                    selectedFilter === role ? "ui-chip-active" : ""
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">
          <span className="font-semibold text-text-title">
            {filteredJobs.length}
          </span>{" "}
          {filteredJobs.length === 1 ? "newly posted job" : "newly posted jobs"}{" "}
          found
          <span className="ml-2 text-xs text-text-muted">
            · Top jobs are the newest
          </span>
        </p>
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              title={job.title}
              company={job.company}
              location={job.location}
              status={job.status}
              postedAgo={job.postedAgo}
              salaryRange={job.salaryRange}
              skills={job.skills}
              url={job.url}
              // If you want JobCard to render description/source you can add props here
              // description={job.description}
              // source={job.source}
            />
          ))}
        </div>
      ) : (
        <div className="ui-card p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-subtle">
            <Search size={32} className="text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-text-title mb-2">
            No jobs found
          </h3>
          <p className="text-sm text-text-muted">
            Try adjusting your search or filters to find more matches.
          </p>
        </div>
      )}
    </div>
  );
}
