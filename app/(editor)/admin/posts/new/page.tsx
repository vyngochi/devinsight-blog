import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PostEditorForm } from "@/features/content/components/post-editor-form";
import { canUseAuthorPermission } from "@/features/admin/server/author-permissions";
import { getRelatedPostCandidates } from "@/features/content/server/post-editor.service";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user || !(await canUseAuthorPermission(session.user, "writePosts"))) redirect("/");
  const relatedCandidates = await getRelatedPostCandidates();
  return <PostEditorForm key="new-post" draftOwnerId={session.user.id} defaultAuthor={session.user.name || session.user.email || "DevInsight"} relatedCandidates={relatedCandidates} />;
}
