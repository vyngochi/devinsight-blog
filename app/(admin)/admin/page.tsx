import Link from "next/link";
import {
  Activity,
  BookOpen,
  Eye,
  MessageSquare,
  ShieldCheck,
  UserRoundPlus,
  Users,
} from "lucide-react";
import { getAdminDashboardData } from "@/features/admin/server/admin.service";

const numberFormat = new Intl.NumberFormat("vi-VN");
export default async function AdminDashboardPage() {
  const { analytics, platform } = await getAdminDashboardData();
  const cards = [
    { label: "Tổng lượt đọc", value: analytics.totalReaders, icon: Eye, color: "bg-[#8B5CF6]" },
    { label: "Độc giả hôm nay", value: analytics.readersToday, icon: Activity, color: "bg-[#F472B6]" },
    { label: "Tài khoản", value: platform.totalUsers, icon: Users, color: "bg-[#38BDF8]" },
    { label: "Bài đã xuất bản", value: analytics.publishedPosts, icon: BookOpen, color: "bg-[#FBBF24] text-[#1E293B]" },
    { label: "Bài nháp", value: platform.draftPosts, icon: UserRoundPlus, color: "bg-[#34D399] text-[#1E293B]" },
    { label: "Bình luận", value: analytics.totalComments, icon: MessageSquare, color: "bg-[#1E293B]" },
  ];
  const maxDailyReaders = Math.max(
    ...analytics.dailyReaders.map((day) => day.readers),
    1,
  );

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs font-bold text-[#8B5CF6]">TỔNG QUAN</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Sức khỏe nền tảng</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#64748B]">
            Theo dõi nội dung, độc giả và tài khoản từ một nơi.
          </p>
        </div>
        <Link
          href="/admin/users"
          className="inline-flex items-center justify-center rounded-full border-2 border-[#1E293B] bg-white px-4 py-2 text-sm font-bold shadow-pop-sm hover:bg-[#FBBF24]"
        >
          Quản lý người dùng
        </Link>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <article key={label} className="rounded-2xl border-2 border-[#1E293B] bg-white p-5 shadow-pop-sm">
            <span className={`grid h-10 w-10 place-items-center rounded-xl border-2 border-[#1E293B] text-white ${color}`}>
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-5 text-3xl font-extrabold">{numberFormat.format(value)}</p>
            <p className="mt-1 text-sm font-bold text-[#64748B]">{label}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <article className="rounded-2xl border-2 border-[#1E293B] bg-white p-6 shadow-pop-sm lg:col-span-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold">Độc giả 7 ngày gần nhất</h2>
              <p className="mt-1 text-sm text-[#64748B]">Lượt đọc duy nhất theo từng ngày</p>
            </div>
            <strong className="rounded-full bg-[#F1F5F9] px-3 py-1 font-mono text-xs">
              {numberFormat.format(analytics.readersSevenDays)} / 7 ngày
            </strong>
          </div>
          <div className="mt-8 flex h-56 items-end gap-3">
            {analytics.dailyReaders.map((day) => (
              <div key={day.date} className="flex h-full flex-1 flex-col justify-end">
                <div
                  className="min-h-0 rounded-t-lg bg-[#8B5CF6] transition-[height]"
                  style={{
                    height: `${Math.max((day.readers / maxDailyReaders) * 100, day.readers ? 8 : 0)}%`,
                  }}
                  title={`${day.date}: ${day.readers} độc giả`}
                />
                <span className="mt-2 text-center font-mono text-[10px] text-[#64748B]">
                  {day.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-[#64748B]">
            30 ngày gần nhất: <strong className="text-[#1E293B]">{numberFormat.format(analytics.readersThirtyDays)}</strong> độc giả duy nhất.
          </p>
        </article>

        <article className="rounded-2xl border-2 border-[#1E293B] bg-white p-6 shadow-pop-sm lg:col-span-2">
          <h2 className="text-xl font-extrabold">Bài viết nổi bật</h2>
          <ol className="mt-5 space-y-4">
            {analytics.topPosts.length ? (
              analytics.topPosts.map((post, index) => (
                <li key={post.slug} className="flex gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#1E293B] bg-[#FBBF24] text-xs font-extrabold">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <Link href={`/posts/${post.slug}`} className="line-clamp-2 font-bold hover:text-[#8B5CF6]">
                      {post.title}
                    </Link>
                    <p className="mt-1 text-xs text-[#64748B]">{numberFormat.format(post.view_count)} lượt đọc</p>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-sm text-[#64748B]">Chưa có dữ liệu bài viết.</li>
            )}
          </ol>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border-2 border-[#1E293B] bg-white p-6 shadow-pop-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold">Tài khoản mới</h2>
              <p className="mt-1 text-sm text-[#64748B]">5 người dùng đăng ký gần nhất</p>
            </div>
            <Link href="/admin/users" className="text-sm font-bold text-[#8B5CF6] hover:underline">Xem tất cả</Link>
          </div>
          <div className="mt-5 space-y-3">
            {platform.latestUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#F1F5F9] p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{user.name || user.email}</p>
                  <p className="truncate text-xs text-[#64748B]">{user.email}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${user.role === "ADMIN" ? "bg-[#FBBF24] text-[#1E293B]" : "bg-white text-[#64748B]"}`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border-2 border-[#1E293B] bg-[#1E293B] p-6 text-white shadow-pop-sm">
          <ShieldCheck className="h-8 w-8 text-[#FBBF24]" />
          <h2 className="mt-5 text-xl font-extrabold">Trạng thái quản trị</h2>
          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-white/60">Quản trị viên</dt><dd className="mt-1 text-2xl font-extrabold">{platform.adminUsers}</dd></div>
            <div><dt className="text-white/60">Email đã xác thực</dt><dd className="mt-1 text-2xl font-extrabold">{platform.verifiedUsers}</dd></div>
            <div><dt className="text-white/60">Thành viên mới 30 ngày</dt><dd className="mt-1 text-2xl font-extrabold">{platform.newUsersLastThirtyDays}</dd></div>
            <div><dt className="text-white/60">Bài lưu trữ</dt><dd className="mt-1 text-2xl font-extrabold">{platform.archivedPosts}</dd></div>
          </dl>
          <p className="mt-6 border-t border-white/20 pt-4 text-xs text-white/70">Dữ liệu được lấy trực tiếp từ hệ thống.</p>
        </article>
      </section>
    </div>
  );
}
