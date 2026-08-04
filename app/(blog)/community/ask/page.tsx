import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CommunityQuestionForm } from "@/components/community/community-forms";

export const metadata: Metadata = { title: "Đặt câu hỏi", robots: { index: false, follow: false } };

export default async function AskCommunityQuestionPage() {
  const session = await auth();
  if (!session?.user) redirect("/community");
  return <div className="bg-[#FFFDF5]"><main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14"><Link href="/community" className="text-sm font-extrabold text-[#7C3AED] hover:underline">Quay lại Cộng đồng</Link><div className="mt-4 rounded-2xl border-2 border-[#1E293B] bg-white p-5 shadow-pop-sm sm:p-7"><h1 className="text-3xl font-extrabold tracking-tight text-[#1E293B]">Đặt câu hỏi mới</h1><p className="mt-2 text-sm leading-relaxed text-[#64748B]">Mô tả vấn đề, điều bạn đã thử và code liên quan để cộng đồng có thể hỗ trợ chính xác hơn.</p><div className="mt-7"><CommunityQuestionForm /></div></div></main></div>;
}
