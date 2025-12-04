export default function ArcLoader() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="relative h-12 w-12">
        {/* Outer circle */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>

        {/* Blue arcs */}
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-l-transparent border-b-transparent border-r-blue-500 animate-spin"></div>
      </div>
    </div>
  );
}
