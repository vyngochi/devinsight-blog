import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { PostEditorForm } from "@/features/content/components/post-editor-form";
import { getAdminEditablePost, getRelatedPostCandidates } from "@/features/content/server/post-editor.service";
import type { EditorPostInitialData } from "@/features/content/editor-types";
import { canUseAuthorPermission } from "@/features/admin/server/author-permissions";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user || !(await canUseAuthorPermission(session.user, "writePosts"))) redirect("/");
  const { slug } = await params;
  const post = await getAdminEditablePost(slug, "article", session.user.role === "AUTHOR" ? session.user.id : undefined);
  if (!post) notFound();
  const relatedCandidates = await getRelatedPostCandidates(post.slug);
  return <PostEditorForm key={`edit-post-${post.slug}`} draftOwnerId={session.user.id} defaultAuthor={session.user.name || session.user.email || "DevInsight"} initialData={post as EditorPostInitialData} relatedCandidates={relatedCandidates} />;
}
