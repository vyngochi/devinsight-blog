"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { saveUserProfile } from "@/features/profile/server/profile.service";

export type ProfileFormState = { error?: string; success?: string };

export async function updateProfileAction(_: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Bạn cần đăng nhập để cập nhật hồ sơ.");
    const avatar = formData.get("avatar");
    await saveUserProfile({
      userId: session.user.id,
      name: formData.get("name"),
      avatar: avatar instanceof File ? avatar : undefined,
      removeAvatar: formData.get("removeAvatar") === "true",
    });
    revalidatePath("/profile");
    revalidatePath("/community", "layout");
    return { success: "Hồ sơ của bạn đã được cập nhật." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Không thể cập nhật hồ sơ lúc này." };
  }
}
