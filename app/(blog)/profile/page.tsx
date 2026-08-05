import type { Metadata } from "next";
import { CalendarDays, Mail, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { getUserProfile } from "@/features/profile/server/profile.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hồ sơ cá nhân",
  description: "Cập nhật tên hiển thị và ảnh đại diện trên DevInsight.",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  const profile = await getUserProfile(session.user.id);
  if (!profile) redirect("/");
  const joinedAt = new Intl.DateTimeFormat("vi-VN", { dateStyle: "long" }).format(profile.created_at);

  return (
    <main className="bg-[#FFFDF5] py-10 sm:py-14">
      <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-8">
        <section className="rounded-2xl border-2 border-[#1E293B] bg-white p-5 shadow-pop-sm sm:p-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#1E293B] sm:text-4xl">Hồ sơ cá nhân</h1>
            <p className="mt-3 text-sm leading-6 text-[#64748B]">Chỉnh thông tin mà cộng đồng nhìn thấy khi bạn đặt câu hỏi hoặc viết phản hồi.</p>
          </div>
          <div className="mt-8 border-t-2 border-[#E2E8F0] pt-7"><ProfileForm profile={profile} /></div>
        </section>

        <aside className="h-fit rounded-2xl border-2 border-[#1E293B] bg-[#EDE9FE] p-5 shadow-pop-sm">
          <h2 className="text-lg font-extrabold text-[#1E293B]">Thông tin tài khoản</h2>
          <dl className="mt-5 space-y-5 text-sm">
            <div><dt className="flex items-center gap-2 font-bold text-[#64748B]"><Mail className="h-4 w-4" />Email</dt><dd className="mt-1 break-all font-semibold text-[#1E293B]">{profile.email}</dd></div>
            <div><dt className="flex items-center gap-2 font-bold text-[#64748B]"><ShieldCheck className="h-4 w-4" />Vai trò</dt><dd className="mt-1 font-semibold text-[#1E293B]">{profile.role === "ADMIN" ? "Quản trị viên" : "Thành viên"}</dd></div>
            <div><dt className="flex items-center gap-2 font-bold text-[#64748B]"><CalendarDays className="h-4 w-4" />Tham gia</dt><dd className="mt-1 font-semibold text-[#1E293B]">{joinedAt}</dd></div>
          </dl>
          <p className="mt-6 rounded-xl border border-[#C4B5FD] bg-white/70 p-3 text-xs leading-5 text-[#475569]">Email đăng nhập được giữ cố định để bảo vệ tài khoản.</p>
        </aside>
      </div>
    </main>
  );
}
