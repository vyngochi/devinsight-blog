import { FileArchive } from "lucide-react";
import { DeleteResourceButton } from "@/features/resources/components/delete-resource-button";
import { ResourceUploadForm } from "@/features/resources/components/resource-upload-form";
import { formatResourceFileSize } from "@/features/resources/resource-policy";
import { getManagedResources } from "@/features/resources/server/resources.service";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(date);
}

function statusLabel(status: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
  if (status === "PUBLISHED") return "Đã xuất bản";
  if (status === "DRAFT") return "Bản nháp";
  return "Đã lưu trữ";
}

function statusClass(status: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
  if (status === "PUBLISHED") return "bg-[#DCFCE7] text-[#166534]";
  if (status === "DRAFT") return "bg-[#FEF3C7] text-[#92400E]";
  return "bg-[#E2E8F0] text-[#475569]";
}

export default async function AdminResourcesPage() {
  const resources = await getManagedResources();

  return <div className="space-y-6">
    <section>
      <p className="font-mono text-xs font-bold text-[#8B5CF6]">THƯ VIỆN</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Quản lý Tài nguyên</h1>
      <p className="mt-2 max-w-2xl text-sm text-[#64748B]">Tệp được tải trực tiếp lên Cloudflare R2. Cơ sở dữ liệu chỉ lưu thông tin mô tả, quyền hiển thị và lượt tải.</p>
    </section>

    <ResourceUploadForm />

    <section className="overflow-hidden rounded-2xl border-2 border-[#1E293B] bg-white shadow-pop-sm">
      <div className="flex items-center gap-3 border-b-2 border-[#1E293B] px-5 py-4">
        <FileArchive className="h-5 w-5 text-[#7C3AED]" />
        <div><h2 className="font-extrabold text-[#1E293B]">Tài nguyên đã tải lên</h2><p className="text-sm text-[#64748B]">Hiển thị tối đa 100 mục gần nhất</p></div>
      </div>
      {resources.length ? <div className="overflow-x-auto"><table className="min-w-[900px] w-full text-left text-sm"><thead className="bg-[#F8FAFC] text-xs font-extrabold text-[#64748B]"><tr><th className="px-5 py-3">Tài nguyên</th><th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3">Kích thước</th><th className="px-5 py-3">Lượt tải</th><th className="px-5 py-3">Người tải</th><th className="px-5 py-3">Ngày tạo</th><th className="px-5 py-3">Thao tác</th></tr></thead><tbody>{resources.map((resource) => <tr key={resource.id} className="border-t border-[#E2E8F0]"><td className="px-5 py-4"><p className="font-extrabold text-[#1E293B]">{resource.title}</p><p className="mt-1 text-xs text-[#64748B]">{resource.topic}, {resource.file_name}</p></td><td className="px-5 py-4"><span className={`rounded-md px-2 py-1 text-xs font-extrabold ${statusClass(resource.status)}`}>{statusLabel(resource.status)}</span></td><td className="px-5 py-4 font-mono text-xs text-[#475569]">{formatResourceFileSize(resource.file_size)}</td><td className="px-5 py-4 font-mono text-xs text-[#475569]">{resource.download_count.toLocaleString("vi-VN")}</td><td className="px-5 py-4 text-[#475569]">{resource.uploaded_by.name || resource.uploaded_by.email}</td><td className="px-5 py-4 text-[#475569]">{formatDate(resource.created_at)}</td><td className="px-5 py-4"><DeleteResourceButton resourceId={resource.id} title={resource.title} /></td></tr>)}</tbody></table></div> : <div className="px-5 py-12 text-center text-sm text-[#64748B]">Chưa có tài nguyên nào. Hãy dùng biểu mẫu phía trên để tải tệp đầu tiên.</div>}
    </section>
  </div>;
}
