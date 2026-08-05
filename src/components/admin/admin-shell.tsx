import type { ReactNode } from "react";
import Link from "next/link";
import { ExternalLink, LogOut, ShieldCheck } from "lucide-react";
import { logoutAdmin } from "@/features/admin/server/admin.actions";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import type { user_role } from "@/generated/prisma/client";
import type { AuthorPermissions } from "@/features/admin/server/author-permissions";

type AdminShellProps = {
  children: ReactNode;
  admin: { name?: string | null; email?: string | null; role: user_role };
  permissions?: AuthorPermissions;
};

export function AdminShell({ children, admin, permissions }: AdminShellProps) {
  const displayName = admin.name || admin.email || "Người quản lý";
  const isAuthor = admin.role === "AUTHOR";

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#1E293B]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r-2 border-[#1E293B] bg-[#FFFDF5] p-5 md:flex md:flex-col">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl border-2 border-[#1E293B] bg-[#FBBF24] shadow-pop-sm">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span>
            <strong className="block text-lg font-extrabold">DevInsight</strong>
            <span className="font-mono text-[10px] font-bold text-[#8B5CF6]">
              {isAuthor ? "AUTHOR STUDIO" : "ADMIN CONSOLE"}
            </span>
          </span>
        </Link>

        <div className="mt-10">
          <p className="mb-3 px-3 font-mono text-[10px] font-bold tracking-wider text-[#64748B]">
            {isAuthor ? "KHÔNG GIAN TÁC GIẢ" : "QUẢN TRỊ NỀN TẢNG"}
          </p>
          <AdminNavigation role={admin.role} permissions={permissions} />
        </div>

        <div className="mt-auto rounded-xl border-2 border-[#1E293B] bg-white p-3">
          <p className="truncate text-sm font-bold">{displayName}</p>
          <p className="mt-1 font-mono text-[10px] text-[#64748B]">{admin.role}</p>
          <form action={logoutAdmin} className="mt-3">
            <button className="flex w-full items-center gap-2 rounded-lg bg-[#F1F5F9] px-3 py-2 text-xs font-bold hover:bg-[#FBBF24]">
              <LogOut className="h-3.5 w-3.5" />
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-30 border-b-2 border-[#1E293B] bg-[#FFFDF5]/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-bold tracking-wider text-[#8B5CF6]">
                {isAuthor ? "DEVINSIGHT AUTHOR" : "DEVINSIGHT ADMIN"}
              </p>
              <p className="truncate text-sm font-bold text-[#64748B]">
                {isAuthor ? "Nội dung và hoạt động của bạn" : "Quản trị toàn nền tảng"}
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-[#1E293B] bg-white px-3 py-2 text-xs font-bold shadow-pop-sm hover:bg-[#FBBF24]"
            >
              Xem website
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="border-t border-[#CBD5E1] md:hidden">
            <AdminNavigation role={admin.role} permissions={permissions} />
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
