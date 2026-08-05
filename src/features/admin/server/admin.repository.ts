import "server-only";

import type { user_role } from "@/generated/prisma/client";
import { prisma } from "@/server/database/prisma";

export async function fetchAdminPlatformMetrics() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);

  const [
    totalUsers,
    adminUsers,
    verifiedUsers,
    newUsersLastThirtyDays,
    draftPosts,
    archivedPosts,
    latestUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count({ where: { emailVerified: { not: null } } }),
    prisma.user.count({ where: { created_at: { gte: thirtyDaysAgo } } }),
    prisma.posts.count({ where: { status: "DRAFT" } }),
    prisma.posts.count({ where: { status: "ARCHIVED" } }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
      take: 5,
    }),
  ]);

  return {
    totalUsers,
    adminUsers,
    verifiedUsers,
    newUsersLastThirtyDays,
    draftPosts,
    archivedPosts,
    latestUsers,
  };
}

export async function fetchAuthorDashboardMetrics(authorId: string) {
  const [publishedPosts, draftPosts, totalViews, totalReaders, latestPosts] = await Promise.all([
    prisma.posts.count({ where: { author_id: authorId, status: "PUBLISHED" } }),
    prisma.posts.count({ where: { author_id: authorId, status: "DRAFT" } }),
    prisma.posts.aggregate({ where: { author_id: authorId }, _sum: { view_count: true } }),
    prisma.post_views.count({ where: { posts: { author_id: authorId } } }),
    prisma.posts.findMany({
      where: { author_id: authorId },
      select: { slug: true, title: true, status: true, view_count: true, updated_at: true },
      orderBy: { updated_at: "desc" },
      take: 6,
    }),
  ]);
  return { publishedPosts, draftPosts, totalViews: totalViews._sum.view_count ?? 0, totalReaders, latestPosts };
}

type FindUsersInput = {
  query?: string;
  role?: user_role;
};

export async function findUsers({ query, role }: FindUsersInput) {
  const keyword = query?.trim();
  return prisma.user.findMany({
    where: {
      ...(role ? { role } : {}),
      ...(keyword
        ? {
            OR: [
              { name: { contains: keyword, mode: "insensitive" } },
              { email: { contains: keyword, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      emailVerified: true,
      created_at: true,
      _count: { select: { accounts: true, comments: true, sessions: true } },
    },
    orderBy: { created_at: "desc" },
    take: 100,
  });
}

export async function findUserForRoleChange(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });
}

export async function setUserRole(userId: string, role: user_role) {
  await prisma.user.update({ where: { id: userId }, data: { role } });
}

export async function replaceRoleChangeCode(input: {
  identifier: string;
  token: string;
  expires: Date;
}) {
  await prisma.verificationToken.deleteMany({
    where: { identifier: input.identifier },
  });
  await prisma.verificationToken.create({ data: input });
}

export async function consumeRoleChangeCode(input: {
  identifier: string;
  token: string;
}) {
  const verification = await prisma.verificationToken.findFirst({
    where: {
      identifier: input.identifier,
      token: input.token,
      expires: { gt: new Date() },
    },
  });
  if (!verification) return false;

  await prisma.verificationToken.delete({ where: { token: verification.token } });
  return true;
}
