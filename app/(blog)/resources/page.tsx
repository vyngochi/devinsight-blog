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
    <main className="bg-[#F8FAFC] py-6 sm:py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="rounded-xl border border-[#C4B5FD] bg-[#EDE9FE] p-4 sm:p-5">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#6D28D9]">
              <FileArchive className="h-3.5 w-3.5" />
              Thư viện Tài nguyên
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1E293B] sm:text-3xl">
              Tài liệu được chia sẻ từ DevInsight Team
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-[#475569] sm:text-sm">
              Tài liệu, biểu mẫu và tài nguyên thực hành được đội ngũ DevInsight
              tải lên cho cộng đồng lập trình.
            </p>
          </div>
        </section>
        <form className="mt-4 grid gap-2 rounded-xl border border-[#CBD5E1] bg-white p-3 md:grid-cols-[minmax(0,1fr)_200px_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Tìm theo tên, mô tả hoặc tên tệp"
              className="h-9 w-full rounded-lg border border-[#CBD5E1] bg-white pl-9 pr-3 text-xs outline-none focus:border-[#7C3AED]"
            />
          </label>
          <select
            name="topic"
            defaultValue={topic}
            className="h-9 rounded-lg border border-[#CBD5E1] bg-white px-3 text-xs font-semibold outline-none focus:border-[#7C3AED]"
          >
            <option value="">Tất cả chủ đề</option>
            {RESOURCE_TOPICS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#1E293B] bg-[#FBBF24] px-4 text-xs font-extrabold text-[#1E293B] hover:bg-[#F59E0B]">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Lọc tài nguyên
          </button>
        </form>
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-xs font-bold text-[#475569]">
            {resources.length} tài nguyên phù hợp
          </p>
          {query || topic ? (
            <Link
              href="/resources"
              className="text-xs font-bold text-[#6D28D9] hover:underline"
            >
              Xóa bộ lọc
            </Link>
          ) : null}
        </div>
        {resources.length ? (
          <section className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </section>
        ) : (
          <section className="mt-3 rounded-xl border border-dashed border-[#94A3B8] bg-white px-6 py-10 text-center">
            <FileArchive className="mx-auto h-8 w-8 text-[#94A3B8]" />
            <h2 className="mt-3 text-base font-extrabold text-[#1E293B]">
              Chưa có tài nguyên phù hợp
            </h2>
            <p className="mt-1.5 text-xs text-[#64748B]">
              Hãy thử từ khóa khác hoặc quay lại sau khi quản trị viên cập nhật
              thư viện.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
