"use client";
import { updateUserSkill } from "@/lib/queries/user";
import { useUserStore } from "@/lib/stores/user-store";
import { useEffect, useRef, useState } from "react";

export function SkillsPreferencesPanel() {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(inputRef.current);
    if (adding) inputRef.current?.focus();
  }, [adding]);

  function handleClick() {
    setAdding(true);
    setError(null);
  }

  async function addSkill(value: string) {
    setLoading(true);
    const skill = value.trim();
    if (!skill) return;

    const isDuplicate = user?.skills.some((skill) => skill === value);

    if (isDuplicate) {
      return setError("Skill alreday exists!");
    }

    const updatedUser = await updateUserSkill(value);

    setUser(updatedUser);
    setAdding(false);
    setLoading(false);
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

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
            <div key={index}>
              <span key={index} className="ui-chip ">
                {skill}
                <button
                  onClick={() => {}}
                  aria-label="Cancel add"
                  className="text-xs cursor-pointer"
                >
                  ✕
                </button>
              </span>
            </div>
          ))}

          {!adding ? (
            <button onClick={handleClick} className="ui-chip">
              + Add
            </button>
          ) : (
            <div className="ui-chip flex items-center gap-2">
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a skill and press Enter"
                aria-label="Add skill"
                className="w-40 bg-transparent outline-none text-sm"
                disabled={loading}
              />
              <button
                onClick={() => addSkill(value)}
                disabled={loading}
                aria-label="Confirm add skill"
                className="text-xs"
              >
                {loading ? "Adding" : "Add"}
              </button>
              <button
                onClick={() => {
                  setAdding(false);
                  setValue("");
                }}
                aria-label="Cancel add"
                className="text-xs"
              >
                ✕
              </button>
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
          )}
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
