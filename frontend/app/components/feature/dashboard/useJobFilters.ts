import { useCallback, useMemo, useState } from "react";

export type JobRole =
  | "Frontend Developer"
  | "Backend Developer"
  | "Full Stack Developer"
  | "Mobile Developer"
  | "DevOps Engineer";

export type WorkMode = "Remote" | "Hybrid" | "Onsite";

export type PostedDateRange = "24h" | "3 days" | "7 days" | "30 days";

export interface JobFilters {
  role: JobRole | null;
  postedAt: PostedDateRange | null;
  experience: string[];
  mode: WorkMode | null;
}

export const ROLE_FILTERS: JobRole[] = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile Developer",
  "DevOps Engineer",
];

export const EXPERIENCE_LEVELS = [
  { label: "Entry Level (0-2 yrs)", value: "entry" },
  { label: "Mid Level (3-5 yrs)", value: "mid" },
  { label: "Senior (6+ yrs)", value: "senior" },
] as const;

export const POSTED_DATE_RANGES: PostedDateRange[] = [
  "24h",
  "3 days",
  "7 days",
  "30 days",
];

export const WORK_MODES: WorkMode[] = ["Remote", "Hybrid", "Onsite"];

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

export function useJobFilters() {
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

  const activeFiltersCount = useMemo(
    () => countActiveFilters(appliedFilters),
    [appliedFilters]
  );

  return {
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
  };
}


