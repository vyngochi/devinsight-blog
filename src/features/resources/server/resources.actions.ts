"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { canUseAuthorPermission } from "@/features/admin/server/author-permissions";
import {
  publishResource,
  removeResource,
} from "@/features/resources/server/resources.service";

export type ResourceActionState = { error?: string; success?: string };

async function requireResourceManager() {
  const session = await auth();
  if (!session?.user?.id || !(await canUseAuthorPermission(session.user, "manageResources")))
    throw new Error("Bạn không có quyền quản lý tài nguyên.");
  return session.user;
}

function readText(value: FormDataEntryValue | null, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function registerResourceAction(
  _: ResourceActionState,
  formData: FormData,
): Promise<ResourceActionState> {
  try {
    const user = await requireResourceManager();
    await publishResource({
      title: readText(formData.get("title"), 220),
      description: readText(formData.get("description"), 2_000),
      topic: readText(formData.get("topic"), 60),
      fileKey: readText(formData.get("fileKey"), 600),
      fileName: readText(formData.get("fileName"), 255),
      mimeType: readText(formData.get("mimeType"), 120),
      fileSize: Number(formData.get("fileSize")),
      published: formData.get("published") === "true",
      uploadedById: user.id,
    });
    revalidatePath("/resources");
    revalidatePath("/admin/resources");
    return { success: "Tài nguyên đã được lưu." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Không thể lưu tài nguyên." };
  }
}

export async function deleteResourceAction(
  resourceId: string,
): Promise<ResourceActionState> {
  try {
    const user = await requireResourceManager();
    if (!/^[0-9a-f-]{36}$/i.test(resourceId))
      throw new Error("Mã tài nguyên không hợp lệ.");
    await removeResource(resourceId, user.role === "AUTHOR" ? user.id : undefined);
    revalidatePath("/resources");
    revalidatePath("/admin/resources");
    return { success: "Đã xóa tệp trên R2 và metadata trong cơ sở dữ liệu." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Không thể xóa tài nguyên." };
  }
}
