function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`skeleton-shimmer rounded-lg ${className}`} />;
}

export function BlogPageSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-label="Đang tải nội dung" className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="sr-only">Đang tải nội dung...</span>
      <div className="max-w-3xl">
        <SkeletonBlock className="h-4 w-32" />
        <SkeletonBlock className="mt-4 h-10 w-4/5 sm:h-12" />
        <SkeletonBlock className="mt-3 h-5 w-full max-w-xl" />
      </div>
      <div className="mt-8 grid gap-3 rounded-2xl border-2 border-[#1E293B] bg-white p-4 shadow-pop-sm md:grid-cols-[minmax(0,1fr)_13rem_7rem]">
        <SkeletonBlock className="h-11 w-full" />
        <SkeletonBlock className="h-11 w-full" />
        <SkeletonBlock className="h-11 w-full" />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="rounded-2xl border-2 border-[#1E293B] bg-white p-5 shadow-pop-sm">
            <div className="flex gap-2"><SkeletonBlock className="h-6 w-20" /><SkeletonBlock className="h-6 w-16" /></div>
            <SkeletonBlock className="mt-5 h-6 w-11/12" />
            <SkeletonBlock className="mt-3 h-4 w-full" />
            <SkeletonBlock className="mt-2 h-4 w-4/5" />
            <div className="mt-6 flex items-center justify-between"><SkeletonBlock className="h-4 w-24" /><SkeletonBlock className="h-9 w-24" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminPageSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-label="Đang tải trang quản trị" className="space-y-6">
      <span className="sr-only">Đang tải trang quản trị...</span>
      <SkeletonBlock className="h-4 w-28" />
      <SkeletonBlock className="h-10 w-72 max-w-full" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <SkeletonBlock key={index} className="h-32 rounded-2xl border-2 border-[#1E293B]" />)}
      </div>
      <SkeletonBlock className="h-80 rounded-2xl border-2 border-[#1E293B]" />
    </div>
  );
}
