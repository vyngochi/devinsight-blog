import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import {
  createCommunityAnswer,
  createCommunityQuestion,
  createCommunityReport,
  findCommunityReports,
  findDueCommunityDigests,
  findPublicQuestionBySlug,
  findPublicQuestions,
  markCommunityDigest,
  queueCommunityDigest,
  resolveCommunityReport,
} from "@/features/community/server/community.repository";

export function getCommunityQuestions(input: { query?: string; topic?: string }) {
  return findPublicQuestions(input);
}

export function getCommunityQuestion(slug: string) {
  return findPublicQuestionBySlug(slug);
}

export function publishCommunityQuestion(input: {
  slug: string;
  title: string;
  topic: string;
  content: Prisma.InputJsonValue;
  contentText: string;
  isAnonymous: boolean;
  authorId: string;
}) {
  return createCommunityQuestion(input);
}

export async function publishCommunityAnswer(input: {
  questionId: string;
  parentId?: string;
  content: Prisma.InputJsonValue;
  contentText: string;
  isAnonymous: boolean;
  authorId: string;
}) {
  const result = await createCommunityAnswer(input);
  if (result.question.author_id !== input.authorId) {
    await queueCommunityDigest({ questionId: input.questionId, recipientId: result.question.author_id });
  }
  return result;
}

export function reportCommunityContent(input: { reporterId: string; questionId?: string; answerId?: string; reason: string; detail?: string }) {
  if (Boolean(input.questionId) === Boolean(input.answerId)) throw new Error("Hãy chọn đúng một nội dung để báo cáo.");
  return createCommunityReport(input);
}

export function getCommunityReports() {
  return findCommunityReports();
}

export function moderateCommunityReport(input: { reportId: string; resolverId: string; action: "review" | "hide" | "dismiss" }) {
  return resolveCommunityReport(input);
}

export async function deliverCommunityDigests(send: (input: { email: string; name: string | null; title: string; slug: string; answerCount: number }) => Promise<void>) {
  const digests = await findDueCommunityDigests(new Date());
  let sent = 0;
  let failed = 0;
  for (const digest of digests) {
    try {
      await send({
        email: digest.recipient.email,
        name: digest.recipient.name,
        title: digest.question.title,
        slug: digest.question.slug,
        answerCount: digest.answer_count,
      });
      await markCommunityDigest({ id: digest.id, status: "SENT" });
      sent += 1;
    } catch {
      await markCommunityDigest({ id: digest.id, status: "FAILED" });
      failed += 1;
    }
  }
  return { processed: digests.length, sent, failed };
}
