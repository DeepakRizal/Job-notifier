"use client";

import {
  createQuery,
  deleteQuery,
  getMyQueries,
  type Query,
  toggleQueryActive,
  updateQuery,
} from "@/lib/queries/queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Power,
  PowerOff,
  Trash2,
  Edit2,
  Search,
  Clock,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { isApiError } from "@/lib/errors";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ConfirmDialog } from "../../layout/ConfirmDialog";

interface Input {
  query: string;
}

interface EditingProps {
  editingId: string | null;
  editingValue: string;
}

function QuerySkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="h-6 w-3/4 animate-pulse rounded-lg bg-stone-200" />
              <div className="flex items-center gap-3">
                <div className="h-5 w-20 animate-pulse rounded-full bg-stone-200" />
                <div className="h-4 w-32 animate-pulse rounded bg-stone-200" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-9 animate-pulse rounded-lg bg-stone-200" />
              <div className="h-9 w-9 animate-pulse rounded-lg bg-stone-200" />
              <div className="h-9 w-9 animate-pulse rounded-lg bg-stone-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SearchQueriesPanel() {
  const [editing, setEditing] = useState<EditingProps>({
    editingId: null,
    editingValue: "",
  });
  const [queryToDelete, setQueryToDelete] = useState<Query | null>(null);

  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Input>();

  const {
    data: queries = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<Query[], Error>({
    queryKey: ["queries"],
    queryFn: getMyQueries,
    staleTime: 30000,
  });

  const createQueryMutation = useMutation({
    mutationFn: (data: string) => createQuery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["queries"],
      });
      reset();
    },
  });

  const deleteQueryMutation = useMutation({
    mutationFn: (id: string) => deleteQuery(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["queries"],
      });
      setQueryToDelete(null);
    },
  });

  const toggleQueryMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      toggleQueryActive(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queries"] });
    },
  });

  const updateQueryMutation = useMutation({
    mutationFn: ({ id, query }: { id: string; query: string }) =>
      updateQuery(id, query),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["queries"],
      });
      setEditing({
        editingId: null,
        editingValue: "",
      });
    },
  });

  async function onSubmit(data: Input) {
    try {
      await createQueryMutation.mutateAsync(data.query);
    } catch (error: unknown) {
      if (isApiError(error)) {
        const msg = error.message || "Failed to create query";
        setError("root", { type: "server", message: msg });
      }
    }
  }

  const handleDeleteConfirm = () => {
    if (queryToDelete) {
      deleteQueryMutation.mutate(queryToDelete._id);
    }
  };

  const activeQueriesCount = queries.filter((q) => q.active).length;

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900">
              Search Queries
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Manage your job search queries. Active queries are automatically
              scraped for new job postings.
            </p>
          </div>
          {queries.length > 0 && !isLoading && (
            <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 sm:flex">
              <Sparkles size={16} />
              <span>
                {activeQueriesCount} {activeQueriesCount === 1 ? "query" : "queries"} active
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Add Query Form */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                aria-hidden="true"
              />
              <input
                type="text"
                {...register("query", {
                  required: "Query is required!",
                })}
                placeholder="e.g., Senior React Developer in San Francisco"
                className="h-12 w-full rounded-xl border border-stone-300 bg-stone-50 pl-11 pr-4 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                aria-label="Search query"
              />
              {errors.query && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.query.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 font-medium text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span className="whitespace-nowrap">Adding...</span>
                </>
              ) : (
                <>
                  <Plus size={18} />
                  <span className="whitespace-nowrap">Add Query</span>
                </>
              )}
            </button>
          </div>
          {errors.root && (
            <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.root.message}
            </p>
          )}
        </form>
      </div>

      {/* Loading State */}
      {isLoading && <QuerySkeleton />}

      {/* Error State */}
      {error && !isLoading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-red-900">
            Failed to load queries
          </h3>
          <p className="mt-2 text-sm text-red-700">
            {error instanceof Error
              ? error.message
              : "Something went wrong. Please try again."}
          </p>
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={isRefetching ? "animate-spin" : ""}
            />
            {isRefetching ? "Retrying..." : "Try Again"}
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && queries.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 py-16 px-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white border border-stone-200 shadow-sm">
            <Search className="h-8 w-8 text-stone-400" />
          </div>
          <h3 className="mt-6 text-base font-semibold text-stone-900">
            No queries yet
          </h3>
          <p className="mt-2 text-center text-sm text-stone-600 max-w-sm">
            Add your first search query to start discovering job opportunities
            that match your criteria.
          </p>
        </div>
      )}

      {/* Queries List */}
      {!isLoading && !error && queries.length > 0 && (
        <div className="space-y-4">
          {queries.map((query) => (
            <div
              key={query._id}
              className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-stone-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Query Info */}
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    {editing.editingId === query._id ? (
                      <input
                        value={editing.editingValue}
                        onChange={(e) =>
                          setEditing((prevState) => ({
                            ...prevState,
                            editingValue: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            setEditing({ editingId: null, editingValue: "" });
                          }
                          if (e.key === "Enter" && editing.editingValue.trim()) {
                            updateQueryMutation.mutate(
                              { id: query._id, query: editing.editingValue },
                              {
                                onSuccess: () => {
                                  setEditing({
                                    editingId: null,
                                    editingValue: "",
                                  });
                                },
                              }
                            );
                          }
                        }}
                        className="h-9 flex-1 min-w-[200px] max-w-full rounded-lg border-2 border-emerald-400 bg-white px-3 text-sm text-stone-900 outline-none ring-2 ring-emerald-500/20 transition-all focus:ring-emerald-500/40"
                        autoFocus
                        aria-label="Edit query"
                      />
                    ) : (
                      <h3 className="text-lg font-semibold leading-relaxed text-stone-900 break-words">
                        {query.query}
                      </h3>
                    )}

                    {!editing.editingId && (
                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          query.active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-stone-100 text-stone-600 border border-stone-200"
                        }`}
                      >
                        {query.active ? (
                          <>
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </>
                        ) : (
                          <>
                            <PowerOff size={12} />
                            Inactive
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <Clock size={12} />
                    <span>
                      Created{" "}
                      {formatDistanceToNow(new Date(query.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex shrink-0 items-start gap-1.5">
                  {editing.editingId === query._id ? (
                    <>
                      <button
                        disabled={
                          updateQueryMutation.isPending ||
                          !editing.editingValue.trim()
                        }
                        onClick={() => {
                          if (!editing.editingValue.trim()) return;
                          updateQueryMutation.mutate(
                            { id: query._id, query: editing.editingValue },
                            {
                              onSuccess: () => {
                                setEditing({
                                  editingId: null,
                                  editingValue: "",
                                });
                              },
                            }
                          );
                        }}
                        className="flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-medium text-white transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Save changes"
                      >
                        <Check size={14} />
                        Save
                      </button>

                      <button
                        onClick={() => {
                          setEditing({
                            editingId: null,
                            editingValue: "",
                          });
                        }}
                        className="flex h-9 items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 text-xs font-medium text-stone-700 transition-all hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
                        aria-label="Cancel editing"
                      >
                        <X size={14} />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditing({
                            editingId: query._id,
                            editingValue: query.query,
                          });
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-600 transition-all hover:bg-stone-100 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
                        title="Edit query"
                        aria-label="Edit query"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        onClick={() =>
                          toggleQueryMutation.mutate({
                            id: query._id,
                            active: !query.active,
                          })
                        }
                        disabled={editing.editingId === query._id}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                          query.active
                            ? "text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus:ring-stone-500"
                            : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 focus:ring-emerald-500"
                        }`}
                        title={
                          query.active ? "Deactivate query" : "Activate query"
                        }
                        aria-label={
                          query.active ? "Deactivate query" : "Activate query"
                        }
                      >
                        {query.active ? (
                          <PowerOff size={16} />
                        ) : (
                          <Power size={16} />
                        )}
                      </button>

                      <button
                        onClick={() => setQueryToDelete(query)}
                        disabled={editing.editingId === query._id}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition-all hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Delete query"
                        aria-label="Delete query"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={!!queryToDelete}
        onOpenChange={(open) => !open && setQueryToDelete(null)}
        title="Delete Query"
        description="Are you sure you want to delete this query? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        isLoading={deleteQueryMutation.isPending}
      >
        {queryToDelete && (
          <p className="text-sm font-medium text-stone-900">
            {queryToDelete.query}
          </p>
        )}
      </ConfirmDialog>
    </div>
  );
}
