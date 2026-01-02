"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
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
import { transformJob, type TransformedJob } from "./jobUtils";

type JobRole =
  | "Frontend Developer"
  | "Backend Developer"
  | "Full Stack Developer"
  | "Mobile Developer"
  | "DevOps Engineer";

type WorkMode = "Remote" | "Hybrid" | "Onsite";

type PostedDateRange = "24h" | "3 days" | "7 days" | "30 days";

interface JobFilters {
  role: JobRole | null;
  postedAt: PostedDateRange | null;
  experience: string[];
  mode: WorkMode | null;
}

const ROLE_FILTERS: JobRole[] = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile Developer",
  "DevOps Engineer",
];

const EXPERIENCE_LEVELS = [
  { label: "Entry Level (0-2 yrs)", value: "entry" },
  { label: "Mid Level (3-5 yrs)", value: "mid" },
  { label: "Senior (6+ yrs)", value: "senior" },
] as const;

const POSTED_DATE_RANGES: PostedDateRange[] = [
  "24h",
  "3 days",
  "7 days",
  "30 days",
];

const WORK_MODES: WorkMode[] = ["Remote", "Hybrid", "Onsite"];

const QUERY_STALE_TIME = 30_000;
const DEBOUNCE_DELAY = 500;

const EMPTY_FILTERS: JobFilters = {
  role: null,
  postedAt: null,
  experience: [],
  mode: null,
};

function countActiveFilters(filters: JobFilters): number {
  return [
    filters.role,
    filters.postedAt,
    filters.mode,
    filters.experience.length > 0,
  ].filter(Boolean).length;
}

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function FilterButton({ label, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
        isActive
          ? "bg-emerald-500 text-white border-emerald-500"
          : "hover:bg-stone-50 border-stone-300"
      }`}
    >
      {label}
    </button>
  );
}

interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function FilterSection({ title, icon, children }: FilterSectionProps) {
  return (
    <div>
      <label className="font-medium flex items-center gap-2">
        {icon}
        {title}
      </label>
      <div className="flex gap-2 mt-3 flex-wrap">{children}</div>
    </div>
  );
}

export function JobsDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<JobFilters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<JobFilters>(EMPTY_FILTERS);

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters({ ...draftFilters });
    setIsFilterModalOpen(false);
  }, [draftFilters]);

  const handleClearFilters = useCallback(() => {
    setDraftFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
  }, []);

  const handleOpenFilterModal = useCallback(() => {
    setDraftFilters({ ...appliedFilters });
    setIsFilterModalOpen(true);
  }, [appliedFilters]);

  const {
    data: jobs,
    isLoading,
    error,
  } = useQuery<JobDocument[], Error>({
    queryKey: ["jobs", appliedFilters, debouncedQuery],
    queryFn: () =>
      fetchMyJobs({
        q: debouncedQuery || undefined,
        role: appliedFilters.role ?? undefined,
        postedAt: appliedFilters.postedAt ?? undefined,
        experience:
          appliedFilters.experience.length > 0
            ? appliedFilters.experience.join(",")
            : undefined,
        mode: appliedFilters.mode ?? undefined,
      }),
    staleTime: QUERY_STALE_TIME,
  });

  const transformedJobs = useMemo<TransformedJob[]>(() => {
    return jobs?.map(transformJob) ?? [];
  }, [jobs]);

  const activeFiltersCount = useMemo(
    () => countActiveFilters(appliedFilters),
    [appliedFilters]
  );

  const handleToggleExperience = useCallback((value: string) => {
    setDraftFilters((prev) => ({
      ...prev,
      experience: prev.experience.includes(value)
        ? prev.experience.filter((v) => v !== value)
        : [...prev.experience, value],
    }));
  }, []);

  const handleToggleRole = useCallback((role: JobRole) => {
    setDraftFilters((prev) => ({
      ...prev,
      role: prev.role === role ? null : role,
    }));
  }, []);

  const handleSetPostedAt = useCallback((range: PostedDateRange) => {
    setDraftFilters((prev) => ({
      ...prev,
      postedAt: prev.postedAt === range ? null : range,
    }));
  }, []);

  const handleSetMode = useCallback((mode: WorkMode) => {
    setDraftFilters((prev) => ({
      ...prev,
      mode: prev.mode === mode ? null : mode,
    }));
  }, []);

  if (isLoading) return <ArcLoader />;

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
        <p className="text-sm font-medium text-red-900">Error loading jobs</p>
        <p className="mt-1 text-xs text-red-700">
          {error instanceof Error ? error.message : "Please try again later"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search + Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
            size={18}
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs..."
            className="w-full rounded-full border border-stone-300 bg-stone-50 pl-10 pr-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200"
            aria-label="Search jobs"
          />
        </div>

        <button
          onClick={handleOpenFilterModal}
          className="flex items-center gap-2 rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-stone-700 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-colors"
          aria-label="Open filters"
        >
          <Filter size={16} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="rounded-full bg-emerald-500 text-white px-2 text-xs font-medium">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Modal */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Posted Date Filter */}
            <FilterSection title="Posted Date" icon={<Calendar size={16} />}>
              {POSTED_DATE_RANGES.map((range) => (
                <FilterButton
                  key={range}
                  label={range}
                  isActive={draftFilters.postedAt === range}
                  onClick={() => handleSetPostedAt(range)}
                />
              ))}
            </FilterSection>

            {/* Experience Filter */}
            <FilterSection title="Experience" icon={<Briefcase size={16} />}>
              {EXPERIENCE_LEVELS.map((level) => (
                <FilterButton
                  key={level.value}
                  label={level.label}
                  isActive={draftFilters.experience.includes(level.value)}
                  onClick={() => handleToggleExperience(level.value)}
                />
              ))}
            </FilterSection>

            {/* Work Mode Filter */}
            <FilterSection title="Work Mode" icon={<MapPin size={16} />}>
              {WORK_MODES.map((mode) => (
                <FilterButton
                  key={mode}
                  label={mode}
                  isActive={draftFilters.mode === mode}
                  onClick={() => handleSetMode(mode)}
                />
              ))}
            </FilterSection>

            {/* Job Role Filter */}
            <FilterSection title="Job Role" icon={<Filter size={16} />}>
              {ROLE_FILTERS.map((role) => (
                <FilterButton
                  key={role}
                  label={role}
                  isActive={draftFilters.role === role}
                  onClick={() => handleToggleRole(role)}
                />
              ))}
            </FilterSection>
          </div>

          <DialogFooter className="flex justify-between">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-md border border-stone-300 bg-white text-stone-700 text-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-colors"
            >
              Clear All
            </button>

            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 rounded-md bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
            >
              Apply Filters
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Job Results */}
      {transformedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 bg-stone-50 py-16">
          <p className="text-sm font-medium text-stone-700">No jobs found</p>
          <p className="mt-1 text-xs text-stone-500">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {transformedJobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      )}
    </div>
  );
}
