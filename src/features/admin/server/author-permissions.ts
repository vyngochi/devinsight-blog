import "server-only";

import type { user_role } from "@/generated/prisma/client";
import { prisma } from "@/server/database/prisma";

export const AUTHOR_PERMISSION_KEYS = [
  "viewOwnAnalytics",
  "writePosts",
  "writeNews",
  "moderateCommunity",
  "manageResources",
] as const;

export type AuthorPermissionKey = (typeof AUTHOR_PERMISSION_KEYS)[number];
export type AuthorPermissions = Record<AuthorPermissionKey, boolean>;

export const DEFAULT_AUTHOR_PERMISSIONS: AuthorPermissions = {
  viewOwnAnalytics: true,
  writePosts: true,
  writeNews: true,
  moderateCommunity: true,
  manageResources: true,
};

function toAuthorPermissions(
  record: {
    can_view_own_analytics: boolean;
    can_write_posts: boolean;
    can_write_news: boolean;
    can_moderate_community: boolean;
    can_manage_resources: boolean;
  } | null,
): AuthorPermissions {
  if (!record) return DEFAULT_AUTHOR_PERMISSIONS;
  return {
    viewOwnAnalytics: record.can_view_own_analytics,
    writePosts: record.can_write_posts,
    writeNews: record.can_write_news,
    moderateCommunity: record.can_moderate_community,
    manageResources: record.can_manage_resources,
  };
}

export async function getAuthorPermissions() {
  return toAuthorPermissions(
    await prisma.author_role_permissions.findUnique({
      where: { role: "AUTHOR" },
    }),
  );
}

export async function saveAuthorPermissions(input: AuthorPermissions) {
  await prisma.author_role_permissions.upsert({
    where: { role: "AUTHOR" },
    create: {
      role: "AUTHOR",
      can_view_own_analytics: input.viewOwnAnalytics,
      can_write_posts: input.writePosts,
      can_write_news: input.writeNews,
      can_moderate_community: input.moderateCommunity,
      can_manage_resources: input.manageResources,
    },
    update: {
      can_view_own_analytics: input.viewOwnAnalytics,
      can_write_posts: input.writePosts,
      can_write_news: input.writeNews,
      can_moderate_community: input.moderateCommunity,
      can_manage_resources: input.manageResources,
    },
  });
}

export async function canUseAuthorPermission(
  user: { role?: user_role; id?: string | null },
  permission: AuthorPermissionKey,
) {
  if (user.role === "ADMIN") return true;
  if (user.role !== "AUTHOR" || !user.id) return false;
  return (await getAuthorPermissions())[permission];
}
