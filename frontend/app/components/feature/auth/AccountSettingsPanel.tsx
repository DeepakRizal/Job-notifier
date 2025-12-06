"use client";
import { useUserStore } from "@/lib/stores/user-store";

export function AccountSettingsPanel() {
  const { user } = useUserStore();

  return (
    <section className="ui-card ui-card-hover space-y-4 p-5 md:p-6">
      <header>
        <h2 className="text-sm font-semibold tracking-tight text-text-title">
          Account & notifications
        </h2>
        <p className="mt-1 text-xs text-text-muted">
          Where alerts go and how Job-Notifier talks to you.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 text-xs">
          <p className="font-medium text-text-muted">Account</p>
          <div className="space-y-1 rounded-lg border border-surface-border bg-surface-subtle p-3">
            <div className="flex items-center justify-between">
              <span>Email</span>
              <span className="font-mono text-[11px] text-text-body">
                {user?.email}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span>Password</span>
              <button className="ui-btn-ghost px-0 py-0 text-[11px]">
                Change
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <p className="font-medium text-text-muted">Notifications</p>
          <div className="space-y-1 rounded-lg border border-surface-border bg-surface-subtle p-3">
            <div className="flex items-center justify-between">
              <span>Email</span>
              <span className="text-[11px] text-success">✓ Enabled</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-danger/40 bg-red-50/70 p-3 text-xs">
        <p className="font-semibold text-danger">Danger zone</p>
        <p className="text-text-muted">
          Deleting your account removes all tracked jobs and preferences.
        </p>
        <button className="ui-btn-ghost mt-1 border border-danger/40 px-3 py-1 text-[11px] text-danger hover:bg-red-100">
          Delete account
        </button>
      </div>
    </section>
  );
}
