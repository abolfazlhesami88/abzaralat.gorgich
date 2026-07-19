

export function ProductCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-card overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded-full" />
          ))}
        </div>
        <div className="h-5 w-24 bg-gray-200 rounded mt-3" />
        <div className="h-10 w-full bg-gray-200 rounded-button mt-4" />
      </div>
    </div>
  );
}
