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
  publishedAt?: Date;
  authorId?: string;
  relatedSlugs: string[];
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
  view_count: true,
  like_count: true,
  featured: true,
  published_at: true,
  created_at: true,
  updated_at: true,
  categories: { select: { name: true } },
  post_tags: { select: { tags: { select: { name: true } } } },
} as const;

const publicPostSummarySelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  reading_time_min: true,
  cover_image: true,
  author_name: true,
  author_role: true,
  badge_color: true,
  view_count: true,
  like_count: true,
  featured: true,
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

export async function upsertDatabasePost(input: PostPersistenceInput, restrictedAuthorId?: string) {
  return prisma.$transaction(async (transaction) => {
    if (restrictedAuthorId) {
      const existing = await transaction.posts.findUnique({ where: { slug: input.slug }, select: { author_id: true } });
      if (existing && existing.author_id !== restrictedAuthorId)
        throw new Error("Bạn không có quyền ghi đè bài viết của tác giả khác.");
    }
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
    const publishedAt = input.status === "PUBLISHED" ? input.publishedAt : null;

    const post = await transaction.posts.upsert({
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
        published_at: input.status === "DRAFT" ? null : publishedAt,
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
        published_at: publishedAt ?? (input.status === "PUBLISHED" ? new Date() : null),
        category_id: category.id,
        ...(input.authorId ? { author_id: input.authorId } : {}),
        post_tags: { create: tags.map((tag) => ({ tag_id: tag.id })) },
      },
      select: { id: true, slug: true, status: true },
    });
    const related = await transaction.posts.findMany({
      where: { slug: { in: input.relatedSlugs }, id: { not: post.id } },
      select: { id: true, slug: true },
    });
    const relatedBySlug = new Map(related.map((item) => [item.slug, item.id]));
    await transaction.post_relations.deleteMany({ where: { source_post_id: post.id } });
    await transaction.post_relations.createMany({
      data: input.relatedSlugs.flatMap((slug, position) => {
        const relatedPostId = relatedBySlug.get(slug);
        return relatedPostId ? [{ source_post_id: post.id, related_post_id: relatedPostId, position }] : [];
      }),
    });
    return post;
  });
}

export async function updateDatabasePost(originalSlug: string, input: PostPersistenceInput, restrictedAuthorId?: string) {
  return prisma.$transaction(async (transaction) => {
    const existing = await transaction.posts.findFirst({
      where: {
        slug: originalSlug,
        ...(restrictedAuthorId ? { author_id: restrictedAuthorId } : {}),
        NOT: { content_mdx: { startsWith: "Content is managed in src/content/posts/" } },
      },
      select: { id: true, published_at: true },
    });
    if (!existing) throw new Error("Không tìm thấy bài viết có thể chỉnh sửa.");

    const category = await transaction.categories.upsert({
      where: { slug: input.categorySlug },
      update: { name: input.categoryName },
      create: { name: input.categoryName, slug: input.categorySlug, description: categoryDescription(input.categoryName) },
      select: { id: true },
    });
    const tags = await Promise.all(input.tags.map((tag) => transaction.tags.upsert({
      where: { slug: tagSlug(tag) },
      update: { name: tag },
      create: { name: tag, slug: tagSlug(tag) },
      select: { id: true },
    })));

    const post = await transaction.posts.update({
      where: { id: existing.id },
      data: {
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
        published_at: input.status === "PUBLISHED" ? input.publishedAt ?? existing.published_at ?? new Date() : null,
        category_id: category.id,
        post_tags: { deleteMany: {}, create: tags.map((tag) => ({ tag_id: tag.id })) },
      },
      select: { id: true, slug: true, status: true },
    });
    const related = await transaction.posts.findMany({
      where: { slug: { in: input.relatedSlugs }, id: { not: post.id } },
      select: { id: true, slug: true },
    });
    const relatedBySlug = new Map(related.map((item) => [item.slug, item.id]));
    await transaction.post_relations.deleteMany({ where: { source_post_id: post.id } });
    await transaction.post_relations.createMany({
      data: input.relatedSlugs.flatMap((slug, position) => {
        const relatedPostId = relatedBySlug.get(slug);
        return relatedPostId ? [{ source_post_id: post.id, related_post_id: relatedPostId, position }] : [];
      }),
    });
    return post;
  });
}

export async function findEditableDatabasePostBySlug(slug: string, kind: "article" | "news", restrictedAuthorId?: string) {
  return prisma.posts.findFirst({
    where: {
      slug,
      ...(restrictedAuthorId ? { author_id: restrictedAuthorId } : {}),
      ...(kind === "news"
        ? { post_tags: { some: { tags: { slug: "news" } } } }
        : { post_tags: { none: { tags: { slug: "news" } } } }),
    },
    select: {
      slug: true, title: true, excerpt: true, content_mdx: true, reading_time_min: true,
      cover_image: true, author_name: true, author_role: true, badge_color: true, status: true,
      published_at: true,
      categories: { select: { name: true } },
      post_tags: { select: { tags: { select: { name: true, slug: true } } } },
      related_posts: { select: { related_post: { select: { slug: true } } }, orderBy: { position: "asc" } },
    },
  });
}

export async function deleteEditableDatabasePostBySlug(slug: string, kind: "article" | "news", restrictedAuthorId?: string) {
  return prisma.posts.deleteMany({
    where: {
      slug,
      ...(restrictedAuthorId ? { author_id: restrictedAuthorId } : {}),
      ...(kind === "news"
        ? { post_tags: { some: { tags: { slug: "news" } } } }
        : { post_tags: { none: { tags: { slug: "news" } } } }),
    },
  });
}

export async function findPublishedDatabasePostBySlug(slug: string) {
  return prisma.posts.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      published_at: { lte: new Date() },
    },
    select: publicPostSelect,
  });
}

export async function findPublishedDatabasePosts() {
  return prisma.posts.findMany({
    where: {
      status: "PUBLISHED",
      published_at: { lte: new Date() },
    },
    select: publicPostSummarySelect,
    orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
    take: 100,
  });
}

export async function findAdminPosts(restrictedAuthorId?: string) {
  return prisma.posts.findMany({
    where: { post_tags: { none: { tags: { slug: "news" } } }, ...(restrictedAuthorId ? { author_id: restrictedAuthorId } : {}) },
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      content_mdx: true,
      updated_at: true,
      published_at: true,
      categories: { select: { name: true } },
    },
    orderBy: { updated_at: "desc" },
    take: 100,
  });
}

export async function findAdminNewsPosts(restrictedAuthorId?: string) {
  return prisma.posts.findMany({
    where: { post_tags: { some: { tags: { slug: "news" } } }, ...(restrictedAuthorId ? { author_id: restrictedAuthorId } : {}) },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      status: true,
      content_mdx: true,
      updated_at: true,
      published_at: true,
      cover_image: true,
    },
    orderBy: { updated_at: "desc" },
    take: 100,
  });
}

export async function findRelatedPostCandidates(excludeSlug?: string) {
  return prisma.posts.findMany({
    where: {
      ...(excludeSlug ? { slug: { not: excludeSlug } } : {}),
      post_tags: { none: { tags: { slug: "news" } } },
    },
    select: { slug: true, title: true, status: true },
    orderBy: { updated_at: "desc" },
    take: 200,
  });
}
