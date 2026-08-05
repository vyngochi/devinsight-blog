import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { notFound } from "next/navigation";
import type { JSONContent } from "@tiptap/core";
import { auth } from "@/auth";
import { CommunityAuthorMeta } from "@/components/community/community-author-meta";
import { CommunityAnswerForm } from "@/components/community/community-forms";
import { ReportContentButton } from "@/components/community/report-content-button";
import { RichTextContent } from "@/components/community/rich-text-content";
import { getCommunityQuestion } from "@/features/community/server/community.service";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const question = await getCommunityQuestion(slug);
  if (!question) return { title: "Không tìm thấy câu hỏi" };
  return {
    title: question.title,
    description: `Thảo luận ${question.topic} trong Cộng đồng DevInsight.`,
    alternates: { canonical: `/community/${question.slug}` },
  };
}

export default async function CommunityQuestionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [question, session] = await Promise.all([
    getCommunityQuestion(slug),
    auth(),
  ]);
  if (!question) notFound();
  const responseCount = question.answers.reduce(
    (total, answer) => total + 1 + answer.replies.length,
    0,
  );

  return (
    <div className="min-h-[70dvh] bg-[#F8FAFC]">
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/community"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#7C3AED]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Cộng đồng
        </Link>

        <article className="mt-3 rounded-xl border border-[#CBD5E1] bg-white p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <CommunityAuthorMeta
              author={question.author}
              isAnonymous={question.is_anonymous}
              createdAt={question.created_at}
              size="md"
            />
            <ReportContentButton questionId={question.id} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-[#EDE9FE] px-2 py-1 text-[10px] font-bold text-[#6D28D9]">
              {question.topic}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#64748B]">
              <MessageSquare className="h-3.5 w-3.5" />
              {responseCount} phản hồi
            </span>
          </div>
          <h1 className="mt-3 text-xl font-extrabold leading-7 tracking-tight text-[#1E293B] sm:text-2xl">
            {question.title}
          </h1>
          <div className="mt-4 border-t border-[#E2E8F0] pt-4">
            <RichTextContent content={question.content_json as JSONContent} />
          </div>
        </article>

        <section
          className="mt-5 overflow-visible rounded-xl border border-[#CBD5E1] bg-white"
          aria-labelledby="answers-title"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-4 py-3">
            <h2
              id="answers-title"
              className="text-sm font-extrabold text-[#1E293B]"
            >
              Phản hồi
            </h2>
            <span className="text-[11px] font-semibold text-[#64748B]">
              {responseCount} nội dung
            </span>
          </div>

          {question.answers.length ? (
            <div>
              {question.answers.map((answer, answerIndex) => (
                <article
                  key={answer.id}
                  className={`px-4 py-4 sm:px-5 ${answerIndex ? "border-t border-[#E2E8F0]" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <CommunityAuthorMeta
                      author={answer.author}
                      isAnonymous={answer.is_anonymous}
                      createdAt={answer.created_at}
                    />
                    <ReportContentButton answerId={answer.id} />
                  </div>
                  <div className="mt-3 pl-0 sm:pl-11">
                    <RichTextContent
                      content={answer.content_json as JSONContent}
                    />
                  </div>

                  {answer.replies.length ? (
                    <div className="mt-3 overflow-visible rounded-lg bg-[#F8FAFC] sm:ml-11">
                      {answer.replies.map((reply, replyIndex) => (
                        <article
                          key={reply.id}
                          className={`p-3.5 ${replyIndex ? "border-t border-[#E2E8F0]" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <CommunityAuthorMeta
                              author={reply.author}
                              isAnonymous={reply.is_anonymous}
                              createdAt={reply.created_at}
                            />
                            <ReportContentButton answerId={reply.id} />
                          </div>
                          <div className="mt-2.5 sm:pl-11">
                            <RichTextContent
                              content={reply.content_json as JSONContent}
                            />
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : null}

                  {session?.user ? (
                    <div className="sm:ml-11">
                      <CommunityAnswerForm
                        questionId={question.id}
                        parentId={answer.id}
                        label="Trả lời"
                      />
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="px-5 py-8 text-center">
              <p className="text-sm font-bold text-[#334155]">
                Chưa có phản hồi
              </p>
              <p className="mt-1 text-xs text-[#64748B]">
                Hãy chia sẻ cách giải quyết hoặc đặt câu hỏi để làm rõ vấn đề.
              </p>
            </div>
          )}
        </section>

        <section className="mt-5 rounded-xl border border-[#CBD5E1] bg-white p-4 sm:p-5">
          <h2 className="text-sm font-extrabold text-[#1E293B]">
            Viết câu trả lời
          </h2>
          {session?.user ? (
            <CommunityAnswerForm
              questionId={question.id}
              label="Trả lời câu hỏi"
            />
          ) : (
            <p className="mt-2 text-xs text-[#64748B]">
              Bạn cần{" "}
              <Link
                href="/"
                className="font-bold text-[#7C3AED] hover:underline"
              >
                đăng nhập
              </Link>{" "}
              để viết phản hồi hoặc báo cáo nội dung.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
