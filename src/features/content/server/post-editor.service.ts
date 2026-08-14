import "server-only";

import { cache } from "react";

import type { PostSummary } from "@/types/blog";
import { EDITOR_BADGE_COLORS, EDITOR_POST_CATEGORIES, editorCategorySlugs } from "@/features/content/post-editor-policy";
import {
  deleteEditableDatabasePostBySlug,
  findAdminPosts,
  findAdminNewsPosts,
  findEditableDatabasePostBySlug,
  findPublishedDatabasePostBySlug,
  findPublishedDatabasePosts,
  findRelatedPostCandidates,
  upsertDatabasePost,
  updateDatabasePost,
} from "@/features/content/server/post.repository";
import type { EditorPostInitialData, NewsEditorInitialData } from "@/features/content/editor-types";


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

function localDateTimeValue(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function parseTags(value: string) {
  const tags = [...new Set(value.split(",").map((tag) => tag.trim()).filter(Boolean))];
  if (tags.length > 8 || tags.some((tag) => tag.length > 50))
    throw new Error("Chỉ dùng tối đa 8 thẻ, mỗi thẻ không quá 50 ký tự.");
  return tags;
}

function normalizeCodeFenceLanguages(value: string) {
  let insideCodeFence = false;
  return value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => {
      const fence = line.match(/^```([\w-]*)[ \t]*$/);
      if (!fence) return line;
      if (insideCodeFence) {
        insideCodeFence = false;
        return "```";
      }
      insideCodeFence = true;
      return `\`\`\`${fence[1] || "text"}`;
    })
    .join("\n");
}

function validateControlledMdx(value: string) {
  const content = cleanText(value, "Nội dung", 80_000);
  const normalizedContent = normalizeCodeFenceLanguages(content);
  const withoutCodeFences = normalizedContent.replace(/```[\s\S]*?```/g, "");
  if (/^\s*(import|export)\s/m.test(withoutCodeFences) || /\{[^}]*\}/.test(withoutCodeFences))
    throw new Error("Nội dung không được chứa import, export hoặc biểu thức JavaScript.");
  const withoutSupportedComponents = withoutCodeFences.replace(
    /<\/?(?:Callout(?:\s+type="(?:tip|note|info|warning|success|danger)"(?:\s+tone="(?:violet|blue|green|yellow|red)")?(?:\s+title="[^"]*")?)?|ImageGrid(?:\s+layout="(?:two|three|featured)")?|Figure(?:\s+(?:src|alt|caption|sourceName|sourceUrl)="[^"]*")*\s*\/?)\s*>/g,
    "",
  );
  if (/<\/?[A-Za-z]/.test(withoutSupportedComponents))
    throw new Error("Nội dung chứa MDX component không được hỗ trợ.");
  return normalizedContent;
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
    featured: post.featured,
  };
}

export async function saveDatabasePost(input: {
  originalSlug?: string;
  authorId?: string;
  restrictedAuthorId?: string;
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
  scheduledAt?: string;
  relatedSlugs: string;
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

  let scheduledAt: Date | undefined;
  if (input.intent === "schedule") {
    scheduledAt = new Date(input.scheduledAt ?? "");
    if (Number.isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) throw new Error("Thời điểm lên lịch phải ở trong tương lai.");
  }
  const persistenceInput = {
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
    status: ["publish", "save-published", "schedule"].includes(input.intent) ? "PUBLISHED" as const : "DRAFT" as const,
    publishedAt: input.intent === "schedule" ? scheduledAt : input.intent === "publish" ? new Date() : undefined,
    authorId: input.authorId,
    relatedSlugs: [...new Set(input.relatedSlugs.split(",").map((slug) => normalizeSlug(slug)).filter(Boolean))].slice(0, 12),
  };
  return input.originalSlug
    ? updateDatabasePost(input.originalSlug, persistenceInput, input.restrictedAuthorId)
    : upsertDatabasePost(persistenceInput, input.restrictedAuthorId);
}

function formatNewsDate(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) throw new Error("Thời điểm tin không hợp lệ.");
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "full", timeStyle: "short" }).format(date);
}

function buildNewsContent(input: {
  content: string;
  sources: Array<{ name: string; url: string }>;
  reportedAt: string;
  existingReportedAtLabel?: string;
  requireSource: boolean;
}) {
  if (input.sources.length > 5) throw new Error("Mỗi tin chỉ hỗ trợ tối đa 5 nguồn.");
  const sources = input.sources.map((source) => ({ name: source.name.trim(), url: source.url.trim() }));
  if (input.requireSource && (!sources.length || sources.some((source) => !source.name || !source.url)))
    throw new Error("Tin tức cần có đầy đủ tên nguồn và link nguồn trước khi xuất bản.");
  for (const sourceItem of sources) {
    if (sourceItem.name.length > 120) throw new Error("Tên nguồn không được quá 120 ký tự.");
    if (!sourceItem.name && !sourceItem.url) continue;
    if (!sourceItem.name || !sourceItem.url) throw new Error("Mỗi nguồn cần có đầy đủ tên và link.");
    let source: URL;
    try {
      source = new URL(sourceItem.url);
    } catch {
      throw new Error("Link nguồn không hợp lệ.");
    }
    if (!/^https?:$/.test(source.protocol)) throw new Error("Link nguồn phải dùng http hoặc https.");
  }

  const reportedAt = formatNewsDate(input.reportedAt) ?? input.existingReportedAtLabel?.trim();
  const metadata = [
    ...sources.filter((source) => source.name && source.url).map((source, index) => `> Nguồn ${index + 1}: [${source.name.replace(/[\[\]]/g, "")}](${source.url})`),
    reportedAt ? `> Thời điểm tin: ${reportedAt}` : "",
  ].filter(Boolean);
  return metadata.length ? `${input.content.trim()}\n\n${metadata.join("\n")}` : input.content;
}

export async function saveDatabaseNews(input: {
  originalSlug?: string;
  authorId?: string;
  restrictedAuthorId?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string;
  authorName: string;
  coverImage: string;
  sources: Array<{ name: string; url: string }>;
  reportedAt: string;
  existingReportedAtLabel?: string;
  intent: string;
  scheduledAt?: string;
}) {
  const additionalTags = parseTags(input.tags);
  if (additionalTags.length > 5) throw new Error("Tin tức chỉ dùng tối đa 5 tags bổ sung.");
  const tags = [...new Set(["news", "tin tức", "công nghệ", ...additionalTags])].join(",");
  return saveDatabasePost({
    originalSlug: input.originalSlug,
    authorId: input.authorId,
    restrictedAuthorId: input.restrictedAuthorId,
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content: buildNewsContent({ ...input, requireSource: input.intent === "publish" || input.intent === "schedule" }),
    category: "Khám phá",
    tags,
    authorName: input.authorName,
    authorRole: "Ban biên tập DevInsight",
    readingTime: "3",
    coverImage: input.coverImage,
    badgeColor: "pink",
    intent: input.intent,
    scheduledAt: input.scheduledAt,
    relatedSlugs: "",
  });
}

function splitNewsMetadata(content: string) {
  const lines = content.trimEnd().split("\n");
  let reportedAtLabel = "";
  const sources: Array<{ name: string; url: string }> = [];
  const reportedAt = lines.at(-1)?.match(/^> Thời điểm tin:\s*(.+)$/);
  if (reportedAt) {
    reportedAtLabel = reportedAt[1];
    lines.pop();
  }
  while (true) {
    const source = lines.at(-1)?.match(/^> Nguồn(?: \d+)?:\s*\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (!source) break;
    sources.unshift({ name: source[1], url: source[2] });
    lines.pop();
  }
  return { content: lines.join("\n").trimEnd(), sources, reportedAtLabel };
}

export async function getAdminEditablePost(slug: string, kind: "article" | "news", restrictedAuthorId?: string): Promise<EditorPostInitialData | NewsEditorInitialData | null> {
  const post = await findEditableDatabasePostBySlug(slug, kind, restrictedAuthorId);
  if (!post) return null;
  const tags = post.post_tags
    .map((item) => item.tags)
    .filter((tag) => !["news", "tin-tuc", "cong-nghe"].includes(tag.slug))
    .map((tag) => tag.name)
    .join(", ");
  const base: EditorPostInitialData = {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content_mdx,
    category: post.categories.name,
    tags,
    authorName: post.author_name || "DevInsight",
    authorRole: post.author_role || "",
    readingTime: post.reading_time_min,
    coverImage: post.cover_image || "",
    badgeColor: post.badge_color,
    status: post.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
    relatedSlugs: post.related_posts.map((item) => item.related_post.slug),
    ...(post.published_at && post.published_at > new Date() ? { scheduledAt: localDateTimeValue(post.published_at) } : {}),
  };
  if (kind === "article") return base;
  const metadata = splitNewsMetadata(post.content_mdx);
  return {
    ...base,
    content: metadata.content,
    sources: metadata.sources,
    reportedAtLabel: metadata.reportedAtLabel,
  };
}

export async function deleteAdminEditablePost(slug: string, kind: "article" | "news", restrictedAuthorId?: string) {
  const result = await deleteEditableDatabasePostBySlug(slug, kind, restrictedAuthorId);
  if (!result.count) throw new Error("Không tìm thấy bài viết có thể xóa.");
}

export async function getDatabasePostSummaries() {
  return (await findPublishedDatabasePosts()).map(asPostSummary);
}

export const getDatabasePostBySlug = cache(async (slug: string) => {
  const post = await findPublishedDatabasePostBySlug(slug);
  if (!post) return null;
  return {
    ...asPostSummary(post),
    content: post.content_mdx,
  };
});

export const getAdminPostList = findAdminPosts;
export const getAdminNewsList = findAdminNewsPosts;
export const getRelatedPostCandidates = findRelatedPostCandidates;
