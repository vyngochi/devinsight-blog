import "server-only";

import { getPostBySlug } from "@/features/content/post-registry";
import { upsertPublishedPost } from "@/features/content/server/post.repository";

const categorySlugs: Record<string, string> = {
  "Học tập": "hoc-tap",
  "Mẹo nhanh": "meo-nhanh",
  "Khám phá": "kham-pha",
  "Tài nguyên": "tai-nguyen",
  "Cộng đồng": "cong-dong",
};

function readingTimeInMinutes(readingTime: string) {
  return Number.parseInt(readingTime, 10) || 5;
}

export async function syncPostFromContent(slug: string) {
  const postModule = getPostBySlug(slug);
  if (!postModule) return null;

  const { metadata } = postModule;
  const categorySlug = categorySlugs[metadata.category];
  if (!categorySlug) {
    throw new Error(`Unsupported category: ${metadata.category}`);
  }

  return upsertPublishedPost({
    slug: metadata.slug,
    title: metadata.title,
    excerpt: metadata.excerpt,
    categoryName: metadata.category,
    categorySlug,
    readingTimeInMinutes: readingTimeInMinutes(metadata.readingTime),
    publishedAt: new Date(`${metadata.publishedAt}T00:00:00.000Z`),
  });
}
