import "server-only";

import { prisma } from "@/server/database/prisma";

type PublishedPostInput = {
  slug: string;
  title: string;
  excerpt: string;
  categoryName: string;
  categorySlug: string;
  readingTimeInMinutes: number;
  publishedAt: Date;
};

export async function upsertPublishedPost(input: PublishedPostInput) {
  const category = await prisma.categories.upsert({
    where: { slug: input.categorySlug },
    update: { name: input.categoryName },
    create: {
      name: input.categoryName,
      slug: input.categorySlug,
      description: `Bài viết ${input.categoryName}`,
    },
  });

  return prisma.posts.upsert({
    where: { slug: input.slug },
    update: {
      title: input.title,
      excerpt: input.excerpt,
      reading_time_min: input.readingTimeInMinutes,
      category_id: category.id,
      status: "PUBLISHED",
      published_at: input.publishedAt,
    },
    create: {
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content_mdx: `Content is managed in src/content/posts/${input.slug}.mdx`,
      reading_time_min: input.readingTimeInMinutes,
      category_id: category.id,
      status: "PUBLISHED",
      published_at: input.publishedAt,
    },
  });
}
