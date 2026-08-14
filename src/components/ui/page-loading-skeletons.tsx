function Bar({ className = "" }: { className?: string }) {
  return <div className={`rounded-md bg-slate-200 ${className}`} />;
}

function LoadingRegion({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div role="status" aria-label={label} className={`animate-pulse ${className}`}>
      {children}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function AdminShellLoading() {
  return (
    <LoadingRegion label="Đang tải trang quản trị" className="min-h-[100dvh] bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-5 lg:block">
        <Bar className="h-9 w-36" />
        <div className="mt-10 space-y-3">{Array.from({ length: 7 }, (_, i) => <Bar key={i} className="h-10 w-full" />)}</div>
      </aside>
      <div className="lg:pl-64">
        <header className="h-16 border-b border-slate-200 bg-white px-5 py-3"><Bar className="ml-auto h-9 w-40" /></header>
        <AdminPageLoading embedded />
      </div>
    </LoadingRegion>
  );
}

export function AdminPageLoading({ embedded = false }: { embedded?: boolean }) {
  const content = (
    <div className="mx-auto max-w-7xl space-y-7 p-5 sm:p-8">
      <div className="flex items-center justify-between gap-5"><div className="space-y-3"><Bar className="h-8 w-56" /><Bar className="h-4 w-80 max-w-full" /></div><Bar className="h-10 w-32" /></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <div key={i} className="rounded-xl border border-slate-200 bg-white p-5"><Bar className="h-4 w-24" /><Bar className="mt-5 h-8 w-16" /></div>)}</div>
      <div className="rounded-xl border border-slate-200 bg-white p-5"><Bar className="h-10 w-full" /><div className="mt-6 space-y-4">{Array.from({ length: 6 }, (_, i) => <Bar key={i} className="h-12 w-full" />)}</div></div>
    </div>
  );
  return embedded ? content : <LoadingRegion label="Đang tải dữ liệu quản trị" className="min-h-[70dvh] bg-slate-50">{content}</LoadingRegion>;
}

export function EditorLoading() {
  return (
    <LoadingRegion label="Đang tải trình soạn thảo" className="min-h-[100dvh] bg-slate-100">
      <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6"><Bar className="h-9 w-44" /><div className="flex gap-3"><Bar className="h-9 w-24" /><Bar className="h-9 w-28" /></div></div>
      <div className="mx-auto grid max-w-[1500px] gap-5 p-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-6">
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5"><Bar className="h-10 w-4/5" /><Bar className="h-24 w-full" />{Array.from({ length: 4 }, (_, i) => <div key={i} className="rounded-lg border border-slate-200 p-4"><Bar className="h-5 w-40" /><Bar className="mt-4 h-20 w-full" /></div>)}</div>
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5"><Bar className="h-6 w-36" />{Array.from({ length: 6 }, (_, i) => <div key={i}><Bar className="h-4 w-24" /><Bar className="mt-2 h-10 w-full" /></div>)}</div>
      </div>
    </LoadingRegion>
  );
}

export function BlogHomeLoading() {
  return (
    <LoadingRegion label="Đang tải nội dung" className="min-h-[70dvh] bg-[#F8FAFC] py-10">
      <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6"><div className="grid gap-8 lg:grid-cols-2"><div className="space-y-5 py-6"><Bar className="h-5 w-28" /><Bar className="h-12 w-full" /><Bar className="h-5 w-4/5" /><Bar className="h-11 w-36" /></div><Bar className="aspect-video w-full rounded-2xl" /></div><CardGrid /></div>
    </LoadingRegion>
  );
}

function CardGrid() {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="aspect-video bg-slate-200" /><div className="space-y-3 p-4"><Bar className="h-4 w-24" /><Bar className="h-6 w-full" /><Bar className="h-4 w-4/5" /></div></div>)}</div>;
}

export function ListingLoading({ label = "Đang tải danh sách" }: { label?: string }) {
  return <LoadingRegion label={label} className="min-h-[70dvh] bg-[#F8FAFC] py-8"><div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6"><div className="space-y-3"><Bar className="h-9 w-72 max-w-full" /><Bar className="h-5 w-[30rem] max-w-full" /><Bar className="mt-5 h-11 w-full" /></div><CardGrid /></div></LoadingRegion>;
}

export function DetailLoading({ label = "Đang tải nội dung chi tiết" }: { label?: string }) {
  return (
    <LoadingRegion label={label} className="min-h-[70dvh] bg-[#FFFCF4] py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6"><Bar className="h-4 w-48" /><div className="mt-8 max-w-4xl space-y-4"><Bar className="h-5 w-28" /><Bar className="h-12 w-full" /><Bar className="h-5 w-2/3" /></div><div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]"><article className="space-y-5">{Array.from({ length: 8 }, (_, i) => <Bar key={i} className={i % 3 === 0 ? "h-8 w-3/5" : "h-5 w-full"} />)}</article><aside className="h-64 rounded-xl border border-slate-200 bg-white p-5"><Bar className="h-6 w-32" /><Bar className="mt-5 h-32 w-full" /></aside></div></div>
    </LoadingRegion>
  );
}

export function RedirectLoading() {
  return <LoadingRegion label="Đang hoàn tất đăng nhập" className="flex min-h-[100dvh] items-center justify-center bg-slate-50 px-4"><div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><Bar className="mx-auto h-10 w-40" /><Bar className="mx-auto mt-6 h-5 w-56" /><Bar className="mx-auto mt-3 h-4 w-40" /></div></LoadingRegion>;
}
