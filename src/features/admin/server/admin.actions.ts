"use server";

import { revalidatePath } from "next/cache";
import { auth, signOut } from "@/auth";
import type { user_role } from "@/generated/prisma/client";
import { requestManagedUserRoleChange, confirmManagedUserRoleChange } from "@/features/admin/server/admin.service";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Bạn không có quyền thực hiện thao tác này.");
  }
  return session.user;
}

export async function logoutAdmin() {
  await signOut({ redirectTo: "/" });
}

export async function requestRoleChangeAction(formData: FormData) {
  const actor = await requireAdmin();
  const userId = formData.get("userId");
  const role = formData.get("role");

  if (typeof userId !== "string" || !userId) {
    throw new Error("Người dùng không hợp lệ.");
  }
  if (role !== "USER" && role !== "ADMIN") {
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
  if (role !== "USER" && role !== "ADMIN") {
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

