"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X, Power, PowerOff, Trash2 } from "lucide-react";
import { createQuery, getMyQueries, deleteQuery, toggleQueryActive } from "@/lib/queries/queries";
import { Query } from "@/lib/queries/queries";
import ArcLoader from "../../layout/ArcLoader";

export function SearchQueriesPanel() {
  const [queryInput, setQueryInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: queries,
    isLoading,
    error,
  } = useQuery<Query[]>({
    queryKey: ["myQueries"],
    queryFn: getMyQueries,
  });

  const createMutation = useMutation({
    mutationFn: createQuery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myQueries"] });
      setQueryInput("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteQuery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myQueries"] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      toggleQueryActive(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myQueries"] });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim() || queryInput.trim().length < 3) {
      return;
    }
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync(queryInput.trim());
    } catch (error) {
      console.error("Failed to create query:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this search query?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    await toggleMutation.mutateAsync({ id, active: !currentActive });
  };

  return (
    <div className="bg-white rounded-xl border border-stone-100/80 filter-shadow p-4">
      <h2 className="text-lg font-semibold text-text-title mb-4">
        Search Queries
      </h2>
      <p className="text-sm text-text-muted mb-4">
        Add search queries to automatically scrape jobs. The worker will run
        these queries periodically and notify you of new matches.
      </p>

      {/* Add Query Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="e.g., mern stack developer fresher"
            className="flex-1 px-4 py-2.5 rounded-lg bg-stone-50/60 border border-stone-200/60 outline-none ring-0 focus:ring-0 focus:outline-none placeholder:text-stone-400 text-stone-700 transition-all duration-200 focus:bg-white"
            disabled={isSubmitting}
            minLength={3}
          />
          <button
            type="submit"
            disabled={isSubmitting || queryInput.trim().length < 3}
            className="px-6 py-2.5 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <>
                <Plus size={18} />
                Add
              </>
            )}
          </button>
        </div>
      </form>

      {/* Queries List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <ArcLoader />
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm py-4">
          Error loading queries. Please try again.
        </div>
      ) : queries && queries.length > 0 ? (
        <div className="space-y-2">
          {queries.map((query) => (
            <div
              key={query._id}
              className="flex items-center justify-between p-3 rounded-lg bg-stone-50/60 border border-stone-200/60 hover:bg-stone-100/60 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text-title">
                    {query.query}
                  </span>
                  {query.active ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-medium text-stone-600">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="text-xs text-text-muted mt-1">
                  Created {new Date(query.createdAt).toLocaleDateString()}
                  {query.lastScrapedAt &&
                    ` · Last scraped ${new Date(query.lastScrapedAt).toLocaleDateString()}`}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleToggle(query._id, query.active)}
                  className="p-2 rounded-lg hover:bg-stone-200 transition-colors"
                  title={query.active ? "Deactivate" : "Activate"}
                >
                  {query.active ? (
                    <PowerOff size={18} className="text-stone-600" />
                  ) : (
                    <Power size={18} className="text-stone-600" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(query._id)}
                  className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-text-muted">
          <p className="text-sm">No search queries yet.</p>
          <p className="text-xs mt-1">
            Add a query above to start scraping jobs automatically.
          </p>
        </div>
      )}
    </div>
  );
}

