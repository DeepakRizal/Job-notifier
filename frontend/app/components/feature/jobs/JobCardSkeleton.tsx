export function JobCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <article
          key={i}
          className="relative bg-white rounded-xl overflow-hidden border border-stone-200/60 shadow-sm"
        >
          <div className="p-5 animate-pulse">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 space-y-3">
                {/* Title */}
                <div className="h-6 w-4/5 rounded-lg bg-stone-200" />

                {/* Company */}
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-stone-200" />
                  <div className="h-4 w-32 rounded bg-stone-200" />
                </div>

                {/* Location */}
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-stone-200" />
                  <div className="h-4 w-24 rounded bg-stone-200" />
                </div>
              </div>

              {/* Bookmark */}
              <div className="w-10 h-10 rounded-lg bg-stone-200" />
            </div>

            {/* Salary + Time */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="h-7 w-24 rounded-lg bg-stone-200" />
              <div className="h-7 w-20 rounded-lg bg-stone-200" />
            </div>

            {/* Skills */}
            <div className="mb-4 flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-6 w-16 rounded-md bg-stone-200" />
              ))}
            </div>

            {/* Footer buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
              <div className="flex-1 h-10 rounded-lg bg-stone-200" />
              <div className="flex-1 h-10 rounded-lg bg-stone-200" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
