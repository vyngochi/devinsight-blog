import Link from "next/link";
import { Download, FileText, Eye } from "lucide-react";
import {
  formatResourceFileSize,
  resourceTypeLabel,
} from "@/features/resources/resource-policy";

type ResourceCardProps = {
  resource: {
    slug: string;
    title: string;
    description: string;
    topic: string;
    file_name: string;
    mime_type: string;
    file_size: number;
    download_count: number;
    published_at: Date | null;
    created_at: Date;
  };
};

function formatDate(date: Date | null) {
  return new Intl.DateTimeFormat("vi-VN", { month: "short", year: "numeric" }).format(date ?? new Date());
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <article className="flex min-h-[260px] flex-col rounded-2xl border-2 border-[#1E293B] bg-white p-4 shadow-pop-sm dark:border-slate-600 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-xs font-bold text-[#64748B] dark:text-slate-300">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#1E293B] bg-[#EDE9FE] text-[#6D28D9] dark:border-slate-500 dark:bg-violet-950 dark:text-violet-200">
            <FileText className="h-4 w-4" />
          </span>
          <span className="truncate">{resource.topic}</span>
        </div>
        <span className="shrink-0 rounded-md border border-[#1E293B] bg-[#FBBF24] px-2 py-1 font-mono text-[11px] font-extrabold text-[#1E293B] dark:border-slate-500">{resourceTypeLabel(resource.mime_type)}</span>
      </div>
      <h2 className="mt-4 line-clamp-2 text-base font-extrabold leading-snug text-[#1E293B] dark:text-white">
        <Link href={`/resources/${resource.slug}`} className="hover:text-[#7C3AED]">
          {resource.title}
        </Link>
      </h2>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#64748B] dark:text-slate-300">{resource.description}</p>
      <div className="mt-auto pt-4">
        <p className="mb-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-[#64748B] dark:text-slate-400">
          <span>{formatResourceFileSize(resource.file_size)}</span>
          <span>{resource.download_count.toLocaleString("vi-VN")} lượt tải</span>
          <span>{formatDate(resource.published_at ?? resource.created_at)}</span>
        </p>
        <div className="flex gap-2">
          <Link href={`/resources/${resource.slug}`} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border-2 border-[#1E293B] bg-white px-3 py-2 text-xs font-extrabold text-[#1E293B] hover:bg-[#F1F5F9] dark:border-slate-500 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
            <Eye className="h-3.5 w-3.5" /> Xem trước
          </Link>
          <a href={`/api/resources/${resource.slug}?download=1`} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border-2 border-[#1E293B] bg-[#FBBF24] px-3 py-2 text-xs font-extrabold text-[#1E293B] hover:bg-[#F59E0B] dark:border-slate-500">
            <Download className="h-3.5 w-3.5" /> Tải về
          </a>
        </div>
      </div>
    </article>
  );
}
