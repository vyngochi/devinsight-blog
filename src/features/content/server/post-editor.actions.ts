"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { saveDatabasePost } from "@/features/content/server/post-editor.service";

export type PostEditorState = { error?: string; success?: string; slug?: string };

function field(formData: FormData, name: string) {
  return typeof formData.get(name) === "string" ? String(formData.get(name)) : "";
}

export async function savePostAction(_: PostEditorState, formData: FormData): Promise<PostEditorState> {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") throw new Error("Bạn không có quyền viết bài.");
    const post = await saveDatabasePost({
      title: field(formData, "title"), slug: field(formData, "slug"), excerpt: field(formData, "excerpt"), content: field(formData, "content"), category: field(formData, "category"), tags: field(formData, "tags"), authorName: field(formData, "authorName"), authorRole: field(formData, "authorRole"), readingTime: field(formData, "readingTime"), coverImage: field(formData, "coverImage"), badgeColor: field(formData, "badgeColor"), intent: field(formData, "intent"),
    });
    revalidatePath("/"); revalidatePath("/posts"); revalidatePath(`/posts/${post.slug}`); revalidatePath("/admin/posts");
    return { success: post.status === "PUBLISHED" ? "Bài viết đã được xuất bản." : "Bản nháp đã được lưu.", slug: post.slug };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Không thể lưu bài viết." };
  }
}
