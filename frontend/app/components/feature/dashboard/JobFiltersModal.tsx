import { Calendar, Briefcase, Filter, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EXPERIENCE_LEVELS,
  JobFilters,
  JobRole,
  POSTED_DATE_RANGES,
  ROLE_FILTERS,
  PostedDateRange,
  WorkMode,
  WORK_MODES,
} from "./useJobFilters";

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

interface JobFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draftFilters: JobFilters;
  onClearFilters: () => void;
  onApplyFilters: () => void;
  onToggleExperience: (value: string) => void;
  onSetPostedAt: (range: PostedDateRange) => void;
  onSetMode: (mode: WorkMode) => void;
  onToggleRole: (role: JobRole) => void;
}

export function JobFiltersModal({
  open,
  onOpenChange,
  draftFilters,
  onClearFilters,
  onApplyFilters,
  onToggleExperience,
  onSetPostedAt,
  onSetMode,
  onToggleRole,
}: JobFiltersModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <FilterSection title="Posted Date" icon={<Calendar size={16} />}>
            {POSTED_DATE_RANGES.map((range) => (
              <FilterButton
                key={range}
                label={range}
                isActive={draftFilters.postedAt === range}
                onClick={() => onSetPostedAt(range)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Experience" icon={<Briefcase size={16} />}>
            {EXPERIENCE_LEVELS.map((level) => (
              <FilterButton
                key={level.value}
                label={level.label}
                isActive={draftFilters.experience.includes(level.value)}
                onClick={() => onToggleExperience(level.value)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Work Mode" icon={<MapPin size={16} />}>
            {WORK_MODES.map((mode) => (
              <FilterButton
                key={mode}
                label={mode}
                isActive={draftFilters.mode === mode}
                onClick={() => onSetMode(mode)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Job Role" icon={<Filter size={16} />}>
            {ROLE_FILTERS.map((role) => (
              <FilterButton
                key={role}
                label={role}
                isActive={draftFilters.role === role}
                onClick={() => onToggleRole(role)}
              />
            ))}
          </FilterSection>
        </div>

        <DialogFooter className="flex justify-between">
          <button
            onClick={onClearFilters}
            className="px-4 py-2 rounded-md border border-stone-300 bg-white text-stone-700 text-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-colors"
          >
            Clear All
          </button>

          <button
            onClick={onApplyFilters}
            className="px-4 py-2 rounded-md bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
          >
            Apply Filters
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


