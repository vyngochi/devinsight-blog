import Link from "next/link";
import { ExternalLink, Newspaper, Plus } from "lucide-react";
import { getAdminNewsList } from "@/features/content/server/post-editor.service";
import { AdminPostRowActions } from "@/features/content/components/admin-post-row-actions";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { canUseAuthorPermission } from "@/features/admin/server/author-permissions";

export default async function AdminNewsPage() {
  const session = await auth();
  if (!session?.user || !(await canUseAuthorPermission(session.user, "writeNews"))) notFound();
  const news = await getAdminNewsList(session.user.role === "AUTHOR" ? session.user.id : undefined);

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold text-[#BE185D]">DEVINSIGHT NEWSROOM</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1E293B] sm:text-3xl">Tin tức công nghệ</h1>
          <p className="mt-2 text-sm text-[#64748B]">Soạn và xuất bản tin có nguồn, thời điểm tin và ảnh bìa.</p>
        </div>
        <Link href="/admin/news/new" className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#1E293B] bg-[#FBBF24] px-4 py-2.5 text-sm font-extrabold text-[#1E293B]">
          <Plus className="h-4 w-4" aria-hidden="true" />Viết tin mới
        </Link>
      </section>

      {news.length ? (
        <section className="overflow-hidden rounded-xl border-2 border-[#1E293B] bg-white">
          <div className="divide-y divide-[#E2E8F0]">
            {news.map((item) => (
              <article key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[#BE185D]">TIN CÔNG NGHỆ</p>
                  <h2 className="mt-1 truncate text-sm font-extrabold text-[#1E293B]">{item.title}</h2>
                  <p className="mt-1 line-clamp-1 text-xs text-[#64748B]">{item.excerpt}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-xs font-bold text-[#64748B]">
                  <span className={`rounded-md px-2 py-1 ${item.status === "PUBLISHED" ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEF3C7] text-[#92400E]"}`}>{item.status === "PUBLISHED" ? "Đã xuất bản" : "Bản nháp"}</span>
                  {item.status === "PUBLISHED" ? <Link href={`/posts/${item.slug}`} className="inline-flex items-center gap-1 text-[#6D28D9] hover:underline">Xem <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></Link> : null}
                  {!item.content_mdx.startsWith("Content is managed in src/content/posts/") ? <AdminPostRowActions slug={item.slug} kind="news" /> : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-xl border-2 border-dashed border-[#CBD5E1] bg-white px-6 py-14 text-center">
          <Newspaper className="mx-auto h-10 w-10 text-[#F472B6]" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-extrabold text-[#1E293B]">Chưa có tin tức</h2>
          <p className="mt-1 text-sm text-[#64748B]">Bắt đầu với tin công nghệ đầu tiên đã kiểm chứng nguồn.</p>
          <Link href="/admin/news/new" className="mt-4 inline-flex text-sm font-bold text-[#BE185D] hover:underline">Viết tin mới</Link>
        </section>
      )}
    </div>
  );
}
