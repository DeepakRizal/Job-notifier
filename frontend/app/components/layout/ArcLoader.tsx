export default function ArcLoader() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="relative h-12 w-12">
        {/* Outer circle */}
        <div className="absolute inset-0 rounded-full border-4 border-stone-200"></div>

        {/* Emerald arcs */}
        <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 border-l-transparent border-b-transparent border-r-emerald-500 animate-spin"></div>
      </div>
    </div>
  );
}
