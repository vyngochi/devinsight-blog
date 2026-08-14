"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createPostComment, togglePostLike } from "@/features/content/server/post-engagement.repository";

export type PostEngagementState = { error?: string; success?: string; liked?: boolean; count?: number };

function slugField(formData: FormData) {
  const slug = formData.get("slug");
  if (typeof slug !== "string" || !/^[a-z0-9-]{1,180}$/.test(slug)) throw new Error("Bài viết không hợp lệ.");
  return slug;
}

export async function togglePostLikeAction(_: PostEngagementState, formData: FormData): Promise<PostEngagementState> {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Bạn cần đăng nhập để thích bài viết.");
    const slug = slugField(formData);
    const result = await togglePostLike(slug, session.user.id);
    revalidatePath("/posts/" + slug);
    return result;
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Không thể cập nhật lượt thích." };
  }
}

export async function createPostCommentAction(_: PostEngagementState, formData: FormData): Promise<PostEngagementState> {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Bạn cần đăng nhập để bình luận.");
    const slug = slugField(formData);
    const value = formData.get("content");
    const content = typeof value === "string" ? value.trim() : "";
    if (!content || content.length > 1000) throw new Error("Bình luận phải có từ 1 đến 1.000 ký tự.");
    await createPostComment(slug, session.user.id, content);
    revalidatePath("/posts/" + slug);
    return { success: "Bình luận đã được đăng." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Không thể đăng bình luận." };
  }
}
