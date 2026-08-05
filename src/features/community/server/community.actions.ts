"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@/generated/prisma/client";
import { auth } from "@/auth";
import { canUseAuthorPermission } from "@/features/admin/server/author-permissions";
import {
  createCommunitySlug,
  isCommunityTopic,
  parseCommunityDocument,
} from "@/features/community/community-content";
import {
  moderateCommunityReport,
  publishCommunityAnswer,
  publishCommunityQuestion,
  reportCommunityContent,
} from "@/features/community/server/community.service";
import { canWriteCommunityContent } from "@/features/community/server/community-write-rate-limit";

export type CommunityFormState = { error?: string; success?: string };

async function requireCommunityUser() {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error("Bạn cần đăng nhập để sử dụng Cộng đồng.");
  return session.user;
}

function getTextField(
  value: FormDataEntryValue | null,
  label: string,
  maxLength: number,
) {
  if (typeof value !== "string") throw new Error(`${label} không hợp lệ.`);
  const text = value.trim();
  if (!text) throw new Error(`${label} không được để trống.`);
  if (text.length > maxLength)
    throw new Error(`${label} vượt quá giới hạn ký tự.`);
  return text;
}

export async function createCommunityQuestionAction(
  _: CommunityFormState,
  formData: FormData,
): Promise<CommunityFormState> {
  let slug = "";
  try {
    const user = await requireCommunityUser();
    if (!canWriteCommunityContent(user.id, "question"))
      throw new Error(
        "Bạn vừa đăng câu hỏi. Vui lòng chờ một phút trước khi đăng tiếp.",
      );
    const title = getTextField(formData.get("title"), "Tiêu đề", 220);
    const topic = getTextField(formData.get("topic"), "Chủ đề", 60);
    if (!isCommunityTopic(topic)) throw new Error("Chủ đề không hợp lệ.");
    const { document, text } = parseCommunityDocument(formData.get("content"));
    const question = await publishCommunityQuestion({
      slug: createCommunitySlug(title),
      title,
      topic,
      content: document as Prisma.InputJsonValue,
      contentText: text,
      isAnonymous: formData.get("anonymous") === "on",
      authorId: user.id,
    });
    slug = question.slug;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Không thể đăng câu hỏi.",
    };
  }

  revalidatePath("/community");
  redirect(`/community/${slug}`);
}

export async function createCommunityAnswerAction(
  _: CommunityFormState,
  formData: FormData,
): Promise<CommunityFormState> {
  try {
    const user = await requireCommunityUser();
    if (!canWriteCommunityContent(user.id, "answer"))
      throw new Error(
        "Vui lòng chờ vài giây trước khi đăng phản hồi tiếp theo.",
      );
    const questionId = getTextField(formData.get("questionId"), "Câu hỏi", 80);
    const parentId = formData.get("parentId");
    const { document, text } = parseCommunityDocument(formData.get("content"));
    const result = await publishCommunityAnswer({
      questionId,
      parentId: typeof parentId === "string" && parentId ? parentId : undefined,
      content: document as Prisma.InputJsonValue,
      contentText: text,
      isAnonymous: formData.get("anonymous") === "on",
      authorId: user.id,
    });
    revalidatePath(`/community/${result.question.slug}`);
    revalidatePath("/community");
    return { success: "Phản hồi của bạn đã được đăng." };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Không thể đăng phản hồi.",
    };
  }
}

export async function reportCommunityContentAction(
  _: CommunityFormState,
  formData: FormData,
): Promise<CommunityFormState> {
  try {
    const user = await requireCommunityUser();
    if (!canWriteCommunityContent(user.id, "report"))
      throw new Error("Vui lòng chờ trước khi gửi báo cáo khác.");
    const reason = getTextField(formData.get("reason"), "Lý do", 120);
    const detail = formData.get("detail");
    await reportCommunityContent({
      reporterId: user.id,
      questionId:
        typeof formData.get("questionId") === "string"
          ? String(formData.get("questionId"))
          : undefined,
      answerId:
        typeof formData.get("answerId") === "string"
          ? String(formData.get("answerId"))
          : undefined,
      reason,
      detail:
        typeof detail === "string" && detail.trim()
          ? detail.trim().slice(0, 500)
          : undefined,
    });
    return { success: "Cảm ơn bạn. Báo cáo đã được gửi tới quản trị viên." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Không thể gửi báo cáo.",
    };
  }
}

export async function moderateCommunityReportAction(formData: FormData) {
  const user = await requireCommunityUser();
  if (!(await canUseAuthorPermission(user, "moderateCommunity"))) throw new Error("Bạn không có quyền kiểm duyệt.");
  const reportId = getTextField(formData.get("reportId"), "Báo cáo", 80);
  const action = formData.get("action");
  if (action !== "review" && action !== "hide" && action !== "dismiss")
    throw new Error("Thao tác kiểm duyệt không hợp lệ.");
  await moderateCommunityReport({ reportId, resolverId: user.id, action });
  revalidatePath("/admin/community");
  revalidatePath("/community");
}
