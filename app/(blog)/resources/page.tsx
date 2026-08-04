import type { Metadata } from "next";
import Link from "next/link";
import { FileArchive, Search, SlidersHorizontal } from "lucide-react";
import { RESOURCE_TOPICS } from "@/features/resources/resource-policy";
import { ResourceCard } from "@/features/resources/components/resource-card";
import { getPublicResources } from "@/features/resources/server/resources.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tài nguyên lập trình",
  description:
    "Thư viện tài liệu kỹ thuật được DevInsight chọn lọc cho cộng đồng lập trình.",
};

type ResourcesPageProps = {
  searchParams: Promise<{ q?: string | string[]; topic?: string | string[] }>;
};

function getValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export default async function ResourcesPage({
  searchParams,
}: ResourcesPageProps) {
  const params = await searchParams;
  const query = getValue(params.q);
  const topic = getValue(params.topic);
  const resources = await getPublicResources({ query, topic });

  return (
    <main className="bg-[#F8FAFC] py-8 dark:bg-slate-950 sm:py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="rounded-2xl border-2 border-[#1E293B] bg-[#EDE9FE] p-6 shadow-pop-sm dark:border-slate-600 dark:bg-violet-950/60 sm:p-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#6D28D9] dark:text-violet-200">
              <FileArchive className="h-4 w-4" />
              Thư viện Tài nguyên
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1E293B] dark:text-white sm:text-4xl">
              Tài liệu được chia sẻ từ DevInsight Team
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#475569] dark:text-slate-200 sm:text-base">
              Tài liệu, biểu mẫu và tài nguyên thực hành được đội ngũ DevInsight
              tải lên cho cộng đồng lập trình.
            </p>
          </div>
        </section>
        <form className="mt-6 grid gap-3 rounded-2xl border border-[#CBD5E1] bg-white p-4 dark:border-slate-700 dark:bg-slate-900 md:grid-cols-[minmax(0,1fr)_220px_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Tìm theo tên, mô tả hoặc tên tệp"
              className="w-full rounded-lg border border-[#CBD5E1] bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#7C3AED] dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </label>
          <select
            name="topic"
            defaultValue={topic}
            className="rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-[#7C3AED] dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            <option value="">Tất cả chủ đề</option>
            {RESOURCE_TOPICS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#1E293B] bg-[#FBBF24] px-4 py-2.5 text-sm font-extrabold text-[#1E293B] hover:bg-[#F59E0B] dark:border-slate-500">
            <SlidersHorizontal className="h-4 w-4" />
            Lọc tài nguyên
          </button>
        </form>
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-[#475569] dark:text-slate-300">
            {resources.length} tài nguyên phù hợp
          </p>
          {query || topic ? (
            <Link
              href="/resources"
              className="text-sm font-bold text-[#6D28D9] hover:underline"
            >
              Xóa bộ lọc
            </Link>
          ) : null}
        </div>
        {resources.length ? (
          <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </section>
        ) : (
          <section className="mt-4 rounded-2xl border-2 border-dashed border-[#94A3B8] bg-white px-6 py-14 text-center dark:border-slate-600 dark:bg-slate-900">
            <FileArchive className="mx-auto h-10 w-10 text-[#94A3B8]" />
            <h2 className="mt-4 text-lg font-extrabold text-[#1E293B] dark:text-white">
              Chưa có tài nguyên phù hợp
            </h2>
            <p className="mt-2 text-sm text-[#64748B] dark:text-slate-300">
              Hãy thử từ khóa khác hoặc quay lại sau khi quản trị viên cập nhật
              thư viện.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
