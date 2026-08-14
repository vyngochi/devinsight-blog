"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { deleteNewsletterSubscriber, updateNewsletterSubscriberStatus, upsertNewsletterSubscriber } from "./newsletter.repository";

export type NewsletterActionState = { status: "idle" | "success" | "error"; message?: string };

export async function subscribeNewsletterAction(_: NewsletterActionState, formData: FormData): Promise<NewsletterActionState> {
  const value = formData.get("email");
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!email || email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { status: "error", message: "Vui lòng nhập một địa chỉ email hợp lệ." };
  try {
    await upsertNewsletterSubscriber(email);
    revalidatePath("/admin/newsletter");
    return { status: "success", message: "Đăng ký thành công. Hẹn gặp bạn trong bản tin tới!" };
  } catch (error) {
    console.error("[newsletter] Failed to subscribe email", {
      error,
      emailDomain: email.split("@")[1] ?? "unknown",
    });
    return { status: "error", message: "Chưa thể lưu đăng ký lúc này. Vui lòng thử lại sau." };
  }
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Bạn không có quyền thực hiện thao tác này.");
}

export async function updateNewsletterStatusAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  const status = formData.get("status");
  if (typeof id !== "string" || (status !== "ACTIVE" && status !== "UNSUBSCRIBED")) throw new Error("Dữ liệu không hợp lệ.");
  await updateNewsletterSubscriberStatus(id, status);
  revalidatePath("/admin/newsletter");
}

export async function deleteNewsletterSubscriberAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string" || !id) throw new Error("Dữ liệu không hợp lệ.");
  await deleteNewsletterSubscriber(id);
  revalidatePath("/admin/newsletter");
}
