"use client";
import { useUserStore } from "@/lib/stores/user-store";
import { User, Mail, Lock, AlertTriangle, Trash2 } from "lucide-react";

export function AccountSettingsPanel() {
  const { user } = useUserStore();

  return (
    <section className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-stone-100 border border-stone-200">
            <User size={18} className="text-stone-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-stone-900">
              Account Settings
            </h2>
            <p className="text-sm text-stone-500">
              Manage your account details and security
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Account Details */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Email */}
          <div className="p-4 bg-stone-50 border border-stone-100 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-stone-200 mt-0.5">
                <Mail size={16} className="text-stone-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">
                  Email Address
                </p>
                <p className="mt-1 text-sm font-medium text-stone-800 truncate">
                  {user?.email || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="p-4 bg-stone-50 border border-stone-100 rounded-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-stone-200 mt-0.5">
                  <Lock size={16} className="text-stone-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">
                    Password
                  </p>
                  <p className="mt-1 text-sm text-stone-600">••••••••••••</p>
                </div>
              </div>
              <button className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-800 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors">
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-4 bg-stone-50 border border-stone-100 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 border-2 border-white shadow-sm">
                <span className="text-lg font-semibold text-emerald-700">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-800">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-stone-500">
                  Member since {new Date().getFullYear()}
                </p>
              </div>
            </div>
            <button className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-800 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors">
              Edit profile
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-stone-100" />

        {/* Danger Zone */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-red-500" />
            <h3 className="text-sm font-semibold text-red-600">Danger Zone</h3>
          </div>

          <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-stone-800">
                  Delete your account
                </p>
                <p className="mt-1 text-xs text-stone-500 max-w-md">
                  Permanently delete your account and all associated data
                  including tracked jobs, skills, and preferences. This action
                  cannot be undone.
                </p>
              </div>
              <button className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:text-white bg-white hover:bg-red-500 border border-red-200 hover:border-red-500 rounded-lg transition-all">
                <Trash2 size={14} />
                Delete account
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
