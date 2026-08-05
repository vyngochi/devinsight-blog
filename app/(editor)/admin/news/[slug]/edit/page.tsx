import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { NewsEditorForm } from "@/features/content/components/news-editor-form";
import { getAdminEditablePost } from "@/features/content/server/post-editor.service";
import type { NewsEditorInitialData } from "@/features/content/editor-types";
import { canUseAuthorPermission } from "@/features/admin/server/author-permissions";

export const dynamic = "force-dynamic";

export default async function EditNewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user || !(await canUseAuthorPermission(session.user, "writeNews"))) redirect("/");
  const { slug } = await params;
  const news = await getAdminEditablePost(slug, "news", session.user.role === "AUTHOR" ? session.user.id : undefined);
  if (!news) notFound();
  return <NewsEditorForm key={`edit-news-${news.slug}`} defaultAuthor={session.user.name || session.user.email || "DevInsight"} initialData={news as NewsEditorInitialData} />;
}
