import Link from "next/link";
import { CheckCircle2, CircleAlert, Database, KeyRound, Mail, Settings, ShieldCheck } from "lucide-react";
import { getSystemConfigurationStatus } from "@/features/admin/server/admin.service";
import { getAuthorPermissions } from "@/features/admin/server/author-permissions";
import { AuthorPermissionsForm } from "@/features/admin/components/author-permissions-form";
import { auth } from "@/auth";
import { notFound } from "next/navigation";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") notFound();
  const settings = getSystemConfigurationStatus();
  const authorPermissions = await getAuthorPermissions();
  const configuredCount = settings.filter((setting) => setting.configured).length;

  return (
    <div className="space-y-6">
      <section>
        <p className="font-mono text-xs font-bold text-[#8B5CF6]">VẬN HÀNH</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Cấu hình hệ thống</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#64748B]">
          Kiểm tra các dịch vụ nền tảng mà không hiển thị khóa bí mật.
        </p>
      </section>

      <section className="rounded-2xl border-2 border-[#1E293B] bg-[#1E293B] p-6 text-white shadow-pop-sm">
        <div className="flex items-start justify-between gap-5">
          <div>
            <Settings className="h-7 w-7 text-[#FBBF24]" />
            <h2 className="mt-4 text-xl font-extrabold">Mức độ sẵn sàng</h2>
            <p className="mt-1 text-sm text-white/70">Các biến môi trường cần thiết cho platform.</p>
          </div>
          <strong className="rounded-full bg-white px-4 py-2 text-lg text-[#1E293B]">{configuredCount}/{settings.length}</strong>
        </div>
      </section>

      <AuthorPermissionsForm permissions={authorPermissions} />

      <section className="grid gap-4 md:grid-cols-2">
        {settings.map((setting) => (
          <article key={setting.label} className="rounded-2xl border-2 border-[#1E293B] bg-white p-5 shadow-pop-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-extrabold">{setting.label}</h2>
                <p className="mt-1 text-sm text-[#64748B]">{setting.description}</p>
              </div>
              {setting.configured ? (
                <CheckCircle2 className="h-6 w-6 shrink-0 text-[#059669]" aria-label="Đã cấu hình" />
              ) : (
                <CircleAlert className="h-6 w-6 shrink-0 text-[#DC2626]" aria-label="Chưa cấu hình" />
              )}
            </div>
            <p className={`mt-5 inline-flex rounded-full px-3 py-1 text-xs font-bold ${setting.configured ? "bg-[#D1FAE5] text-[#065F46]" : "bg-red-50 text-red-700"}`}>
              {setting.configured ? "Đã sẵn sàng" : "Cần cấu hình"}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border-2 border-[#1E293B] bg-white p-5 shadow-pop-sm">
          <Database className="h-6 w-6 text-[#8B5CF6]" />
          <h2 className="mt-4 font-extrabold">Dữ liệu</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#64748B]">Schema và dữ liệu được quản lý bằng Prisma. Không chỉnh sửa trực tiếp dữ liệu production khi chưa có backup.</p>
        </article>
        <article className="rounded-2xl border-2 border-[#1E293B] bg-white p-5 shadow-pop-sm">
          <Mail className="h-6 w-6 text-[#F472B6]" />
          <h2 className="mt-4 font-extrabold">Email xác thực</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#64748B]">SMTP dùng App Password của Gmail. Không lưu hoặc hiển thị mật khẩu SMTP trong dashboard.</p>
        </article>
        <article className="rounded-2xl border-2 border-[#1E293B] bg-white p-5 shadow-pop-sm">
          <KeyRound className="h-6 w-6 text-[#38BDF8]" />
          <h2 className="mt-4 font-extrabold">Bảo mật</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#64748B]">Role, session và các Server Action đều kiểm tra quyền ADMIN trên server.</p>
        </article>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border-2 border-[#1E293B] bg-[#FBBF24] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <ShieldCheck className="h-6 w-6 shrink-0" />
          <p className="text-sm leading-relaxed"><strong>Ghi chú:</strong> biến môi trường chỉ được thay đổi trong file cấu hình hoặc dashboard deployment, sau đó khởi động lại ứng dụng.</p>
        </div>
        <Link href="/admin/users" className="shrink-0 rounded-full border-2 border-[#1E293B] bg-white px-4 py-2 text-sm font-bold shadow-pop-sm hover:bg-[#FFFDF5]">
          Kiểm tra role
        </Link>
      </section>
    </div>
  );
}
