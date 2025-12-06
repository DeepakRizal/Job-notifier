"use client";
import { useQuery } from "@tanstack/react-query";
import { JobCard } from "../jobs/JobCard";
import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { fetchMyJobs } from "@/lib/queries/jobs";
import { JobDocument } from "@/types/job";
import ArcLoader from "../../layout/ArcLoader";
import { useDebounce } from "@/app/hooks/useDebounce";

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
  const debouncedQuery = useDebounce(searchQuery, 500);
  const [selectedFilter, setSelectedFilter] = useState<JobRole | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    data: jobs,
    isLoading,
    error,
  } = useQuery<JobDocument[], Error>({
    queryKey: ["jobs", { q: debouncedQuery.trim(), role: selectedFilter }],
    queryFn: () =>
      fetchMyJobs({
        q: debouncedQuery.trim() || undefined,
        role: selectedFilter ?? undefined,
      }),
    staleTime: 30000,
  });

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
      {/* Search + Filter Card */}
      <div className="ui-card filter-shadow p-3">
        <div className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            {/* Search input (pill) */}
            <label htmlFor="job-search" className="sr-only">
              Search jobs
            </label>
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                aria-hidden
              />
              <input
                id="job-search"
                type="text"
                placeholder="Search jobs by title, company, or location..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  // reset page if you use paging: setPage(1)
                }}
                className="w-full pl-10 pr-10 py-2.5 rounded-full bg-surface border border-transparent outline-none filter-input-shadow  placeholder:text-text-muted transition"
                aria-label="Search jobs by title, company, or location"
              />

              {/* clear button (appears when there's text) */}
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    // reset page if you use paging: setPage(1)
                  }}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted hover:text-text-title"
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter toggle (lighter, pill) */}
            <button
              onClick={() => setIsFilterOpen((s) => !s)}
              aria-expanded={isFilterOpen}
              aria-controls="role-filters"
              className={`flex items-center gap-3 rounded-full px-4 py-2.5 transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                isFilterOpen
                  ? "shadow-sm bg-surface-subtle"
                  : "bg-transparent hover:bg-surface-subtle"
              }`}
            >
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-text-muted" />
                <span className="text-sm font-medium text-text-title whitespace-nowrap">
                  Filter by role
                </span>
                {selectedFilter && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                    {selectedFilter}
                  </span>
                )}
              </div>

              {isFilterOpen ? (
                <ChevronUp size={18} className="text-text-muted" />
              ) : (
                <ChevronDown size={18} className="text-text-muted" />
              )}
            </button>
          </div>

          {/* Expandable Role Filters */}
          <div
            id="role-filters"
            className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
              isFilterOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2 pt-3">
              <button
                onClick={() => {
                  setSelectedFilter(null);
                  // reset page if you use paging: setPage(1)
                }}
                className={`text-sm px-3 py-1 rounded-full transition ${
                  selectedFilter === null
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-text-muted hover:text-text-title"
                }`}
                aria-pressed={selectedFilter === null}
              >
                All Roles
              </button>

              {roleFilters.map((role) => {
                const active = selectedFilter === role;
                return (
                  <button
                    key={role}
                    onClick={() => {
                      setSelectedFilter(active ? null : role);
                      // reset page if you use paging: setPage(1)
                    }}
                    className={`text-sm px-3 py-1 rounded-full transition ${
                      active
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-text-muted hover:text-text-title"
                    }`}
                    aria-pressed={active}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">
          <span className="font-semibold text-text-title">
            {filteredJobs.length}
          </span>{" "}
          {filteredJobs.length === 1 ? "newly posted job" : "newly posted jobs"}{" "}
          found
          <span className="ml-3 text-xs text-text-muted">
            · Top jobs are the newest
          </span>
        </p>

        {/* Optional: small helper / CTA on right (showing sorting or refresh) */}
        <div className="text-xs text-text-muted hidden sm:block">
          {/* Example: last updated timestamp or a sort control — replace as needed */}
          Updated just now
        </div>
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              title={job.title}
              company={job.company}
              location={job.location}
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
