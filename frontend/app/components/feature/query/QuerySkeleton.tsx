export default function QuerySkeleton() {
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
