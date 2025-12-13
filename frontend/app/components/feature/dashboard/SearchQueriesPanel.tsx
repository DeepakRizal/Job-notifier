"use client";
import { useState } from "react";
import {
  Plus,
  Power,
  PowerOff,
  Trash2,
  Edit2,
  Search,
  Clock,
  TrendingUp,
  BarChart3,
  Calendar,
} from "lucide-react";

// Dummy data interface
interface QueryWithStats {
  _id: string;
  query: string;
  active: boolean;
  createdAt: string;
  lastScrapedAt: string | null;
  jobsFound: number;
  jobsFoundToday: number;
  jobsFoundThisWeek: number;
  averageJobsPerScrape: number;
  lastScrapeDuration?: number; // in seconds
}

// Dummy data - Replace with real API calls later
const DUMMY_QUERIES: QueryWithStats[] = [
  {
    _id: "1",
    query: "mern stack developer fresher",
    active: true,
    createdAt: "2024-01-15T10:30:00Z",
    lastScrapedAt: "2024-01-20T14:25:00Z",
    jobsFound: 156,
    jobsFoundToday: 12,
    jobsFoundThisWeek: 45,
    averageJobsPerScrape: 15,
    lastScrapeDuration: 45,
  },
  {
    _id: "2",
    query: "react native developer",
    active: true,
    createdAt: "2024-01-10T09:15:00Z",
    lastScrapedAt: "2024-01-20T14:20:00Z",
    jobsFound: 89,
    jobsFoundToday: 8,
    jobsFoundThisWeek: 32,
    averageJobsPerScrape: 12,
    lastScrapeDuration: 38,
  },
  {
    _id: "3",
    query: "full stack developer remote",
    active: false,
    createdAt: "2024-01-05T11:00:00Z",
    lastScrapedAt: "2024-01-19T10:15:00Z",
    jobsFound: 234,
    jobsFoundToday: 0,
    jobsFoundThisWeek: 0,
    averageJobsPerScrape: 20,
    lastScrapeDuration: 52,
  },
  {
    _id: "4",
    query: "nodejs backend developer",
    active: true,
    createdAt: "2024-01-18T16:45:00Z",
    lastScrapedAt: "2024-01-20T14:18:00Z",
    jobsFound: 67,
    jobsFoundToday: 5,
    jobsFoundThisWeek: 18,
    averageJobsPerScrape: 8,
    lastScrapeDuration: 28,
  },
];

export function SearchQueriesPanel() {
  const [queryInput, setQueryInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queries, setQueries] = useState<QueryWithStats[]>(DUMMY_QUERIES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Dummy handlers - Replace with real API calls later
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim() || queryInput.trim().length < 3) {
      return;
    }
    // TODO: Replace with real API call
    const newQuery: QueryWithStats = {
      _id: Date.now().toString(),
      query: queryInput.trim(),
      active: true,
      createdAt: new Date().toISOString(),
      lastScrapedAt: null,
      jobsFound: 0,
      jobsFoundToday: 0,
      jobsFoundThisWeek: 0,
      averageJobsPerScrape: 0,
    };
    setQueries([newQuery, ...queries]);
    setQueryInput("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this search query?")) {
      // TODO: Replace with real API call
      setQueries(queries.filter((q) => q._id !== id));
    }
  };

  const handleToggle = (id: string) => {
    // TODO: Replace with real API call
    setQueries(
      queries.map((q) => (q._id === id ? { ...q, active: !q.active } : q))
    );
  };

  const handleEdit = (id: string, currentQuery: string) => {
    setEditingId(id);
    setEditValue(currentQuery);
  };

  const handleSaveEdit = (id: string) => {
    if (!editValue.trim() || editValue.trim().length < 3) {
      return;
    }
    // TODO: Replace with real API call
    setQueries(
      queries.map((q) =>
        q._id === id ? { ...q, query: editValue.trim() } : q
      )
    );
    setEditingId(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-stone-100/80 filter-shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-text-title mb-2">
              Query Management Dashboard
            </h2>
            <p className="text-sm text-text-muted">
              Manage your search queries and track their performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-text-muted">Total Queries</div>
              <div className="text-2xl font-bold text-emerald-600">
                {queries.length}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-text-muted">Active</div>
              <div className="text-2xl font-bold text-emerald-600">
                {queries.filter((q) => q.active).length}
              </div>
            </div>
          </div>
        </div>

        {/* Add Query Form */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="e.g., mern stack developer fresher"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-stone-50/60 border border-stone-200/60 outline-none ring-0 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-stone-400 text-stone-700 transition-all duration-200 focus:bg-white"
                disabled={isSubmitting}
                minLength={3}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || queryInput.trim().length < 3}
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <>
                  <Plus size={18} />
                  Add Query
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Queries List */}
      {queries.length > 0 ? (
        <div className="space-y-4">
          {queries.map((query) => (
            <div
              key={query._id}
              className="bg-white rounded-xl border border-stone-100/80 filter-shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: Query Info */}
                <div className="flex-1">
                  {editingId === query._id ? (
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(query._id)}
                        className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-2 bg-stone-200 text-stone-700 rounded-lg text-sm hover:bg-stone-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-text-title">
                        {query.query}
                      </h3>
                      {query.active ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600 border border-stone-200">
                          <PowerOff size={12} />
                          Inactive
                        </span>
                      )}
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 size={14} className="text-emerald-600" />
                        <span className="text-xs text-text-muted">Total Jobs</span>
                      </div>
                      <div className="text-xl font-bold text-emerald-700">
                        {query.jobsFound}
                      </div>
                    </div>

                    <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp size={14} className="text-blue-600" />
                        <span className="text-xs text-text-muted">Today</span>
                      </div>
                      <div className="text-xl font-bold text-blue-700">
                        {query.jobsFoundToday}
                      </div>
                    </div>

                    <div className="bg-purple-50/50 rounded-lg p-3 border border-purple-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar size={14} className="text-purple-600" />
                        <span className="text-xs text-text-muted">This Week</span>
                      </div>
                      <div className="text-xl font-bold text-purple-700">
                        {query.jobsFoundThisWeek}
                      </div>
                    </div>

                    <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-100">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp size={14} className="text-amber-600" />
                        <span className="text-xs text-text-muted">Avg/Scrape</span>
                      </div>
                      <div className="text-xl font-bold text-amber-700">
                        {query.averageJobsPerScrape}
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 mt-4 text-xs text-text-muted">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>
                        Created {new Date(query.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {query.lastScrapedAt && (
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>Last scraped {formatTimeAgo(query.lastScrapedAt)}</span>
                        {query.lastScrapeDuration && (
                          <span className="text-stone-400">
                            · {query.lastScrapeDuration}s
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-start gap-2">
                  {editingId !== query._id && (
                    <button
                      onClick={() => handleEdit(query._id, query.query)}
                      className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
                      title="Edit query"
                    >
                      <Edit2 size={18} className="text-stone-600" />
                    </button>
                  )}
                  <button
                    onClick={() => handleToggle(query._id)}
                    className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
                    title={query.active ? "Deactivate" : "Activate"}
                  >
                    {query.active ? (
                      <PowerOff size={18} className="text-stone-600" />
                    ) : (
                      <Power size={18} className="text-emerald-600" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(query._id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete query"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-100/80 filter-shadow p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
            <Search size={32} className="text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-text-title mb-2">
            No search queries yet
          </h3>
          <p className="text-sm text-text-muted">
            Add a query above to start scraping jobs automatically.
          </p>
        </div>
      )}
    </div>
  );
}

