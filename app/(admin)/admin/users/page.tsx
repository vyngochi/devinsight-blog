import { Search, ShieldCheck, UserCheck, Users } from "lucide-react";
import { auth } from "@/auth";
import { updateManagedUserRole } from "@/features/admin/server/admin.actions";
import { getManagedUsers } from "@/features/admin/server/admin.service";

const dateFormat = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

type UsersPageProps = {
  searchParams: Promise<{ q?: string; role?: string }>;
};

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  const filters = await searchParams;
  const role =
    filters.role === "ADMIN" || filters.role === "USER"
      ? filters.role
      : undefined;
  const [users, session] = await Promise.all([
    getManagedUsers({ query: filters.q, role }),
    auth(),
  ]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs font-bold text-[#8B5CF6]">PHÂN QUYỀN</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
            Người dùng và vai trò
          </h1>
          <p className="mt-2 text-sm text-[#64748B]">
            Quản lý tối đa 100 tài khoản mới nhất. Thay đổi quyền luôn được kiểm tra ở server.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border-2 border-[#1E293B] bg-white px-4 py-2 text-sm font-bold shadow-pop-sm">
          <Users className="h-4 w-4 text-[#8B5CF6]" />
          {users.length} kết quả
        </div>
      </section>

      <form className="grid gap-3 rounded-2xl border-2 border-[#1E293B] bg-white p-4 shadow-pop-sm md:grid-cols-[1fr_auto_auto]">
        <label className="relative">
          <span className="sr-only">Tìm người dùng</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
          <input
            name="q"
            defaultValue={filters.q}
            placeholder="Tìm theo tên hoặc email"
            className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] py-2.5 pl-10 pr-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#8B5CF6]"
          />
        </label>
        <select name="role" defaultValue={role ?? ""} className="rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] px-3 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#8B5CF6]">
          <option value="">Tất cả vai trò</option>
          <option value="ADMIN">ADMIN</option>
          <option value="USER">USER</option>
        </select>
        <button className="rounded-full border-2 border-[#1E293B] bg-[#8B5CF6] px-5 py-2.5 text-sm font-bold text-white shadow-pop-sm hover:bg-[#7C3AED]">
          Lọc danh sách
        </button>
      </form>

      <section className="overflow-hidden rounded-2xl border-2 border-[#1E293B] bg-white shadow-pop-sm">
        <div className="hidden grid-cols-[minmax(220px,1.6fr)_120px_145px_140px] gap-4 border-b-2 border-[#1E293B] bg-[#FFFDF5] px-5 py-3 font-mono text-[10px] font-bold tracking-wider text-[#64748B] md:grid">
          <span>NGƯỜI DÙNG</span><span>THAM GIA</span><span>HOẠT ĐỘNG</span><span>VAI TRÒ</span>
        </div>
        {users.length ? (
          <div className="divide-y-2 divide-[#E2E8F0]">
            {users.map((user) => {
              const isCurrentUser = user.id === session?.user?.id;
              const isPrimaryAdmin = Boolean(
                process.env.ADMIN_EMAIL &&
                  user.email.toLowerCase() === process.env.ADMIN_EMAIL.trim().toLowerCase(),
              );
              const locked = isCurrentUser || isPrimaryAdmin;

              return (
                <article key={user.id} className="grid gap-4 p-5 md:grid-cols-[minmax(220px,1.6fr)_120px_145px_140px] md:items-center">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-[#1E293B] bg-[#FBBF24] font-extrabold">
                        {(user.name || user.email).slice(0, 1).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-bold">{user.name || "Chưa đặt tên"}</p>
                        <p className="truncate text-sm text-[#64748B]">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-[#64748B]">{dateFormat.format(user.created_at)}</span>
                  <div className="text-xs text-[#64748B]">
                    <p>{user.emailVerified ? "Email đã xác thực" : "Chưa xác thực"}</p>
                    <p className="mt-1">{user._count.comments} bình luận · {user._count.accounts} liên kết</p>
                  </div>
                  <form action={updateManagedUserRole} className="flex items-center gap-2">
                    <input type="hidden" name="userId" value={user.id} />
                    <select name="role" defaultValue={user.role} disabled={locked} aria-label={`Vai trò của ${user.email}`} className="min-w-0 flex-1 rounded-lg border-2 border-[#1E293B] bg-[#FFFDF5] px-2 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-60">
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <button disabled={locked} title={locked ? "Tài khoản này được bảo vệ" : "Lưu vai trò"} className="rounded-lg border-2 border-[#1E293B] bg-white px-2 py-2 text-xs font-bold shadow-pop-sm hover:bg-[#FBBF24] disabled:cursor-not-allowed disabled:opacity-50">
                      Lưu
                    </button>
                  </form>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center">
            <UserCheck className="mx-auto h-8 w-8 text-[#64748B]" />
            <p className="mt-3 font-bold">Không tìm thấy người dùng phù hợp.</p>
          </div>
        )}
      </section>

      <section className="flex gap-3 rounded-2xl border-2 border-[#1E293B] bg-[#FBBF24] p-4 text-sm">
        <ShieldCheck className="h-5 w-5 shrink-0" />
        <p><strong>Bảo vệ quyền cao nhất:</strong> bạn không thể đổi quyền của chính mình hoặc email được khai báo tại <code>ADMIN_EMAIL</code>.</p>
      </section>
    </div>
  );
}
