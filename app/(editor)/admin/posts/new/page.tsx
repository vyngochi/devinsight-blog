import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PostEditorForm } from "@/features/content/components/post-editor-form";
import { canUseAuthorPermission } from "@/features/admin/server/author-permissions";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user || !(await canUseAuthorPermission(session.user, "writePosts"))) redirect("/");
  return <PostEditorForm key="new-post" defaultAuthor={session.user.name || session.user.email || "DevInsight"} />;
}
