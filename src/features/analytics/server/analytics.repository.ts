import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/database/prisma";

export async function createUniquePostView(
  postId: string,
  visitorHash: string,
  viewedOn: Date,
) {
  try {
    await prisma.$transaction(
      async (tx) => {
        await tx.post_views.create({
          data: {
            post_id: postId,
            visitor_hash: visitorHash,
            viewed_on: viewedOn,
          },
        });
        await tx.posts.update({
          where: { id: postId },
          data: { view_count: { increment: 1 } },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    return true;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      return false;
    throw error;
  }
}

export async function fetchDashboardMetrics(
  startOfToday: Date,
  startOfSevenDays: Date,
  startOfThirtyDays: Date,
) {
  const [
    publishedPosts,
    totalReaders,
    readersToday,
    readersSevenDays,
    readersThirtyDays,
    totalComments,
    topPosts,
    dailyReaders,
  ] = await Promise.all([
    prisma.posts.count({ where: { status: "PUBLISHED" } }),
    prisma.post_views.count(),
    prisma.post_views.count({ where: { viewed_on: { gte: startOfToday } } }),
    prisma.post_views.count({
      where: { viewed_on: { gte: startOfSevenDays } },
    }),
    prisma.post_views.count({
      where: { viewed_on: { gte: startOfThirtyDays } },
    }),
    prisma.comments.count(),
    prisma.posts.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, title: true, view_count: true },
      orderBy: { view_count: "desc" },
      take: 5,
    }),
    prisma.post_views.groupBy({
      by: ["viewed_on"],
      where: { viewed_on: { gte: startOfSevenDays } },
      _count: { _all: true },
      orderBy: { viewed_on: "asc" },
    }),
  ]);

  return {
    publishedPosts,
    totalReaders,
    readersToday,
    readersSevenDays,
    readersThirtyDays,
    totalComments,
    topPosts,
    dailyReaders,
  };
}
