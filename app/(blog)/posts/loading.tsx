export default function Loading() {
  return (
    <main className="min-h-[70dvh] animate-pulse bg-[#F8FAFC] py-6 sm:py-8" aria-label="Đang tải bài viết">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#CBD5E1] pb-6">
          <div className="h-3 w-32 rounded bg-[#DDD6FE]" />
          <div className="mt-3 h-8 w-full max-w-lg rounded bg-[#E2E8F0]" />
          <div className="mt-3 h-5 w-full max-w-2xl rounded bg-[#E2E8F0]" />
          <div className="mt-5 h-10 w-full max-w-2xl rounded-lg bg-white" />
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-8 w-36 rounded-md bg-[#E2E8F0]" />
          <div className="h-8 w-32 rounded-md bg-[#E2E8F0]" />
          <div className="h-8 w-36 rounded-md bg-[#E2E8F0]" />
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
              <div className="aspect-video bg-[#E2E8F0]" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-20 rounded bg-[#DDD6FE]" />
                <div className="h-5 w-full rounded bg-[#E2E8F0]" />
                <div className="h-4 w-4/5 rounded bg-[#E2E8F0]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
