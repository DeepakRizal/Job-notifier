"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { fetchMyJobs } from "@/lib/queries/jobs";
import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";

import ArcLoader from "../../layout/ArcLoader";
import { useDebounce } from "@/app/hooks/useDebounce";
import { JobCard } from "../jobs/JobCard";
import { transformJob, type TransformedJob } from "./jobUtils";
import { JobFiltersModal } from "./JobFiltersModal";
import { useJobFilters } from "./useJobFilters";

const QUERY_STALE_TIME = 30_000;
const DEBOUNCE_DELAY = 500;

export function JobsDashboard() {
  const {
    isFilterModalOpen,
    setIsFilterModalOpen,
    draftFilters,
    appliedFilters,
    activeFiltersCount,
    handleApplyFilters,
    handleClearFilters,
    handleOpenFilterModal,
    handleToggleExperience,
    handleToggleRole,
    handleSetPostedAt,
    handleSetMode,
  } = useJobFilters();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["jobs", appliedFilters, debouncedQuery],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      fetchMyJobs({
        page: pageParam,
        q: debouncedQuery || undefined,
        role: appliedFilters.role ?? undefined,
        postedAt: appliedFilters.postedAt ?? undefined,
        experience:
          appliedFilters.experience.length > 0
            ? appliedFilters.experience.join(",")
            : undefined,
        mode: appliedFilters.mode ?? undefined,
      }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
    staleTime: QUERY_STALE_TIME,
  });

  const endOfListRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    onReachEnd: fetchNextPage,
  });

  const transformedJobs = useMemo<TransformedJob[]>(() => {
    const pages = data?.pages ?? [];
    const allJobs = pages.flatMap((page) => page.jobs.map(transformJob));

    const uniqueJobsMap = new Map<string, TransformedJob>();
    for (const job of allJobs) {
      if (!uniqueJobsMap.has(job.id)) {
        uniqueJobsMap.set(job.id, job);
      }
    }

    return Array.from(uniqueJobsMap.values());
  }, [data]);

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

      <JobFiltersModal
        open={isFilterModalOpen}
        onOpenChange={setIsFilterModalOpen}
        draftFilters={draftFilters}
        onClearFilters={handleClearFilters}
        onApplyFilters={handleApplyFilters}
        onToggleExperience={handleToggleExperience}
        onSetPostedAt={handleSetPostedAt}
        onSetMode={handleSetMode}
        onToggleRole={handleToggleRole}
      />

      {/* Job Results */}
      {transformedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 bg-stone-50 py-16">
          <p className="text-sm font-medium text-stone-700">No jobs found</p>
          <p className="mt-1 text-xs text-stone-500">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {transformedJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>

          <div ref={endOfListRef} className="h-px" />
        </>
      )}
    </div>
  );
}
