import "server-only";

import { prisma } from "@/server/database/prisma";

type PostPersistenceInput = {
  slug: string;
  title: string;
  excerpt: string;
  contentMdx: string;
  categoryName: string;
  categorySlug: string;
  tags: string[];
  authorName: string;
  authorRole?: string;
  badgeColor: string;
  readingTimeInMinutes: number;
  coverImage?: string;
  status: "DRAFT" | "PUBLISHED";
};

const publicPostSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  content_mdx: true,
  reading_time_min: true,
  cover_image: true,
  author_name: true,
  author_role: true,
  badge_color: true,
  published_at: true,
  created_at: true,
  updated_at: true,
  categories: { select: { name: true } },
  post_tags: { select: { tags: { select: { name: true } } } },
} as const;

function categoryDescription(name: string) {
  return `Bài viết ${name}`;
}

function tagSlug(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi-VN")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export async function upsertDatabasePost(input: PostPersistenceInput) {
  return prisma.$transaction(async (transaction) => {
    const category = await transaction.categories.upsert({
      where: { slug: input.categorySlug },
      update: { name: input.categoryName },
      create: {
        name: input.categoryName,
        slug: input.categorySlug,
        description: categoryDescription(input.categoryName),
      },
      select: { id: true },
    });
    const tags = await Promise.all(
      input.tags.map((tag) =>
        transaction.tags.upsert({
          where: { slug: tagSlug(tag) },
          update: { name: tag },
          create: { name: tag, slug: tagSlug(tag) },
          select: { id: true },
        }),
      ),
    );
    const publishedAt = input.status === "PUBLISHED" ? new Date() : null;

    return transaction.posts.upsert({
      where: { slug: input.slug },
      update: {
        title: input.title,
        excerpt: input.excerpt,
        content_mdx: input.contentMdx,
        reading_time_min: input.readingTimeInMinutes,
        cover_image: input.coverImage,
        author_name: input.authorName,
        author_role: input.authorRole,
        badge_color: input.badgeColor,
        status: input.status,
        published_at: publishedAt,
        category_id: category.id,
        post_tags: {
          deleteMany: {},
          create: tags.map((tag) => ({ tag_id: tag.id })),
        },
      },
      create: {
        slug: input.slug,
        title: input.title,
        excerpt: input.excerpt,
        content_mdx: input.contentMdx,
        reading_time_min: input.readingTimeInMinutes,
        cover_image: input.coverImage,
        author_name: input.authorName,
        author_role: input.authorRole,
        badge_color: input.badgeColor,
        status: input.status,
        published_at: publishedAt,
        category_id: category.id,
        post_tags: { create: tags.map((tag) => ({ tag_id: tag.id })) },
      },
      select: { slug: true, status: true },
    });
  });
}

export async function findPublishedDatabasePostBySlug(slug: string) {
  return prisma.posts.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      NOT: { content_mdx: { startsWith: "Content is managed in src/content/posts/" } },
    },
    select: publicPostSelect,
  });
}

export async function findPublishedDatabasePosts() {
  return prisma.posts.findMany({
    where: {
      status: "PUBLISHED",
      NOT: { content_mdx: { startsWith: "Content is managed in src/content/posts/" } },
    },
    select: { ...publicPostSelect, view_count: true },
    orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
    take: 100,
  });
}

export async function findAdminPosts() {
  return prisma.posts.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      updated_at: true,
      published_at: true,
      categories: { select: { name: true } },
    },
    orderBy: { updated_at: "desc" },
    take: 100,
  });
}

export async function upsertPublishedPost(input: {
  slug: string;
  title: string;
  excerpt: string;
  categoryName: string;
  categorySlug: string;
  readingTimeInMinutes: number;
  publishedAt: Date;
}) {
  const category = await prisma.categories.upsert({
    where: { slug: input.categorySlug },
    update: { name: input.categoryName },
    create: { name: input.categoryName, slug: input.categorySlug, description: categoryDescription(input.categoryName) },
    select: { id: true },
  });
  return prisma.posts.upsert({
    where: { slug: input.slug },
    update: { title: input.title, excerpt: input.excerpt, reading_time_min: input.readingTimeInMinutes, category_id: category.id, status: "PUBLISHED", published_at: input.publishedAt },
    create: { slug: input.slug, title: input.title, excerpt: input.excerpt, content_mdx: `Content is managed in src/content/posts/${input.slug}.mdx`, reading_time_min: input.readingTimeInMinutes, category_id: category.id, status: "PUBLISHED", published_at: input.publishedAt },
  });
}
