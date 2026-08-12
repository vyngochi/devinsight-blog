import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileText, FolderArchive, MoveLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { formatResourceFileSize, isPreviewSupported, resourceTypeLabel } from "@/features/resources/resource-policy";
import { getPublicResource } from "@/features/resources/server/resources.service";

export const dynamic = "force-dynamic";

type ResourceDetailProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ResourceDetailProps): Promise<Metadata> {
  const resource = await getPublicResource((await params).slug);
  if (!resource) return {};
  return {
    title: resource.title,
    description: resource.description,
    alternates: { canonical: `/resources/${resource.slug}` },
  };
}

export default async function ResourceDetailPage({ params }: ResourceDetailProps) {
  const resource = await getPublicResource((await params).slug);
  if (!resource) notFound();

  const canPreview = isPreviewSupported(resource.mime_type);
  const publishedDate = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(
    resource.published_at ?? resource.created_at,
  );

  return (
    <main className="bg-[#F8FAFC] py-6 sm:py-8">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link href="/resources" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#6D28D9]">
          <MoveLeft className="h-3.5 w-3.5" /> Quay lại Tài nguyên
        </Link>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <section className="min-w-0">
            <div className="rounded-xl border border-[#CBD5E1] bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-[#D6D3D1] bg-[#FEF3C7] px-2 py-1 font-mono text-[10px] font-extrabold text-[#92400E]">
                  {resourceTypeLabel(resource.mime_type)}
                </span>
                <span className="text-xs font-bold text-[#64748B]">{resource.topic}</span>
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#1E293B] sm:text-3xl">
                {resource.title}
              </h1>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#475569]">
                {resource.description}
              </p>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-[#CBD5E1] bg-white">
              {canPreview && resource.mime_type === "application/pdf" ? (
                <iframe
                  title={`Xem trước ${resource.title}`}
                  src={`/api/resources/${resource.slug}`}
                  className="h-[65dvh] min-h-[420px] w-full bg-white"
                />
              ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center p-6 text-center">
                  <FolderArchive className="h-10 w-10 text-[#8B5CF6]" />
                  <h2 className="mt-3 text-base font-extrabold text-[#1E293B]">Chưa thể xem trực tiếp định dạng này</h2>
                  <p className="mt-1.5 max-w-md text-xs leading-5 text-[#64748B]">
                    Trình duyệt có thể xem PDF ngay trên trang. Với {resourceTypeLabel(resource.mime_type)}, bạn hãy tải tệp về để mở bằng ứng dụng phù hợp.
                  </p>
                  <a href={`/api/resources/${resource.slug}?download=1`} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#1E293B] bg-[#FBBF24] px-3 py-2 text-xs font-extrabold text-[#1E293B] hover:bg-[#F59E0B]">
                    <Download className="h-3.5 w-3.5" /> Tải tệp về máy
                  </a>
                </div>
              )}
            </div>
          </section>

          <aside className="h-fit rounded-xl border border-[#CBD5E1] bg-white p-4 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#1E293B]">
              <FileText className="h-4 w-4 text-[#7C3AED]" /> Thông tin tệp
            </div>
            <dl className="mt-4 space-y-3 text-xs">
              <ResourceFact label="Tên tệp" value={resource.file_name} breakable />
              <ResourceFact label="Dung lượng" value={formatResourceFileSize(resource.file_size)} />
              <ResourceFact label="Cập nhật" value={publishedDate} />
              <ResourceFact label="Lượt tải" value={resource.download_count.toLocaleString("vi-VN")} />
            </dl>
            <a href={`/api/resources/${resource.slug}?download=1`} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#1E293B] bg-[#FBBF24] px-3 py-2 text-xs font-extrabold text-[#1E293B] hover:bg-[#F59E0B]">
              <Download className="h-3.5 w-3.5" /> Tải về máy
            </a>
          </aside>
        </div>
      </div>
    </main>
  );
}

function ResourceFact({ label, value, breakable = false }: { label: string; value: string; breakable?: boolean }) {
  return (
    <div>
      <dt className="font-bold text-[#64748B]">{label}</dt>
      <dd className={`mt-1 font-semibold text-[#1E293B] ${breakable ? "break-all" : ""}`}>{value}</dd>
    </div>
  );
}
