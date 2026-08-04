import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PostEditorForm } from "@/features/content/components/post-editor-form";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");
  return <PostEditorForm defaultAuthor={session.user.name || session.user.email || "DevInsight"} />;
}
