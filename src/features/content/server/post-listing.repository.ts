import "server-only";

import { prisma } from "@/server/database/prisma";

export async function findPublishedPostViewCounts(slugs: string[]) {
  if (slugs.length === 0) return new Map<string, number>();

  const posts = await prisma.posts.findMany({
    where: {
      slug: { in: slugs },
      status: "PUBLISHED",
    },
    select: {
      slug: true,
      view_count: true,
    },
  });

  return new Map(posts.map((post) => [post.slug, post.view_count]));
}
