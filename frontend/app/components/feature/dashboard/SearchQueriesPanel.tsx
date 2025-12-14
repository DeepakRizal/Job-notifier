"use client";

import {
  createQuery,
  deleteQuery,
  getMyQueries,
  Query,
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
} from "lucide-react";
import ArcLoader from "../../layout/ArcLoader";
import { useForm } from "react-hook-form";
import { isApiError } from "@/lib/errors";
import { useState } from "react";

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
    return <div className="text-red-500">Failed to load queries</div>;
  }

  async function onSubmit(data: Input) {
    try {
      await createQueryMutation.mutateAsync(data.query);
    } catch (error: unknown) {
      if (isApiError(error)) {
        console.log(error);
        const msg = error.message || "Login failed";

        setError("root", { type: "server", message: msg });
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-stone-100/80 filter-shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-text-title mb-2">
              Query Management
            </h2>
            <p className="text-sm text-text-muted">
              Manage your job search queries
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs text-text-muted">Total Queries</div>
            <div className="text-2xl font-bold text-emerald-600">
              {queries.length}
            </div>
          </div>
        </div>

        {/* Add Query (UI only for now) */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                {...register("query", {
                  required: "Query is required!",
                })}
                placeholder="e.g., react developer"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-stone-50/60 border border-stone-200/60 outline-none"
              />
              {errors.query && (
                <div className="text-xs text-center text-red-500">
                  {errors.query.message}
                </div>
              )}
            </div>

            <button className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 flex items-center gap-2">
              <Plus size={18} />
              {isSubmitting ? "Adding" : "Add Query"}
            </button>
          </div>
        </form>
      </div>

      {/* Queries List */}
      <div className="space-y-4">
        {queries.map((query) => (
          <div
            key={query._id}
            className="bg-white rounded-xl border border-stone-100/80 filter-shadow p-6"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Query Info */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {editing.editingId === query._id ? (
                    <input
                      value={editing.editingValue}
                      onChange={(e) =>
                        setEditing((prevState) => ({
                          ...prevState,
                          editingValue: e.target.value,
                        }))
                      }
                      className="px-2 py-1 border rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                      autoFocus
                    />
                  ) : (
                    <h3 className="text-lg font-semibold text-text-title">
                      {query.query}
                    </h3>
                  )}

                  {query.active ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600 border border-stone-200">
                      <PowerOff size={12} />
                      Inactive
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <Clock size={12} />
                  <span>
                    Created {new Date(query.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions (UI only) */}
              <div className="flex items-start gap-2">
                {editing.editingId === query._id ? (
                  <>
                    <button
                      disabled={updateQueryMutation.isPending}
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
                      className="px-3 py-1 text-sm bg-emerald-500 text-white rounded-md"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => {
                        setEditing({
                          editingId: null,
                          editingValue: "",
                        });
                      }}
                      className="px-3 py-1 text-sm border rounded-md"
                    >
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
                      className="p-2 rounded-lg hover:bg-stone-100"
                    >
                      <Edit2 size={18} className="text-stone-600" />
                    </button>

                    <button
                      onClick={() =>
                        toggleQueryMutation.mutate({
                          id: query._id,
                          active: !query.active,
                        })
                      }
                      disabled={editing.editingId === query._id}
                      className="p-2 rounded-lg hover:bg-stone-100"
                    >
                      {query.active ? (
                        <PowerOff size={18} className="text-stone-600" />
                      ) : (
                        <Power size={18} className="text-emerald-600" />
                      )}
                    </button>

                    <button
                      onClick={() => deleteQueryMutation.mutate(query._id)}
                      className="p-2 rounded-lg hover:bg-red-50"
                      disabled={editing.editingId === query._id}
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {queries.length === 0 && (
          <div className="text-center text-text-muted py-8">
            No queries added yet
          </div>
        )}
      </div>
    </div>
  );
}
