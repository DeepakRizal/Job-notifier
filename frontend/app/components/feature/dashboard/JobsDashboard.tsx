"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, Filter, Calendar, Briefcase, MapPin } from "lucide-react";
import { fetchMyJobs } from "@/lib/queries/jobs";
import type { JobDocument } from "@/types/job";
import ArcLoader from "../../layout/ArcLoader";
import { useDebounce } from "@/app/hooks/useDebounce";
import { JobCard } from "../jobs/JobCard";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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

const experienceLevels = [
  { label: "Entry Level (0-2 yrs)", value: "entry" },
  { label: "Mid Level (3-5 yrs)", value: "mid" },
  { label: "Senior (6+ yrs)", value: "senior" },
];

function timeSince(dateStr?: string | null) {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (isNaN(seconds) || seconds < 0) return "Recently";
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function JobsDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [draftFilters, setDraftFilters] = useState({
    role: null as JobRole | null,
    postedAt: null as string | null,
    experience: [] as string[],
    mode: null as string | null,
  });

  const [appliedFilters, setAppliedFilters] = useState({
    q: "",
    role: null as JobRole | null,
    postedAt: null as string | null,
    experience: [] as string[],
    mode: null as string | null,
  });

  const applyFilters = () => {
    setAppliedFilters({
      q: debouncedQuery,
      role: draftFilters.role,
      postedAt: draftFilters.postedAt,
      experience: draftFilters.experience,
      mode: draftFilters.mode,
    });

    setIsFilterModalOpen(false);
  };

  const clearFilters = () => {
    const cleared = {
      role: null,
      postedAt: null,
      experience: [],
      mode: null,
    };

    setDraftFilters(cleared);
    setAppliedFilters({
      q: debouncedQuery,
      ...cleared,
    });
  };

  const {
    data: jobs,
    isLoading,
    error,
  } = useQuery<JobDocument[], Error>({
    queryKey: ["jobs", appliedFilters],
    queryFn: () =>
      fetchMyJobs({
        q: appliedFilters.q || undefined,
        role: appliedFilters.role ?? undefined,
        postedAt: appliedFilters.postedAt ?? undefined,
        experience:
          appliedFilters.experience.length > 0
            ? appliedFilters.experience.join(",")
            : undefined,
        mode: appliedFilters.mode ?? undefined,
      }),
    staleTime: 30000,
  });

  const filteredJobs =
    jobs?.map((job) => {
      const canonicalPostedAt =
        job.postedAt ?? job.discoveredAt ?? job.createdAt;

      return {
        id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        postedAgo: timeSince(canonicalPostedAt),
        salaryRange:
          job?.experience?.min != null && job?.experience?.max != null
            ? `${job.experience.min}-${job.experience.max} yrs`
            : "Experience N/A",
        skills: job.tags ?? [],
        url: job.url ?? "",
      };
    }) ?? [];

  const activeFiltersCount = [
    appliedFilters.role,
    appliedFilters.postedAt,
    appliedFilters.mode,
    appliedFilters.experience.length > 0,
  ].filter(Boolean).length;

  if (isLoading) return <ArcLoader />;
  if (error) return <div>Error loading jobs</div>;

  return (
    <div className="space-y-4">
      {/* Search + Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs..."
            className="w-full rounded-full border border-stone-300 bg-stone-50 pl-10 pr-4 py-2.5 text-stone-900"
          />
        </div>

        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center gap-2 rounded-full border px-4 py-2"
        >
          <Filter size={16} />
          Filters
          {activeFiltersCount > 0 && (
            <span className="rounded-full bg-stone-200 px-2 text-xs">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Posted Date */}
            <div>
              <label className="font-medium flex items-center gap-2">
                <Calendar size={16} /> Posted Date
              </label>
              <div className="flex gap-2 mt-3 flex-wrap">
                {["24h", "3 days", "7 days", "30 days"].map((range) => {
                  const active = range === draftFilters.postedAt;
                  return (
                    <button
                      key={range}
                      onClick={() =>
                        setDraftFilters((p) => ({
                          ...p,
                          postedAt: range,
                        }))
                      }
                      className={`px-3 py-1.5 rounded-full border text-sm ${
                        active
                          ? "bg-emerald-500 text-white"
                          : "hover:bg-stone-50"
                      }`}
                    >
                      {range}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="font-medium flex items-center gap-2">
                <Briefcase size={16} /> Experience
              </label>
              <div className="flex gap-2 mt-3 flex-wrap">
                {experienceLevels.map((lvl) => {
                  const active = draftFilters.experience.includes(lvl.value);
                  return (
                    <button
                      key={lvl.value}
                      onClick={() =>
                        setDraftFilters((p) => ({
                          ...p,
                          experience: active
                            ? p.experience.filter((v) => v !== lvl.value)
                            : [...p.experience, lvl.value],
                        }))
                      }
                      className={`px-3 py-1.5 rounded-full border text-sm ${
                        active
                          ? "bg-emerald-500 text-white"
                          : "hover:bg-stone-50"
                      }`}
                    >
                      {lvl.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Work Mode */}
            <div>
              <label className="font-medium flex items-center gap-2">
                <MapPin size={16} /> Work Mode
              </label>
              <div className="flex gap-2 mt-3">
                {["Remote", "Hybrid", "Onsite"].map((mode) => {
                  const active = draftFilters.mode === mode;
                  return (
                    <button
                      key={mode}
                      onClick={() => setDraftFilters((p) => ({ ...p, mode }))}
                      className={`px-3 py-1.5 rounded-full border text-sm ${
                        active
                          ? "bg-emerald-500 text-white"
                          : "hover:bg-stone-50"
                      }`}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Job Role */}
            <div>
              <label className="font-medium flex items-center gap-2">
                <Filter size={16} /> Job Role
              </label>
              <div className="flex gap-2 mt-3 flex-wrap">
                {roleFilters.map((role) => {
                  const active = draftFilters.role === role;
                  return (
                    <button
                      key={role}
                      onClick={() =>
                        setDraftFilters((p) => ({
                          ...p,
                          role: active ? null : role,
                        }))
                      }
                      className={`px-3 py-1.5 rounded-full border text-sm ${
                        active
                          ? "bg-emerald-500 text-white"
                          : "hover:bg-stone-50"
                      }`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-md border text-sm"
            >
              Clear All
            </button>

            <button
              onClick={applyFilters}
              className="px-4 py-2 rounded-md bg-emerald-500 text-white text-sm"
            >
              Apply Filters
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} {...job} />
        ))}
      </div>
    </div>
  );
}
