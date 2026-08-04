import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import {
  getAllPosts,
  getPostBySlug,
} from "@/features/content/post-registry";
import { ViewTracker } from "@/components/analytics/view-tracker";

type PostPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const { metadata } = post;
  return { title: `${metadata.title} | DevInsight`, description: metadata.excerpt, openGraph: { title: metadata.title, description: metadata.excerpt, type: "article" } };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const { default: Content, metadata } = post;
  const dateLabel = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${metadata.publishedAt}T00:00:00`));

  return <article className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:py-18">
    <Link href="/posts" className="inline-flex items-center gap-2 text-sm font-bold text-[#8B5CF6] hover:underline"><ArrowLeft className="w-4 h-4" />Tất cả bài viết</Link>
    <header className="mt-8 border-b-2 border-[#1E293B] pb-10">
      <div className="flex flex-wrap items-center gap-3 text-xs font-bold"><span className="rounded-full border-2 border-[#1E293B] bg-[#F472B6] px-3 py-1 text-white">{metadata.category}</span><span className="flex items-center gap-1 text-[#64748B]"><Clock className="w-4 h-4" />{metadata.readingTime}</span><time className="text-[#64748B]" dateTime={metadata.publishedAt}>{dateLabel}</time></div>
      <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-[#1E293B] sm:text-5xl">{metadata.title}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#64748B]">{metadata.excerpt}</p>
      <div className="mt-6 flex flex-wrap gap-2">{metadata.tags.map((tag) => <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-[#F1F5F9] px-3 py-1 text-xs font-bold text-[#64748B]"><Tag className="w-3.5 h-3.5" />{tag}</span>)}</div>
    </header>
    <ViewTracker slug={metadata.slug} />
    <div className="max-w-3xl py-10"><Content /></div>
  </article>;
}
