import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { CommunityAuthRequired } from "@/components/community/community-auth-required";
import { CommunityQuestionForm } from "@/components/community/community-forms";

export const metadata: Metadata = { title: "Đặt câu hỏi", robots: { index: false, follow: false } };

export default async function AskCommunityQuestionPage() {
  const session = await auth();
  return (
    <div className="min-h-[70dvh] bg-[#F8FAFC]">
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/community" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#7C3AED]"><ArrowLeft className="h-3.5 w-3.5" />Quay lại Cộng đồng</Link>
        <section className="mt-3 rounded-xl border border-[#CBD5E1] bg-white p-4 sm:p-5">
          <h1 className="text-xl font-extrabold tracking-tight text-[#1E293B] sm:text-2xl">Đặt câu hỏi mới</h1>
          <p className="mt-1.5 text-xs leading-5 text-[#64748B]">Mô tả vấn đề, điều bạn đã thử và đoạn code liên quan để nhận được phản hồi chính xác.</p>
          <div className="mt-5">
            {session?.user ? <CommunityQuestionForm /> : <CommunityAuthRequired />}
          </div>
        </section>
      </main>
    </div>
  );
}
