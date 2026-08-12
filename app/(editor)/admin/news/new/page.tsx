import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { NewsEditorForm } from "@/features/content/components/news-editor-form";
import { canUseAuthorPermission } from "@/features/admin/server/author-permissions";

export const dynamic = "force-dynamic";

export default async function NewNewsPage() {
  const session = await auth();
  if (!session?.user || !(await canUseAuthorPermission(session.user, "writeNews"))) redirect("/");
  return <NewsEditorForm key="new-news" draftOwnerId={session.user.id} defaultAuthor={session.user.name || session.user.email || "DevInsight"} />;
}
