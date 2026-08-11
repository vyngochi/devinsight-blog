import Link from "next/link";
import { MessageSquare, ArrowRight, Clock, HelpCircle } from "lucide-react";
import { StickerCard } from "@/components/ui/sticker-card";
import { Button, Badge } from "@/components/ui/button";

export interface CommunityQuestionSummary {
  id: string;
  slug: string;
  title: string;
  topic: string;
  content_text: string;
  is_anonymous: boolean;
  created_at: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  _count: {
    answers: number;
  };
}

export function CommunityQuestions({
  questions,
}: {
  questions: CommunityQuestionSummary[];
}) {
  if (!questions || questions.length === 0) {
    return null; // Do not render if no questions
  }

  // Define topics to allow filtering if needed, or just display the recent ones.
  // We'll just display the latest 4 questions for the home page.
  const displayQuestions = questions.slice(0, 4);

  return (
    <section className="w-full border-t-2 border-[#1E293B] bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#7C3AED]">
              <HelpCircle className="h-4 w-4" aria-hidden="true" />
              Cộng đồng DevInsight
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#1E293B] sm:text-3xl">
              Hỏi đáp & Thảo luận
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#64748B]">
              Nơi bạn có thể đặt câu hỏi, chia sẻ vấn đề và nhận sự trợ giúp từ
              những người học code khác.
            </p>
          </div>
          <div className="shrink-0">
            <Link href="/community/ask">
              <Button variant="primary" size="lg" className="shadow-pop-sm">
                Đặt câu hỏi ngay
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {displayQuestions.map((q) => (
            <StickerCard
              key={q.id}
              shadowColor="mint"
              bg="bg-[#F8FAFC]"
              className="flex flex-col justify-between p-6 border-2"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="rounded-full bg-[#E0E7FF] px-2.5 py-1 text-[11px] font-bold text-[#4338CA]">
                    {q.topic}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#64748B]">
                    {new Date(q.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <Link href={`/community/${q.slug}`} className="group block">
                  <h3 className="text-xl font-extrabold leading-snug text-[#1E293B] transition-colors group-hover:text-[#34D399]">
                    {q.title}
                  </h3>
                </Link>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#64748B]">
                  {q.content_text}
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t-2 border-[#E2E8F0] pt-4 text-xs font-bold text-[#64748B]">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1E293B] text-[10px] text-white">
                    {q.is_anonymous || !q.author.name
                      ? "A"
                      : q.author.name.charAt(0).toUpperCase()}
                  </span>
                  <span>
                    {q.is_anonymous
                      ? "Người dùng ẩn danh"
                      : q.author.name || "Ẩn danh"}
                  </span>
                </div>
                <Link
                  href={`/community/${q.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 border-2 border-[#1E293B] text-[#1E293B] transition-colors hover:bg-[#34D399]"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{q._count.answers} trả lời</span>
                </Link>
              </div>
            </StickerCard>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/community">
            <Button variant="outline">Khám phá cộng đồng</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
