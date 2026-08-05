import "server-only";

import { cache } from "react";

import type { PostSummary } from "@/types/blog";
import { EDITOR_BADGE_COLORS, EDITOR_POST_CATEGORIES, editorCategorySlugs } from "@/features/content/post-editor-policy";
import {
  findAdminPosts,
  findPublishedDatabasePostBySlug,
  findPublishedDatabasePosts,
  upsertDatabasePost,
} from "@/features/content/server/post.repository";


function cleanText(value: string, label: string, maxLength: number) {
  const text = value.trim();
  if (!text || text.length > maxLength) throw new Error(`${label} phải có từ 1 đến ${maxLength} ký tự.`);
  return text;
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 180);
}

function parseTags(value: string) {
  const tags = [...new Set(value.split(",").map((tag) => tag.trim()).filter(Boolean))];
  if (tags.length > 8 || tags.some((tag) => tag.length > 50))
    throw new Error("Chỉ dùng tối đa 8 thẻ, mỗi thẻ không quá 50 ký tự.");
  return tags;
}

function validateControlledMdx(value: string) {
  const content = cleanText(value, "Nội dung", 80_000);
  const withoutCodeFences = content.replace(/```[\s\S]*?```/g, "");
  if (/^\s*(import|export)\s/m.test(withoutCodeFences) || /\{[^}]*\}/.test(withoutCodeFences))
    throw new Error("Nội dung không được chứa import, export hoặc biểu thức JavaScript.");
  const withoutCallouts = withoutCodeFences.replace(/<\/?Callout(?:\s+type="(?:tip|note)")?\s*>/g, "");
  if (/<\/?[A-Za-z]/.test(withoutCallouts))
    throw new Error("Chỉ hỗ trợ MDX component <Callout> và <Callout type=\"note\">.");
  return content;
}

function asPostSummary(post: Awaited<ReturnType<typeof findPublishedDatabasePosts>>[number]): PostSummary & { readerCount: number } {
  const date = post.published_at ?? post.created_at;
  const category = post.categories.name as PostSummary["category"];
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category,
    badgeColor: (EDITOR_BADGE_COLORS.includes(post.badge_color as (typeof EDITOR_BADGE_COLORS)[number]) ? post.badge_color : "violet") as PostSummary["badgeColor"],
    publishedAt: date.toISOString().slice(0, 10),
    updatedAt: post.updated_at.toISOString().slice(0, 10),
    readingTime: `${post.reading_time_min} phút`,
    tags: post.post_tags.map((item) => item.tags.name),
    author: { name: post.author_name || "DevInsight", ...(post.author_role ? { role: post.author_role } : {}) },
    ...(post.cover_image ? { coverImage: post.cover_image } : {}),
    dateLabel: new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date),
    readerCount: post.view_count,
  };
}

export async function saveDatabasePost(input: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  authorName: string;
  authorRole: string;
  readingTime: string;
  coverImage: string;
  badgeColor: string;
  intent: string;
}) {
  const category = EDITOR_POST_CATEGORIES.find((item) => item === input.category);
  if (!category) throw new Error("Chuyên mục không hợp lệ.");
  const badgeColor = EDITOR_BADGE_COLORS.find((item) => item === input.badgeColor) ?? "violet";
  const readingTime = Number(input.readingTime);
  if (!Number.isInteger(readingTime) || readingTime < 1 || readingTime > 180)
    throw new Error("Thời gian đọc phải từ 1 đến 180 phút.");
  const slug = normalizeSlug(input.slug || input.title);
  if (!slug) throw new Error("Slug không hợp lệ.");
  const coverImage = input.coverImage.trim();
  if (coverImage && !/^https?:\/\//.test(coverImage))
    throw new Error("Ảnh cover phải là URL http hoặc https.");

  return upsertDatabasePost({
    slug,
    title: cleanText(input.title, "Tiêu đề", 255),
    excerpt: cleanText(input.excerpt, "Mô tả ngắn", 500),
    contentMdx: validateControlledMdx(input.content),
    categoryName: category,
    categorySlug: editorCategorySlugs[category],
    tags: parseTags(input.tags),
    authorName: cleanText(input.authorName, "Tác giả", 120),
    authorRole: input.authorRole.trim().slice(0, 160) || undefined,
    badgeColor,
    readingTimeInMinutes: readingTime,
    coverImage: coverImage || undefined,
    status: input.intent === "publish" ? "PUBLISHED" : "DRAFT",
  });
}

export async function getDatabasePostSummaries() {
  return (await findPublishedDatabasePosts()).map(asPostSummary);
}

export const getDatabasePostBySlug = cache(async (slug: string) => {
  const post = await findPublishedDatabasePostBySlug(slug);
  if (!post) return null;
  return {
    ...asPostSummary({ ...post, view_count: 0 }),
    content: post.content_mdx,
  };
});

export const getAdminPostList = findAdminPosts;
