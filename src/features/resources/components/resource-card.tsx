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
    published_at: Date | string | null;
    created_at: Date | string;
  };
};

function formatDate(value: Date | string | null) {
  if (!value) return "Chưa cập nhật";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa cập nhật";
  return new Intl.DateTimeFormat("vi-VN", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <article className="flex min-h-[235px] flex-col rounded-xl border border-[#CBD5E1] bg-white p-3.5 transition-colors hover:border-[#A78BFA]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-xs font-bold text-[#64748B]">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#C4B5FD] bg-[#EDE9FE] text-[#6D28D9]">
            <FileText className="h-3.5 w-3.5" />
          </span>
          <span className="truncate">{resource.topic}</span>
        </div>
        <span className="shrink-0 rounded-md border border-[#D6D3D1] bg-[#FEF3C7] px-2 py-1 font-mono text-[10px] font-extrabold text-[#92400E]">{resourceTypeLabel(resource.mime_type)}</span>
      </div>
      <h2 className="mt-3 line-clamp-2 text-sm font-extrabold leading-5 text-[#1E293B]">
        <Link href={`/resources/${resource.slug}`} className="hover:text-[#7C3AED]">
          {resource.title}
        </Link>
      </h2>
      <p className="mt-1.5 line-clamp-3 text-xs leading-5 text-[#64748B]">{resource.description}</p>
      <div className="mt-auto pt-4">
        <p className="mb-2.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] text-[#64748B]">
          <span>{formatResourceFileSize(resource.file_size)}</span>
          <span>{resource.download_count.toLocaleString("vi-VN")} lượt tải</span>
          <span>{formatDate(resource.published_at ?? resource.created_at)}</span>
        </p>
        <div className="flex gap-2">
          <Link href={`/resources/${resource.slug}`} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-[11px] font-extrabold text-[#1E293B] hover:bg-[#F8FAFC]">
            <Eye className="h-3.5 w-3.5" /> Xem trước
          </Link>
          <a href={`/api/resources/${resource.slug}?download=1`} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#1E293B] bg-[#FBBF24] px-3 py-2 text-[11px] font-extrabold text-[#1E293B] hover:bg-[#F59E0B]">
            <Download className="h-3.5 w-3.5" /> Tải về
          </a>
        </div>
      </div>
    </article>
  );
}
