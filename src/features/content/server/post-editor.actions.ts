"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { deleteAdminEditablePost, saveDatabaseNews, saveDatabasePost } from "@/features/content/server/post-editor.service";
import { canUseAuthorPermission } from "@/features/admin/server/author-permissions";

export type PostEditorState = { error?: string; success?: string; slug?: string; status?: "DRAFT" | "PUBLISHED" };

function field(formData: FormData, name: string) {
  return typeof formData.get(name) === "string" ? String(formData.get(name)) : "";
}

function newsSources(formData: FormData) {
  try {
    const value = JSON.parse(field(formData, "sources")) as unknown;
    if (!Array.isArray(value)) return [];
    return value.map((source) => ({
      name: typeof source?.name === "string" ? source.name : "",
      url: typeof source?.url === "string" ? source.url : "",
    }));
  } catch {
    return [];
  }
}

export async function savePostAction(_: PostEditorState, formData: FormData): Promise<PostEditorState> {
  try {
    const session = await auth();
    if (!session?.user || !(await canUseAuthorPermission(session.user, "writePosts"))) throw new Error("Bạn không có quyền viết bài.");
    const originalSlug = field(formData, "originalSlug");
    const post = await saveDatabasePost({
      originalSlug: originalSlug || undefined,
      authorId: session.user.id,
      restrictedAuthorId: session.user.role === "AUTHOR" ? session.user.id : undefined,
      title: field(formData, "title"), slug: field(formData, "slug"), excerpt: field(formData, "excerpt"), content: field(formData, "content"), category: field(formData, "category"), tags: field(formData, "tags"), authorName: field(formData, "authorName"), authorRole: field(formData, "authorRole"), readingTime: field(formData, "readingTime"), coverImage: field(formData, "coverImage"), badgeColor: field(formData, "badgeColor"), intent: field(formData, "intent"),
    });
    revalidatePath("/"); revalidatePath("/posts"); revalidatePath(`/posts/${post.slug}`); if (originalSlug && originalSlug !== post.slug) revalidatePath(`/posts/${originalSlug}`); revalidatePath("/admin/posts");
    return { success: post.status === "PUBLISHED" ? "Bài viết đã được xuất bản." : "Bản nháp đã được lưu.", slug: post.slug, status: post.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT" };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Không thể lưu bài viết." };
  }
}

export async function saveNewsAction(_: PostEditorState, formData: FormData): Promise<PostEditorState> {
  try {
    const session = await auth();
    if (!session?.user || !(await canUseAuthorPermission(session.user, "writeNews"))) throw new Error("Bạn không có quyền viết tin tức.");
    const originalSlug = field(formData, "originalSlug");
    const post = await saveDatabaseNews({
      originalSlug: originalSlug || undefined,
      authorId: session.user.id,
      restrictedAuthorId: session.user.role === "AUTHOR" ? session.user.id : undefined,
      title: field(formData, "title"),
      slug: field(formData, "slug"),
      excerpt: field(formData, "excerpt"),
      content: field(formData, "content"),
      tags: field(formData, "tags"),
      authorName: field(formData, "authorName"),
      coverImage: field(formData, "coverImage"),
      sources: newsSources(formData),
      reportedAt: field(formData, "reportedAt"),
      existingReportedAtLabel: field(formData, "existingReportedAtLabel") || undefined,
      intent: field(formData, "intent"),
    });
    revalidatePath("/");
    revalidatePath("/posts");
    revalidatePath(`/posts/${post.slug}`);
    if (originalSlug && originalSlug !== post.slug) revalidatePath(`/posts/${originalSlug}`);
    revalidatePath("/admin/posts");
    revalidatePath("/admin/news");
    return {
      success: post.status === "PUBLISHED" ? "Tin tức đã được xuất bản." : "Bản nháp tin tức đã được lưu.",
      slug: post.slug,
      status: post.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Không thể lưu tin tức." };
  }
}

export async function deletePostAction(_: PostEditorState, formData: FormData): Promise<PostEditorState> {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Bạn không có quyền xóa nội dung.");
    const slug = field(formData, "slug");
    const kind = field(formData, "kind");
    if (!slug || (kind !== "article" && kind !== "news")) throw new Error("Yêu cầu xóa không hợp lệ.");
    const permission = kind === "article" ? "writePosts" : "writeNews";
    if (!(await canUseAuthorPermission(session.user, permission))) throw new Error("Bạn không có quyền xóa nội dung này.");
    await deleteAdminEditablePost(slug, kind, session.user.role === "AUTHOR" ? session.user.id : undefined);
    revalidatePath("/");
    revalidatePath("/posts");
    revalidatePath(`/posts/${slug}`);
    revalidatePath("/admin/posts");
    revalidatePath("/admin/news");
    return { success: kind === "news" ? "Đã xóa tin tức." : "Đã xóa bài viết." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Không thể xóa nội dung." };
  }
}
