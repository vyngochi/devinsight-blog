import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import { ViewTracker } from "@/components/analytics/view-tracker";
import { DatabaseMdxContent } from "@/components/mdx/database-mdx-content";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, siteName } from "@/config/site";
import { getPostBySlug } from "@/features/content/post-registry";
import { getDatabasePostBySlug } from "@/features/content/server/post-editor.service";

type PostPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

type ArticleData = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  tags: string[];
  author: { name: string; role?: string };
  coverImage?: string;
};

async function getArticle(slug: string) {
  const databasePost = await getDatabasePostBySlug(slug);
  if (databasePost) return { data: databasePost as ArticleData, content: databasePost.content };
  const legacyPost = getPostBySlug(slug);
  if (!legacyPost) return null;
  return { data: legacyPost.metadata as ArticleData, content: legacyPost.default };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const article = await getArticle((await params).slug);
  if (!article) return {};
  const { data } = article;
  const updatedAt = data.updatedAt ?? data.publishedAt;
  const canonicalPath = `/posts/${data.slug}`;
  return {
    title: data.title,
    description: data.excerpt,
    keywords: data.tags,
    authors: [{ name: data.author.name }],
    alternates: { canonical: canonicalPath },
    openGraph: { title: data.title, description: data.excerpt, type: "article", url: canonicalPath, locale: "vi_VN", siteName, publishedTime: `${data.publishedAt}T00:00:00.000Z`, modifiedTime: `${updatedAt}T00:00:00.000Z`, authors: [data.author.name], tags: data.tags, images: data.coverImage ? [{ url: data.coverImage }] : undefined },
    twitter: { card: data.coverImage ? "summary_large_image" : "summary", title: data.title, description: data.excerpt, images: data.coverImage ? [data.coverImage] : undefined },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const article = await getArticle((await params).slug);
  if (!article) notFound();
  const { data, content } = article;
  const updatedAt = data.updatedAt ?? data.publishedAt;
  const dateLabel = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${data.publishedAt}T00:00:00`));
  const canonicalUrl = absoluteUrl(`/posts/${data.slug}`);
  const articleSchema: Record<string, unknown> = { "@context": "https://schema.org", "@graph": [{ "@type": "BlogPosting", headline: data.title, description: data.excerpt, datePublished: `${data.publishedAt}T00:00:00.000Z`, dateModified: `${updatedAt}T00:00:00.000Z`, mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl }, author: { "@type": "Person", name: data.author.name, ...(data.author.role ? { jobTitle: data.author.role } : {}) }, publisher: { "@type": "Organization", name: siteName, logo: { "@type": "ImageObject", url: absoluteUrl("/Brand/Logo.png") } }, inLanguage: "vi-VN", keywords: data.tags.join(", "), ...(data.coverImage ? { image: data.coverImage } : {}) }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Trang chủ", item: absoluteUrl("/") }, { "@type": "ListItem", position: 2, name: "Tất cả bài viết", item: absoluteUrl("/posts") }, { "@type": "ListItem", position: 3, name: data.title, item: canonicalUrl }] }] };

  return <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-18"><JsonLd data={articleSchema} /><Link href="/posts" className="inline-flex items-center gap-2 text-sm font-bold text-[#8B5CF6] hover:underline"><ArrowLeft className="h-4 w-4" />Tất cả bài viết</Link><header className="mt-8 border-b-2 border-[#1E293B] pb-10"><div className="flex flex-wrap items-center gap-3 text-xs font-bold"><span className="rounded-full border-2 border-[#1E293B] bg-[#F472B6] px-3 py-1 text-white">{data.category}</span><span className="flex items-center gap-1 text-[#64748B]"><Clock className="h-4 w-4" />{data.readingTime}</span><time className="text-[#64748B]" dateTime={data.publishedAt}>{dateLabel}</time></div><h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-[#1E293B] sm:text-5xl">{data.title}</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#64748B]">{data.excerpt}</p><div className="mt-6 flex flex-wrap gap-2">{data.tags.map((tag) => <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-[#F1F5F9] px-3 py-1 text-xs font-bold text-[#64748B]"><Tag className="h-3.5 w-3.5" />{tag}</span>)}</div></header><ViewTracker slug={data.slug} /><div className="max-w-3xl py-10">{typeof content === "string" ? <DatabaseMdxContent source={content} /> : (() => { const LegacyContent = content; return <LegacyContent />; })()}</div></article>;
}
