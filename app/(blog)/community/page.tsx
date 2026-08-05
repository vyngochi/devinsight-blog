import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, MessageSquarePlus, Search } from "lucide-react";
import { CommunityAuthorMeta } from "@/components/community/community-author-meta";
import { COMMUNITY_TOPICS } from "@/features/community/community-content";
import { getCommunityQuestions } from "@/features/community/server/community.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cộng đồng lập trình",
  description: "Hỏi đáp lập trình cùng cộng đồng DevInsight. Đăng câu hỏi, chia sẻ code và nhận phản hồi từ các thành viên.",
  alternates: { canonical: "/community" },
};

export default async function CommunityPage({ searchParams }: { searchParams: Promise<{ q?: string; topic?: string }> }) {
  const { q, topic } = await searchParams;
  const selectedTopic = COMMUNITY_TOPICS.includes(topic as (typeof COMMUNITY_TOPICS)[number]) ? topic : undefined;
  const questions = await getCommunityQuestions({ query: q, topic: selectedTopic });

  return (
    <div className="min-h-[70dvh] bg-[#F8FAFC]">
      <header className="border-b border-[#CBD5E1] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 py-6 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#1E293B] sm:text-3xl">Cộng đồng</h1>
            <p className="mt-1.5 text-sm text-[#64748B]">Hỏi đáp kỹ thuật, chia sẻ cách làm và cùng nhau gỡ lỗi.</p>
          </div>
          <Link href="/community/ask" className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#6D28D9] active:translate-y-px">
            <MessageSquarePlus className="h-4 w-4" /> Đặt câu hỏi
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_14rem] lg:px-8">
        <div className="min-w-0">
          <form className="grid gap-2 rounded-xl border border-[#CBD5E1] bg-white p-3 md:grid-cols-[minmax(0,1fr)_11rem_auto]" role="search">
            <label className="sr-only" htmlFor="community-search">Tìm câu hỏi</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input id="community-search" name="q" defaultValue={q} placeholder="Tìm vấn đề hoặc đoạn code" className="h-9 w-full rounded-lg border border-[#CBD5E1] bg-white pl-9 pr-3 text-xs font-medium text-[#1E293B] outline-none placeholder:text-[#94A3B8] focus:border-[#7C3AED]" />
            </div>
            <select name="topic" defaultValue={selectedTopic ?? ""} aria-label="Lọc theo chủ đề" className="h-9 rounded-lg border border-[#CBD5E1] bg-white px-2.5 text-xs font-semibold text-[#1E293B] outline-none focus:border-[#7C3AED]">
              <option value="">Tất cả chủ đề</option>
              {COMMUNITY_TOPICS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <button className="h-9 rounded-lg bg-[#1E293B] px-4 text-xs font-bold text-white hover:bg-[#334155]">Tìm kiếm</button>
          </form>

          <div className="mt-5 flex items-center justify-between gap-4">
            <h2 className="text-base font-extrabold text-[#1E293B]">Câu hỏi mới nhất</h2>
            <span className="text-xs font-semibold text-[#64748B]">{questions.length} kết quả</span>
          </div>

          {questions.length ? (
            <div className="mt-3 overflow-hidden rounded-xl border border-[#CBD5E1] bg-white">
              {questions.map((question, index) => (
                <article key={question.id} className={`flex flex-col gap-3 p-4 hover:bg-[#F8FAFC] sm:grid sm:grid-cols-[11rem_minmax(0,1fr)] ${index ? "border-t border-[#E2E8F0]" : ""}`}>
                  <CommunityAuthorMeta author={question.author} isAnonymous={question.is_anonymous} createdAt={question.created_at} />
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <Link href={`/community/${question.slug}`} className="text-sm font-extrabold leading-5 text-[#1E293B] hover:text-[#7C3AED]">{question.title}</Link>
                      <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[#64748B]"><MessageSquare className="h-3.5 w-3.5" />{question._count.answers}</span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[#64748B]">{question.content_text}</p>
                    <span className="mt-2 inline-flex rounded-md bg-[#EDE9FE] px-2 py-1 text-[10px] font-bold text-[#6D28D9]">{question.topic}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-xl border border-dashed border-[#94A3B8] bg-white p-7 text-center">
              <h2 className="text-sm font-extrabold text-[#1E293B]">Chưa có câu hỏi phù hợp</h2>
              <p className="mt-1.5 text-xs text-[#64748B]">Thử từ khóa khác hoặc đặt câu hỏi mới cho cộng đồng.</p>
              <Link href="/community/ask" className="mt-3 inline-flex text-xs font-bold text-[#7C3AED] hover:underline">Đặt câu hỏi</Link>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-xl border border-[#CBD5E1] bg-white p-4 lg:sticky lg:top-24">
          <h2 className="text-sm font-extrabold text-[#1E293B]">Viết câu hỏi dễ trả lời</h2>
          <ul className="mt-3 space-y-2.5 text-xs leading-5 text-[#64748B]">
            <li>Mô tả kết quả bạn muốn đạt được.</li>
            <li>Thêm đoạn code tối thiểu tái hiện lỗi.</li>
            <li>Nêu rõ điều bạn đã thử.</li>
            <li>Không đăng token hoặc dữ liệu riêng tư.</li>
          </ul>
        </aside>
      </main>
    </div>
  );
}
