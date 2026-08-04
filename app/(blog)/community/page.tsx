import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquarePlus, Search, UserRound } from "lucide-react";
import { getCommunityDisplayName } from "@/features/community/anonymous-name";
import { COMMUNITY_TOPICS } from "@/features/community/community-content";
import { getCommunityQuestions } from "@/features/community/server/community.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cộng đồng lập trình",
  description:
    "Hỏi đáp lập trình cùng cộng đồng DevInsight. Đăng câu hỏi, chia sẻ code và nhận phản hồi từ các thành viên.",
  alternates: { canonical: "/community" },
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; topic?: string }>;
}) {
  const { q, topic } = await searchParams;
  const selectedTopic = COMMUNITY_TOPICS.includes(
    topic as (typeof COMMUNITY_TOPICS)[number],
  )
    ? topic
    : undefined;
  const questions = await getCommunityQuestions({
    query: q,
    topic: selectedTopic,
  });

  return (
    <div className="bg-[#FFFDF5]">
      <section className="border-b-2 border-[#1E293B] bg-[#F1F5F9]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold text-[#7C3AED]">
              Cộng đồng DevInsight
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[#1E293B]">
              Q&A
            </h1>
            <p className="mt-3 text-base leading-relaxed text-[#475569]">
              Đặt câu hỏi để được giải đáp từ cộng đồng DevInsight
            </p>
          </div>
          <Link
            href="/community/ask"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-[#1E293B] bg-[#FBBF24] px-5 py-3 text-sm font-extrabold text-[#1E293B] shadow-pop-sm hover:bg-[#F59E0B]"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Đặt câu hỏi
          </Link>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:px-8">
        <div>
          <form
            className="grid gap-3 rounded-2xl border-2 border-[#1E293B] bg-white p-4 shadow-pop-sm md:grid-cols-[minmax(0,1fr)_auto_auto]"
            role="search"
          >
            <label className="sr-only" htmlFor="community-search">
              Tìm câu hỏi
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                id="community-search"
                name="q"
                defaultValue={q}
                placeholder="Tìm theo vấn đề hoặc đoạn code..."
                className="w-full rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] py-2.5 pl-10 pr-3 text-sm font-semibold outline-none placeholder:text-[#94A3B8] focus:border-[#7C3AED]"
              />
            </div>
            <select
              name="topic"
              defaultValue={selectedTopic ?? ""}
              className="rounded-xl border-2 border-[#1E293B] bg-white px-3 py-2.5 text-sm font-bold text-[#1E293B] outline-none focus:border-[#7C3AED]"
            >
              <option value="">Tất cả chủ đề</option>
              {COMMUNITY_TOPICS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <button className="rounded-xl border-2 border-[#1E293B] bg-[#8B5CF6] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#7C3AED]">
              Tìm kiếm
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between gap-4">
            <h2 className="text-xl font-extrabold text-[#1E293B]">
              Câu hỏi mới nhất
            </h2>
            <span className="text-sm font-bold text-[#64748B]">
              {questions.length} kết quả
            </span>
          </div>
          {questions.length ? (
            <div className="mt-4 space-y-3">
              {questions.map((question) => (
                <article
                  key={question.id}
                  className="rounded-2xl border-2 border-[#1E293B] bg-white p-5 shadow-pop-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                    <span className="rounded-md border border-[#1E293B] bg-[#F1F5F9] px-2 py-1 text-[#475569]">
                      {question.topic}
                    </span>
                    <span className="text-[#64748B]">
                      {question._count.answers} phản hồi
                    </span>
                  </div>
                  <Link
                    href={`/community/${question.slug}`}
                    className="mt-3 block text-lg font-extrabold text-[#1E293B] hover:text-[#7C3AED]"
                  >
                    {question.title}
                  </Link>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#64748B]">
                    {question.content_text}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B]">
                    <span className="inline-flex items-center gap-1.5 font-semibold">
                      <UserRound className="h-3.5 w-3.5" />
                      {getCommunityDisplayName({
                        ...question.author,
                        isAnonymous: question.is_anonymous,
                      })}
                    </span>
                    <time dateTime={question.created_at.toISOString()}>
                      {formatDate(question.created_at)}
                    </time>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border-2 border-dashed border-[#94A3B8] bg-white p-8 text-center">
              <h2 className="text-lg font-extrabold text-[#1E293B]">
                Chưa có câu hỏi phù hợp
              </h2>
              <p className="mt-2 text-sm text-[#64748B]">
                Hãy thử từ khóa khác hoặc là người đầu tiên đặt câu hỏi về chủ
                đề này.
              </p>
              <Link
                href="/community/ask"
                className="mt-4 inline-flex rounded-lg border-2 border-[#1E293B] bg-[#FBBF24] px-4 py-2 text-sm font-bold text-[#1E293B]"
              >
                Đặt câu hỏi
              </Link>
            </div>
          )}
        </div>

        <aside className="self-start rounded-2xl border-2 border-[#1E293B] bg-white p-5 lg:sticky lg:top-28">
          <h2 className="text-base font-extrabold text-[#1E293B]">
            Nguyên tắc cộng đồng
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#475569]">
            <li>Đặt tiêu đề mô tả rõ vấn đề.</li>
            <li>Thêm code tối thiểu có thể tái hiện lỗi.</li>
            <li>Không chia sẻ mật khẩu, token hay dữ liệu cá nhân.</li>
            <li>Tôn trọng người hỏi và người trả lời.</li>
            <li>Dùng Báo cáo khi nội dung vi phạm.</li>
          </ul>
        </aside>
      </main>
    </div>
  );
}
