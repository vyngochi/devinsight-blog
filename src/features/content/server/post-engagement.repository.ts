import "server-only";

import { prisma } from "@/server/database/prisma";

const publishedPostWhere = (slug: string) => ({
  slug,
  status: "PUBLISHED" as const,
  published_at: { lte: new Date() },
});

export async function findPostEngagement(slug: string, userId?: string) {
  return prisma.posts.findFirst({
    where: publishedPostWhere(slug),
    select: {
      id: true,
      like_count: true,
      post_likes: userId ? { where: { user_id: userId }, select: { id: true }, take: 1 } : false,
      comments: {
        select: {
          id: true,
          content: true,
          parent_id: true,
          created_at: true,
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { created_at: "asc" },
        take: 200,
      },
      related_posts: {
        where: {
          related_post: {
            status: "PUBLISHED",
            published_at: { lte: new Date() },
          },
        },
        select: {
          related_post: {
            select: {
              slug: true,
              title: true,
              excerpt: true,
              cover_image: true,
              reading_time_min: true,
              categories: { select: { name: true } },
            },
          },
        },
        orderBy: { position: "asc" },
        take: 12,
      },
    },
  });
}

export async function togglePostLike(slug: string, userId: string) {
  return prisma.$transaction(async (transaction) => {
    const post = await transaction.posts.findFirst({ where: publishedPostWhere(slug), select: { id: true } });
    if (!post) throw new Error("Bài viết không còn hiển thị.");
    const existing = await transaction.post_likes.findUnique({
      where: { post_id_user_id: { post_id: post.id, user_id: userId } },
      select: { id: true },
    });
    if (existing) await transaction.post_likes.delete({ where: { id: existing.id } });
    else await transaction.post_likes.create({ data: { post_id: post.id, user_id: userId } });
    const count = await transaction.post_likes.count({ where: { post_id: post.id } });
    await transaction.posts.update({ where: { id: post.id }, data: { like_count: count } });
    return { liked: !existing, count };
  });
}

export async function createPostComment(slug: string, userId: string, content: string) {
  return prisma.$transaction(async (transaction) => {
    const post = await transaction.posts.findFirst({ where: publishedPostWhere(slug), select: { id: true } });
    if (!post) throw new Error("Bài viết không còn hiển thị.");
    return transaction.comments.create({
      data: { post_id: post.id, user_id: userId, content },
      select: { id: true },
    });
  });
}
