"use client";
import { useUserStore } from "@/lib/stores/user-store";

export function SkillsPreferencesPanel() {
  const { user } = useUserStore();

  return (
    <section className="ui-card ui-card-hover space-y-4 p-5 md:p-6">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight text-text-title">
          Skills & preferences
        </h2>
        <span className="ui-badge text-[10px]">Used for auto-matching</span>
      </header>

      <div className="space-y-3">
        <p className="text-xs font-medium text-text-muted">Skills</p>
        <div className="flex flex-wrap items-center gap-2">
          {user?.skills.map((skill: string, index) => (
            <button key={index} className="ui-chip ">
              {skill}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium text-text-muted">Your preferences</p>
        <div className="space-y-2 text-xs text-text-body">
          <div className="flex items-center justify-between">
            <span>Email notifications</span>
            <div className="ui-toggle-pill ui-toggle-pill-on">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-success text-[10px] text-white">
                ✓
              </span>
              <span>ON</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
