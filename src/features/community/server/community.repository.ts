import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/database/prisma";

const publicAuthor = { id: true, name: true, image: true } as const;
const publicAnswer = {
  id: true,
  question_id: true,
  parent_id: true,
  content_json: true,
  content_text: true,
  is_anonymous: true,
  created_at: true,
  author: { select: publicAuthor },
} as const;

export async function findPublicQuestions(input: {
  query?: string;
  topic?: string;
}) {
  const query = input.query?.trim();
  return prisma.community_questions.findMany({
    where: {
      status: "PUBLISHED",
      ...(input.topic ? { topic: input.topic } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { content_text: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      slug: true,
      title: true,
      topic: true,
      content_text: true,
      is_anonymous: true,
      created_at: true,
      author: { select: publicAuthor },
      _count: { select: { answers: { where: { status: "PUBLISHED" } } } },
    },
    orderBy: { created_at: "desc" },
    take: 50,
  });
}

export async function findPublicQuestionBySlug(slug: string) {
  return prisma.community_questions.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      slug: true,
      title: true,
      topic: true,
      content_json: true,
      is_anonymous: true,
      created_at: true,
      author: { select: publicAuthor },
      answers: {
        where: { status: "PUBLISHED", parent_id: null },
        select: {
          ...publicAnswer,
          replies: {
            where: { status: "PUBLISHED" },
            select: publicAnswer,
            orderBy: { created_at: "asc" },
          },
        },
        orderBy: { created_at: "asc" },
      },
    },
  });
}

export async function createCommunityQuestion(input: {
  slug: string;
  title: string;
  topic: string;
  content: Prisma.InputJsonValue;
  contentText: string;
  isAnonymous: boolean;
  authorId: string;
}) {
  return prisma.community_questions.create({
    data: {
      slug: input.slug,
      title: input.title,
      topic: input.topic,
      content_json: input.content,
      content_text: input.contentText,
      is_anonymous: input.isAnonymous,
      author_id: input.authorId,
    },
    select: { slug: true },
  });
}

export async function createCommunityAnswer(input: {
  questionId: string;
  parentId?: string;
  content: Prisma.InputJsonValue;
  contentText: string;
  isAnonymous: boolean;
  authorId: string;
}) {
  return prisma.$transaction(async (transaction) => {
    const question = await transaction.community_questions.findFirst({
      where: { id: input.questionId, status: "PUBLISHED" },
      select: { id: true, author_id: true, slug: true, title: true },
    });
    if (!question) throw new Error("Câu hỏi không còn hiển thị.");

    if (input.parentId) {
      const parent = await transaction.community_answers.findFirst({
        where: {
          id: input.parentId,
          question_id: input.questionId,
          status: "PUBLISHED",
          parent_id: null,
        },
        select: { id: true },
      });
      if (!parent) throw new Error("Phản hồi gốc không hợp lệ.");
    }

    const answer = await transaction.community_answers.create({
      data: {
        question_id: input.questionId,
        parent_id: input.parentId,
        content_json: input.content,
        content_text: input.contentText,
        is_anonymous: input.isAnonymous,
        author_id: input.authorId,
      },
      select: { id: true },
    });
    return { answer, question };
  });
}

export async function queueCommunityDigest(input: {
  questionId: string;
  recipientId: string;
}) {
  const sendAfter = new Date(Date.now() + 30 * 60 * 1000);
  return prisma.community_notification_digests.upsert({
    where: {
      question_id_recipient_id: {
        question_id: input.questionId,
        recipient_id: input.recipientId,
      },
    },
    create: {
      question_id: input.questionId,
      recipient_id: input.recipientId,
      answer_count: 1,
      send_after: sendAfter,
    },
    update: {
      answer_count: { increment: 1 },
      send_after: sendAfter,
      status: "PENDING",
      sent_at: null,
    },
  });
}

export async function findDueCommunityDigests(now: Date) {
  return prisma.community_notification_digests.findMany({
    where: { status: "PENDING", send_after: { lte: now } },
    select: {
      id: true,
      answer_count: true,
      question: { select: { title: true, slug: true } },
      recipient: { select: { email: true, name: true } },
    },
    orderBy: { send_after: "asc" },
    take: 50,
  });
}

export async function markCommunityDigest(input: {
  id: string;
  status: "SENT" | "FAILED";
}) {
  return prisma.community_notification_digests.update({
    where: { id: input.id },
    data: {
      status: input.status,
      sent_at: input.status === "SENT" ? new Date() : null,
    },
  });
}

export async function createCommunityReport(input: {
  reporterId: string;
  questionId?: string;
  answerId?: string;
  reason: string;
  detail?: string;
}) {
  const existing = await prisma.community_reports.findFirst({
    where: {
      reporter_id: input.reporterId,
      ...(input.questionId
        ? { question_id: input.questionId }
        : { answer_id: input.answerId }),
    },
    select: { id: true },
  });
  if (existing) throw new Error("Bạn đã báo cáo nội dung này.");

  return prisma.community_reports.create({
    data: {
      reporter_id: input.reporterId,
      question_id: input.questionId,
      answer_id: input.answerId,
      reason: input.reason,
      detail: input.detail,
    },
  });
}

export async function findCommunityReports() {
  return prisma.community_reports.findMany({
    where: { status: "OPEN" },
    select: {
      id: true,
      reason: true,
      detail: true,
      created_at: true,
      question: {
        select: {
          id: true,
          slug: true,
          title: true,
          status: true,
          author: { select: { name: true, email: true } },
        },
      },
      answer: {
        select: {
          id: true,
          content_text: true,
          status: true,
          question: { select: { slug: true, title: true } },
          author: { select: { name: true, email: true } },
        },
      },
      reporter: { select: { name: true, email: true } },
    },
    orderBy: { created_at: "asc" },
    take: 100,
  });
}

export async function resolveCommunityReport(input: {
  reportId: string;
  resolverId: string;
  action: "review" | "hide" | "dismiss";
}) {
  return prisma.$transaction(async (transaction) => {
    const report = await transaction.community_reports.findUnique({
      where: { id: input.reportId },
      select: { id: true, question_id: true, answer_id: true },
    });
    if (!report) throw new Error("Không tìm thấy báo cáo.");

    if (input.action === "hide") {
      if (report.question_id)
        await transaction.community_questions.update({
          where: { id: report.question_id },
          data: { status: "HIDDEN" },
        });
      if (report.answer_id)
        await transaction.community_answers.update({
          where: { id: report.answer_id },
          data: { status: "HIDDEN" },
        });
    }

    await transaction.community_reports.update({
      where: { id: report.id },
      data: {
        status: input.action === "dismiss" ? "DISMISSED" : "REVIEWED",
        resolved_by_id: input.resolverId,
        resolved_at: new Date(),
      },
    });
  });
}
