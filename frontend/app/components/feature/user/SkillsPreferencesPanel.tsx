"use client";
import { updateUserSkill } from "@/lib/queries/user";
import { useUserStore } from "@/lib/stores/user-store";
import { Target, Plus, X, Bell, Mail, MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function SkillsPreferencesPanel() {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    const isDuplicate = user?.skills.some((s) => s === value);

    if (isDuplicate) {
      setError("Skill already exists!");
      setLoading(false);
      return;
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
      addSkill(value);
    }
    if (e.key === "Escape") {
      setAdding(false);
      setValue("");
    }
  }

  return (
    <section className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100">
              <Target size={18} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900">
                Skills & Preferences
              </h2>
              <p className="text-sm text-stone-500">
                Configure how jobs are matched to your profile
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full">
            Auto-matching
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Skills Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-stone-800">Your Skills</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Add skills to get matched with relevant job postings
              </p>
            </div>
            {!adding && (
              <button
                onClick={handleClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              >
                <Plus size={14} />
                Add skill
              </button>
            )}
          </div>

          {/* Skills list */}
          <div className="flex flex-wrap items-center gap-2">
            {user?.skills.map((skill: string, index) => (
              <div
                key={index}
                className="group inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors"
              >
                <span>{skill}</span>
                <button
                  onClick={() => {}}
                  aria-label={`Remove ${skill}`}
                  className="text-stone-400 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {/* Add skill input */}
            {adding && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-emerald-300 rounded-lg shadow-sm">
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type skill..."
                  aria-label="Add skill"
                  className="w-32 bg-transparent outline-none text-sm text-stone-800 placeholder:text-stone-400"
                  disabled={loading}
                />
                <button
                  onClick={() => addSkill(value)}
                  disabled={loading || !value.trim()}
                  className="px-2 py-0.5 text-xs font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                >
                  {loading ? "..." : "Add"}
                </button>
                <button
                  onClick={() => {
                    setAdding(false);
                    setValue("");
                    setError(null);
                  }}
                  className="text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {user?.skills.length === 0 && !adding && (
              <p className="text-sm text-stone-400 italic">
                No skills added yet. Click &quot;Add skill&quot; to get started.
              </p>
            )}
          </div>

          {error && (
            <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
              {error}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-stone-100" />

        {/* Notification Preferences */}
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-stone-800">
              Notification Preferences
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Choose how you want to receive job alerts
            </p>
          </div>

          <div className="space-y-3">
            {/* Email notifications */}
            <div className="flex items-center justify-between p-4 bg-stone-50 border border-stone-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-stone-200">
                  <Mail size={16} className="text-stone-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800">
                    Email notifications
                  </p>
                  <p className="text-xs text-stone-500">
                    Receive job alerts via email
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="text-xs font-medium text-emerald-700">Enabled</span>
              </div>
            </div>

            {/* Push notifications - coming soon */}
            <div className="flex items-center justify-between p-4 bg-stone-50/50 border border-stone-100 rounded-xl opacity-60">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-stone-200">
                  <Bell size={16} className="text-stone-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-600">
                    Push notifications
                  </p>
                  <p className="text-xs text-stone-400">
                    Browser push notifications
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-medium text-stone-500 bg-stone-100 rounded-full">
                Coming soon
              </span>
            </div>

            {/* Telegram - coming soon */}
            <div className="flex items-center justify-between p-4 bg-stone-50/50 border border-stone-100 rounded-xl opacity-60">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-stone-200">
                  <MessageSquare size={16} className="text-stone-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-600">
                    Telegram
                  </p>
                  <p className="text-xs text-stone-400">
                    Receive alerts on Telegram
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-medium text-stone-500 bg-stone-100 rounded-full">
                Coming soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
