import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageSquare, UserRound } from "lucide-react";
import type { JSONContent } from "@tiptap/core";
import { auth } from "@/auth";
import { CommunityAnswerForm } from "@/components/community/community-forms";
import { ReportContentButton } from "@/components/community/report-content-button";
import { RichTextContent } from "@/components/community/rich-text-content";
import { getCommunityDisplayName } from "@/features/community/anonymous-name";
import { getCommunityQuestion } from "@/features/community/server/community.service";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const question = await getCommunityQuestion(slug);
  if (!question) return { title: "Không tìm thấy câu hỏi" };
  return { title: question.title, description: `Thảo luận ${question.topic} trong Cộng đồng DevInsight.`, alternates: { canonical: `/community/${question.slug}` } };
}

function AuthorMeta({ author, isAnonymous, createdAt }: { author: { id: string; name: string | null; image: string | null }; isAnonymous: boolean; createdAt: Date }) {
  return <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#64748B]"><span className="inline-flex items-center gap-1.5 font-bold text-[#475569]"><UserRound className="h-3.5 w-3.5" />{getCommunityDisplayName({ ...author, isAnonymous })}</span><time dateTime={createdAt.toISOString()}>{formatDate(createdAt)}</time>{isAnonymous ? <span>Đăng ẩn danh</span> : null}</div>;
}

export default async function CommunityQuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [question, session] = await Promise.all([getCommunityQuestion(slug), auth()]);
  if (!question) notFound();
  return <div className="bg-[#FFFDF5]"><main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12"><Link href="/community" className="text-sm font-extrabold text-[#7C3AED] hover:underline">Cộng đồng</Link><article className="mt-4 rounded-2xl border-2 border-[#1E293B] bg-white p-5 shadow-pop-sm sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><span className="rounded-md border border-[#1E293B] bg-[#F1F5F9] px-2 py-1 text-xs font-bold text-[#475569]">{question.topic}</span><h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#1E293B]">{question.title}</h1></div><ReportContentButton questionId={question.id} /></div><div className="mt-4"><AuthorMeta author={question.author} isAnonymous={question.is_anonymous} createdAt={question.created_at} /></div><div className="mt-7"><RichTextContent content={question.content_json as JSONContent} /></div></article>
    <section className="mt-8" aria-labelledby="answers-title"><div className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-[#7C3AED]" /><h2 id="answers-title" className="text-2xl font-extrabold text-[#1E293B]">{question.answers.length} câu trả lời</h2></div><div className="mt-4 space-y-4">{question.answers.length ? question.answers.map((answer) => <article key={answer.id} className="rounded-2xl border-2 border-[#1E293B] bg-white p-5"><div className="flex items-start justify-between gap-3"><AuthorMeta author={answer.author} isAnonymous={answer.is_anonymous} createdAt={answer.created_at} /><ReportContentButton answerId={answer.id} /></div><div className="mt-4"><RichTextContent content={answer.content_json as JSONContent} /></div>{answer.replies.length ? <div className="mt-5 space-y-3 border-l-2 border-[#E2E8F0] pl-4">{answer.replies.map((reply) => <article key={reply.id} className="rounded-xl bg-[#F8FAFC] p-4"><div className="flex items-start justify-between gap-3"><AuthorMeta author={reply.author} isAnonymous={reply.is_anonymous} createdAt={reply.created_at} /><ReportContentButton answerId={reply.id} /></div><div className="mt-3"><RichTextContent content={reply.content_json as JSONContent} /></div></article>)}</div> : null}{session?.user ? <CommunityAnswerForm questionId={question.id} parentId={answer.id} label="Phản hồi câu trả lời này" /> : null}</article>) : <p className="rounded-xl border-2 border-dashed border-[#94A3B8] bg-white p-5 text-sm text-[#64748B]">Chưa có phản hồi. Hãy là người đầu tiên hỗ trợ câu hỏi này.</p>}</div></section>
    <section className="mt-8 rounded-2xl border-2 border-[#1E293B] bg-white p-5 shadow-pop-sm"><h2 className="text-xl font-extrabold text-[#1E293B]">Thêm câu trả lời</h2>{session?.user ? <CommunityAnswerForm questionId={question.id} /> : <p className="mt-3 text-sm text-[#64748B]">Bạn cần <Link href="/" className="font-extrabold text-[#7C3AED] hover:underline">đăng nhập</Link> từ Header để viết phản hồi hoặc báo cáo nội dung.</p>}</section>
  </main></div>;
}
