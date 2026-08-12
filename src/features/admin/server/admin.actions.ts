"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import type { user_role } from "@/generated/prisma/client";
import { requestManagedUserRoleChange, confirmManagedUserRoleChange } from "@/features/admin/server/admin.service";
import { AUTHOR_PERMISSION_KEYS, saveAuthorPermissions, type AuthorPermissions } from "@/features/admin/server/author-permissions";

export type AuthorPermissionsActionState = { error?: string; success?: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Bạn không có quyền thực hiện thao tác này.");
  }
  return session.user;
}

export async function requestRoleChangeAction(formData: FormData) {
  const actor = await requireAdmin();
  const userId = formData.get("userId");
  const role = formData.get("role");

  if (typeof userId !== "string" || !userId) {
    throw new Error("Người dùng không hợp lệ.");
  }
  if (role !== "USER" && role !== "AUTHOR" && role !== "ADMIN") {
    throw new Error("Vai trò không hợp lệ.");
  }

  await requestManagedUserRoleChange({
    actorId: actor.id,
    userId,
    role: role as user_role,
  });
  
  return { success: true };
}

export async function confirmRoleChangeAction(formData: FormData) {
  const actor = await requireAdmin();
  const userId = formData.get("userId");
  const role = formData.get("role");
  const code = formData.get("code");

  if (typeof userId !== "string" || !userId) {
    throw new Error("Người dùng không hợp lệ.");
  }
  if (role !== "USER" && role !== "AUTHOR" && role !== "ADMIN") {
    throw new Error("Vai trò không hợp lệ.");
  }
  if (typeof code !== "string" || code.length !== 6) {
    throw new Error("Mã xác nhận không hợp lệ.");
  }

  await confirmManagedUserRoleChange({
    actorId: actor.id,
    userId,
    role: role as user_role,
    code,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  
  return { success: true };
}

export async function saveAuthorPermissionsAction(_: AuthorPermissionsActionState, formData: FormData): Promise<AuthorPermissionsActionState> {
  try {
    await requireAdmin();
    const permissions = Object.fromEntries(
      AUTHOR_PERMISSION_KEYS.map((key) => [key, formData.get(key) === "on"]),
    ) as AuthorPermissions;
    await saveAuthorPermissions(permissions);
    revalidatePath("/admin");
    revalidatePath("/admin/settings");
    revalidatePath("/admin/posts");
    revalidatePath("/admin/news");
    revalidatePath("/admin/community");
    revalidatePath("/admin/resources");
    return { success: "Đã cập nhật quyền mặc định cho AUTHOR." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Không thể cập nhật quyền AUTHOR." };
  }
}
