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
