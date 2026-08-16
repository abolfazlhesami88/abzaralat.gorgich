export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-[#f0e9d8] rounded-[20px] overflow-hidden animate-pulse flex flex-col justify-between h-full select-none">
      <div>
        <div className="h-[185px] sm:h-[195px] bg-[#f7f2e7]/60 border-b border-[#f0e9d8]" />
        <div className="p-4 sm:p-4.5 space-y-3">
          <div className="h-2.5 w-14 bg-[#f0ebe1] rounded-full" />
          <div className="h-4 w-full bg-[#f0ebe1] rounded-lg" />
          <div className="h-4 w-3/4 bg-[#f0ebe1] rounded-lg" />
          <div className="flex items-center gap-1 pt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-3 h-3 bg-[#f0ebe1] rounded-full" />
            ))}
          </div>
          <div className="h-5 w-24 bg-[#f0ebe1] rounded-lg pt-1" />
        </div>
      </div>
      <div className="p-4 sm:p-4.5 pt-0">
        <div className="h-10 w-full bg-[#f7f2e7] rounded-[12px]" />
      </div>
    </div>
  );
}
