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
  return { title: resource.title, description: resource.description };
}

export default async function ResourceDetailPage({ params }: ResourceDetailProps) {
  const resource = await getPublicResource((await params).slug);
  if (!resource) notFound();
  const canPreview = isPreviewSupported(resource.mime_type);
  const publishedDate = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(resource.published_at ?? resource.created_at);

  return <main className="bg-[#F8FAFC] py-8 dark:bg-slate-950 sm:py-10"><div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"><Link href="/resources" className="inline-flex items-center gap-2 text-sm font-bold text-[#475569] hover:text-[#6D28D9] dark:text-slate-300"><MoveLeft className="h-4 w-4" />Quay lại Tài nguyên</Link><div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"><section className="min-w-0"><div className="rounded-2xl border-2 border-[#1E293B] bg-white p-5 shadow-pop-sm dark:border-slate-600 dark:bg-slate-900 sm:p-7"><div className="flex flex-wrap items-center gap-2"><span className="rounded-md border border-[#1E293B] bg-[#FBBF24] px-2 py-1 font-mono text-xs font-extrabold text-[#1E293B] dark:border-slate-500">{resourceTypeLabel(resource.mime_type)}</span><span className="text-sm font-bold text-[#64748B] dark:text-slate-300">{resource.topic}</span></div><h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#1E293B] dark:text-white sm:text-4xl">{resource.title}</h1><p className="mt-4 whitespace-pre-line text-base leading-7 text-[#475569] dark:text-slate-200">{resource.description}</p></div><div className="mt-6 overflow-hidden rounded-2xl border-2 border-[#1E293B] bg-white shadow-pop-sm dark:border-slate-600 dark:bg-slate-900">{canPreview && resource.mime_type === "application/pdf" ? <iframe title={`Xem trước ${resource.title}`} src={`/api/resources/${resource.slug}`} className="h-[70dvh] min-h-[480px] w-full bg-white" /> : <div className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center"><FolderArchive className="h-12 w-12 text-[#8B5CF6]" /><h2 className="mt-4 text-xl font-extrabold text-[#1E293B] dark:text-white">Chưa thể xem trực tiếp định dạng này</h2><p className="mt-2 max-w-md text-sm leading-6 text-[#64748B] dark:text-slate-300">Trình duyệt có thể xem PDF ngay trên trang. Với {resourceTypeLabel(resource.mime_type)}, bạn hãy tải tệp về để mở bằng ứng dụng phù hợp.</p><a href={`/api/resources/${resource.slug}?download=1`} className="mt-5 inline-flex items-center gap-2 rounded-lg border-2 border-[#1E293B] bg-[#FBBF24] px-4 py-2.5 text-sm font-extrabold text-[#1E293B]"><Download className="h-4 w-4" />Tải tệp về máy</a></div>}</div></section><aside className="h-fit rounded-2xl border-2 border-[#1E293B] bg-white p-5 shadow-pop-sm dark:border-slate-600 dark:bg-slate-900"><div className="flex items-center gap-2 font-extrabold text-[#1E293B] dark:text-white"><FileText className="h-5 w-5 text-[#7C3AED]" />Thông tin tệp</div><dl className="mt-5 space-y-4 text-sm"><div><dt className="font-bold text-[#64748B] dark:text-slate-400">Tên tệp</dt><dd className="mt-1 break-all font-semibold text-[#1E293B] dark:text-white">{resource.file_name}</dd></div><div><dt className="font-bold text-[#64748B] dark:text-slate-400">Dung lượng</dt><dd className="mt-1 font-semibold text-[#1E293B] dark:text-white">{formatResourceFileSize(resource.file_size)}</dd></div><div><dt className="font-bold text-[#64748B] dark:text-slate-400">Cập nhật</dt><dd className="mt-1 font-semibold text-[#1E293B] dark:text-white">{publishedDate}</dd></div><div><dt className="font-bold text-[#64748B] dark:text-slate-400">Lượt tải</dt><dd className="mt-1 font-semibold text-[#1E293B] dark:text-white">{resource.download_count.toLocaleString("vi-VN")}</dd></div></dl><a href={`/api/resources/${resource.slug}?download=1`} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#1E293B] bg-[#FBBF24] px-4 py-2.5 text-sm font-extrabold text-[#1E293B] hover:bg-[#F59E0B] dark:border-slate-500"><Download className="h-4 w-4" />Tải về máy</a></aside></div></div></main>;
}
