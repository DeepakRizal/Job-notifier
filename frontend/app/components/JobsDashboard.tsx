"use client";

import { JobCard } from "./JobCard";
import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

// Role categories
type JobRole = "Frontend Developer" | "Backend Developer" | "Full Stack Developer" | "Mobile Developer" | "DevOps Engineer";

// Dummy job data
const dummyJobs = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "TechCorp Inc.",
    location: "Remote · Global",
    status: "saved" as const,
    postedAgo: "2 hours ago",
    matchScore: 94,
    salaryRange: "$120k - $160k",
    role: "Frontend Developer" as JobRole,
    skills: ["React", "TypeScript", "Node.js"],
    description: "Looking for an experienced React developer to join our growing team.",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Hybrid · San Francisco",
    status: "saved" as const,
    postedAgo: "5 hours ago",
    matchScore: 89,
    salaryRange: "$130k - $170k",
    role: "Full Stack Developer" as JobRole,
    skills: ["React", "Next.js", "PostgreSQL"],
    description: "Build scalable web applications with modern technologies.",
  },
  {
    id: "3",
    title: "Frontend Developer",
    company: "DesignStudio",
    location: "Remote · US",
    status: "saved" as const,
    postedAgo: "1 day ago",
    matchScore: 87,
    salaryRange: "$100k - $140k",
    role: "Frontend Developer" as JobRole,
    skills: ["React", "Tailwind CSS", "Figma"],
    description: "Create beautiful and functional user interfaces.",
  },
  {
    id: "4",
    title: "React Native Developer",
    company: "MobileFirst",
    location: "Remote · Europe",
    status: "saved" as const,
    postedAgo: "1 day ago",
    matchScore: 82,
    salaryRange: "$110k - $150k",
    role: "Mobile Developer" as JobRole,
    skills: ["React Native", "TypeScript", "Redux"],
    description: "Develop cross-platform mobile applications.",
  },
  {
    id: "5",
    title: "Software Engineer - Frontend",
    company: "BigTech Co.",
    location: "Hybrid · New York",
    status: "saved" as const,
    postedAgo: "2 days ago",
    matchScore: 91,
    salaryRange: "$140k - $180k",
    role: "Frontend Developer" as JobRole,
    skills: ["React", "TypeScript", "GraphQL"],
    description: "Work on cutting-edge frontend technologies.",
  },
  {
    id: "6",
    title: "Senior Frontend Engineer",
    company: "CloudScale",
    location: "Remote · Worldwide",
    status: "saved" as const,
    postedAgo: "3 days ago",
    matchScore: 88,
    salaryRange: "$125k - $165k",
    role: "Frontend Developer" as JobRole,
    skills: ["React", "Next.js", "AWS"],
    description: "Lead frontend development for cloud-based platforms.",
  },
  {
    id: "7",
    title: "Backend Engineer",
    company: "API Solutions",
    location: "Remote · Global",
    status: "saved" as const,
    postedAgo: "4 hours ago",
    matchScore: 85,
    salaryRange: "$115k - $155k",
    role: "Backend Developer" as JobRole,
    skills: ["Node.js", "Python", "PostgreSQL"],
    description: "Build robust backend systems and APIs.",
  },
  {
    id: "8",
    title: "Senior Backend Developer",
    company: "DataFlow Inc.",
    location: "Hybrid · Seattle",
    status: "saved" as const,
    postedAgo: "6 hours ago",
    matchScore: 90,
    salaryRange: "$135k - $175k",
    role: "Backend Developer" as JobRole,
    skills: ["Java", "Spring Boot", "MongoDB"],
    description: "Design and implement scalable backend services.",
  },
  {
    id: "9",
    title: "Full Stack Developer",
    company: "WebCraft",
    location: "Remote · US",
    status: "saved" as const,
    postedAgo: "1 day ago",
    matchScore: 86,
    salaryRange: "$125k - $165k",
    role: "Full Stack Developer" as JobRole,
    skills: ["React", "Node.js", "PostgreSQL"],
    description: "End-to-end development of web applications.",
  },
  {
    id: "10",
    title: "DevOps Engineer",
    company: "CloudOps",
    location: "Remote · Global",
    status: "saved" as const,
    postedAgo: "2 days ago",
    matchScore: 83,
    salaryRange: "$120k - $160k",
    role: "DevOps Engineer" as JobRole,
    skills: ["Docker", "Kubernetes", "AWS"],
    description: "Manage infrastructure and deployment pipelines.",
  },
];

// Available role filters
const roleFilters: JobRole[] = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile Developer",
  "DevOps Engineer",
];

export function JobsDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<JobRole | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const filteredJobs = dummyJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !selectedFilter || job.role === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="ui-card p-3">
        <div className="space-y-3">
          {/* Search Bar and Filter Toggle - Same Line */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            {/* Search Bar */}
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

            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-between gap-3 rounded-lg border border-surface-border bg-surface px-4 py-2.5 transition-colors hover:bg-surface-subtle sm:flex-shrink-0"
            >
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-text-muted" />
                <span className="text-sm font-medium text-text-title whitespace-nowrap">
                  Filter by role
                </span>
                {selectedFilter && (
                  <span className="ui-badge text-[10px]">
                    {selectedFilter}
                  </span>
                )}
              </div>
              {isFilterOpen ? (
                <ChevronUp size={18} className="text-text-muted flex-shrink-0" />
              ) : (
                <ChevronDown size={18} className="text-text-muted flex-shrink-0" />
              )}
            </button>
          </div>

          {/* Role Filters - Collapsible Content */}
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
          <span className="font-semibold text-text-title">{filteredJobs.length}</span>{" "}
          {filteredJobs.length === 1 ? "newly posted job" : "newly posted jobs"} found
          <span className="ml-2 text-xs text-text-muted">· Top jobs are the newest</span>
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
              salaryRange={`Match: ${job.matchScore}%`}
              skills={job.skills}
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


