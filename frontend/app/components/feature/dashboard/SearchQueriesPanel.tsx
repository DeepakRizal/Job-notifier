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
  Sparkles,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { isApiError } from "@/lib/errors";
import { useState } from "react";
import ArcLoader from "../../layout/ArcLoader";

interface Input {
  query: string;
}

interface EditingProps {
  editingId: string | null;
  editingValue: string;
}

export function SearchQueriesPanel() {
  const [editing, setEditing] = useState<EditingProps>({
    editingId: null,
    editingValue: "",
  });

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
    },
  });

  if (isLoading) {
    return <ArcLoader />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-900">
          Failed to load queries
        </p>
        <p className="mt-1 text-xs text-red-700">Please try again later</p>
      </div>
    );
  }

  async function onSubmit(data: Input) {
    try {
      await createQueryMutation.mutateAsync(data.query);
    } catch (error: unknown) {
      if (isApiError(error)) {
        console.log(error);
        const msg = error.message || "Failed to create query";

        setError("root", { type: "server", message: msg });
      }
    }
  }

  const activeQueries = queries.filter((q) => q.active).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-6">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground">
              Query Management
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and manage your job search queries
            </p>
          </div>
        </div>

        {/* Stats Row */}
        {queries.length > 0 && (
          <div className="mt-6 flex gap-4">
            <div className="rounded-xl border border-border/50 bg-card px-4 py-3">
              <div className="text-xs text-muted-foreground">Active</div>
              <div className="mt-1 text-2xl font-bold text-primary">
                {activeQueries}
              </div>
            </div>
            <div className="rounded-xl border border-border/50 bg-card px-4 py-3">
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="mt-1 text-2xl font-bold text-foreground">
                {queries.length}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Query Form */}
      <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                {...register("query", {
                  required: "Query is required!",
                })}
                placeholder="e.g., Senior React Developer in San Francisco"
                className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm outline-none ring-offset-background transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {errors.query && (
                <p className="mt-2 text-xs text-destructive">
                  {errors.query.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={18} />
              <span className="whitespace-nowrap">
                {isSubmitting ? "Adding..." : "Add Query"}
              </span>
            </button>
          </div>
          {errors.root && (
            <p className="mt-2 text-xs text-destructive">
              {errors.root.message}
            </p>
          )}
        </form>
      </div>

      {/* Queries List */}
      <div className="space-y-3">
        {queries.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">
              No queries yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add your first search query to get started
            </p>
          </div>
        ) : (
          queries.map((query) => (
            <div
              key={query._id}
              className="group rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:border-border hover:shadow-md"
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
                        className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none ring-offset-background transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        autoFocus
                      />
                    ) : (
                      <h3 className="text-balance text-lg font-semibold leading-relaxed text-foreground">
                        {query.query}
                      </h3>
                    )}

                    {query.active ? (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        <PowerOff size={12} />
                        Inactive
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock size={12} />
                    <span>
                      Created {new Date(query.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex shrink-0 items-start gap-1">
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
                        className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                        className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                        className="flex h-9 w-9 items-center justify-center rounded-lg transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        title="Edit query"
                      >
                        <Edit2 size={16} className="text-muted-foreground" />
                      </button>

                      <button
                        onClick={() =>
                          toggleQueryMutation.mutate({
                            id: query._id,
                            active: !query.active,
                          })
                        }
                        disabled={editing.editingId === query._id}
                        className="flex h-9 w-9 items-center justify-center rounded-lg transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        title={
                          query.active ? "Deactivate query" : "Activate query"
                        }
                      >
                        {query.active ? (
                          <PowerOff
                            size={16}
                            className="text-muted-foreground"
                          />
                        ) : (
                          <Power size={16} className="text-primary" />
                        )}
                      </button>

                      <button
                        onClick={() => deleteQueryMutation.mutate(query._id)}
                        disabled={editing.editingId === query._id}
                        className="flex h-9 w-9 items-center justify-center rounded-lg transition-all hover:bg-destructive/10 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Delete query"
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
