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
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const {
    data: jobs,
    isLoading,
    error,
  } = useQuery<JobDocument[], Error>({
    queryKey: ["jobs", debouncedQuery, selectedRole],
    queryFn: () =>
      fetchMyJobs({
        q: debouncedQuery || undefined,
        role: selectedRole ?? undefined,
      }),
    staleTime: 30000,
  });

  const filteredJobs =
    jobs?.map((job) => ({
      id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      postedAgo: timeSince(job.createdAt ?? job.discoveredAt),
      salaryRange:
        job.experience?.min && job.experience?.max
          ? `${job.experience.min}-${job.experience.max} yrs`
          : "Experience N/A",
      skills: job.tags ?? [],
      url: job.url ?? "",
    })) ?? [];

  const activeFiltersCount = [
    selectedRole,
    selectedExperience.length > 0,
    locationFilter,
    startDate || endDate,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedRole(null);
    setSelectedExperience([]);
    setLocationFilter("");
    setStartDate("");
    setEndDate("");
  };

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
            className="w-full rounded-full border border-stone-300 bg-stone-50 pl-10 pr-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
          />
        </div>

        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="flex shrink-0 items-center gap-2 rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-stone-700 hover:bg-stone-100 focus:ring-2 focus:ring-stone-200"
        >
          <Filter size={16} />
          Filters
          {activeFiltersCount > 0 && (
            <span className="rounded-full bg-stone-200 px-2 text-xs text-stone-700">
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

          <div className="space-y-4 py-4">
            {/* Date */}
            <div>
              <label className="font-medium flex gap-2 items-center">
                <Calendar size={16} /> Posted Date
              </label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="font-medium flex gap-2 items-center">
                <Briefcase size={16} /> Experience
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {experienceLevels.map((lvl) => {
                  const active = selectedExperience.includes(lvl.value);
                  return (
                    <button
                      key={lvl.value}
                      onClick={() =>
                        setSelectedExperience(
                          active
                            ? selectedExperience.filter((v) => v !== lvl.value)
                            : [...selectedExperience, lvl.value]
                        )
                      }
                      className={`px-3 py-1.5 rounded-full border ${
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

            {/* Location */}
            <div>
              <label className="font-medium flex gap-2 items-center">
                <MapPin size={16} /> Location
              </label>
              <input
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full mt-2 border rounded px-3 py-2"
                placeholder="Remote, USA, India..."
              />
            </div>

            {/* Roles */}
            <div>
              <label className="font-medium flex gap-2 items-center">
                <Filter size={16} /> Job Role
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {roleFilters.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setSelectedRole(selectedRole === role ? null : role);
                      setIsFilterModalOpen(false);
                    }}
                    className={`px-3 py-1.5 rounded-full border ${
                      selectedRole === role
                        ? "bg-emerald-500 text-white"
                        : "hover:bg-stone-50"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <button onClick={clearFilters} className="px-4 py-2 border rounded">
              Clear All
            </button>
            <button
              onClick={() => setIsFilterModalOpen(false)}
              className="px-4 py-2 bg-emerald-500 text-white rounded"
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
