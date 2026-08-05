import "server-only";

import { prisma } from "@/server/database/prisma";

const profileSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
  created_at: true,
} as const;

export function findUserProfileById(id: string) {
  return prisma.user.findUnique({ where: { id }, select: profileSelect });
}

export function updateUserProfile(id: string, data: { name: string; image?: string | null }) {
  return prisma.user.update({ where: { id }, data, select: profileSelect });
}
