"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Clock, Eye, X } from "lucide-react";
import { PostListItem } from "@/components/posts/post-list-item";
import type { PostListItem as PostListItemData } from "@/features/content/server/post-listing.service";
import type { PostCategory } from "@/types/blog";

type Feed = "devinsight" | "news";

const fallbackCover = "/images/posts/devinsight-cover-fallback.webp";

function isTechnologyNews(post: PostListItemData) {
  const normalizedTags = post.tags.map((tag) => tag.toLocaleLowerCase("vi-VN"));
  return (
    post.category === "Khám phá" ||
    normalizedTags.some((tag) =>
      ["news", "tin-tuc", "tin tức", "cong-nghe", "công nghệ"].includes(tag),
    )
  );
}

function replaceFiltersInUrl(feed?: Feed, category?: PostCategory) {
  const url = new URL(window.location.href);
  if (feed) url.searchParams.set("feed", feed);
  else url.searchParams.delete("feed");
  if (category) url.searchParams.set("category", category);
  else url.searchParams.delete("category");
  window.history.replaceState(window.history.state, "", url);
}

export function PostsBrowser({
  allPosts,
  initialFeed,
  initialCategory,
  query,
  categories,
}: {
  allPosts: PostListItemData[];
  initialFeed?: Feed;
  initialCategory?: PostCategory;
  query: string;
  categories: PostCategory[];
}) {
  const [activeFeed, setActiveFeed] = useState<Feed | undefined>(initialFeed);
  const [activeCategory, setActiveCategory] = useState<PostCategory | undefined>(initialCategory);
  const normalizedQuery = query.toLocaleLowerCase("vi-VN");

  const posts = useMemo(
    () =>
      allPosts.filter((post) => {
        const matchesCategory = !activeCategory || post.category === activeCategory;
        const matchesFeed =
          !activeFeed ||
          (activeFeed === "news" ? isTechnologyNews(post) : !isTechnologyNews(post));
        const searchableContent = [
          post.title,
          post.excerpt,
          post.category,
          post.author.name,
          ...post.tags,
        ]
          .join(" ")
          .toLocaleLowerCase("vi-VN");
        return matchesCategory && matchesFeed && (!normalizedQuery || searchableContent.includes(normalizedQuery));
      }),
    [activeCategory, activeFeed, allPosts, normalizedQuery],
  );

  const devinsightPosts = posts.filter((post) => !isTechnologyNews(post));
  const technologyNews = posts.filter(isTechnologyNews);
  const featuredPost = posts.find((post) => post.featured) ?? posts[0];
  const [preloadSlug] = useState(featuredPost?.slug);
  const latestPosts = posts.filter((post) => post.slug !== featuredPost?.slug).slice(0, 3);
  const feedItems: Array<{ label: string; feed?: Feed; count: number }> = [
    { label: "Tất cả nội dung", count: allPosts.length },
    { label: "Bài viết DevInsight", feed: "devinsight", count: allPosts.filter((post) => !isTechnologyNews(post)).length },
    { label: "Tin tức công nghệ", feed: "news", count: allPosts.filter(isTechnologyNews).length },
  ];

  function selectFeed(feed?: Feed) {
    setActiveFeed(feed);
    replaceFiltersInUrl(feed, activeCategory);
    const formFeed = document.querySelector<HTMLInputElement>("#post-feed-filter");
    if (formFeed) formFeed.value = feed ?? "";
  }

  function selectCategory(category?: PostCategory) {
    setActiveCategory(category);
    replaceFiltersInUrl(activeFeed, category);
    const formCategory = document.querySelector<HTMLInputElement>("#post-category-filter");
    if (formCategory) formCategory.value = category ?? "";
  }

  return (
    <>
      <nav className="mt-4 flex flex-wrap gap-2" aria-label="Lọc theo dòng nội dung">
        {feedItems.map((item) => {
          const selected = item.feed === activeFeed;
          return (
            <button
              key={item.label}
              type="button"
              aria-pressed={selected}
              onClick={() => selectFeed(item.feed)}
              className={`rounded-md px-3 py-2 text-xs font-bold transition-colors active:translate-y-px ${selected ? "bg-[#1E293B] text-white" : "border border-[#CBD5E1] bg-white text-[#475569] hover:border-[#A78BFA] hover:text-[#6D28D9]"}`}
            >
              {item.label} <span className="ml-1 opacity-70">{item.count}</span>
            </button>
          );
        })}
      </nav>

      <nav className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs font-semibold" aria-label="Lọc bài viết theo chuyên mục">
        <button type="button" aria-pressed={!activeCategory} onClick={() => selectCategory()} className={!activeCategory ? "text-[#6D28D9]" : "text-[#64748B] hover:text-[#6D28D9]"}>Tất cả chuyên mục</button>
        {categories.map((category) => (
          <button type="button" aria-pressed={activeCategory === category} onClick={() => selectCategory(category)} key={category} className={activeCategory === category ? "text-[#6D28D9]" : "text-[#64748B] hover:text-[#6D28D9]"}>{category}</button>
        ))}
      </nav>

      <div className="mt-5 flex items-center justify-between gap-4 text-xs font-semibold text-[#64748B]">
        <p aria-live="polite">{posts.length} nội dung phù hợp</p>
        {(activeCategory || activeFeed || query) ? (
          <Link href="/posts" className="inline-flex items-center gap-1 text-[#6D28D9] hover:underline"><X className="h-3.5 w-3.5" aria-hidden="true" /> Xóa bộ lọc</Link>
        ) : null}
      </div>

      {featuredPost ? (
        <section className="mt-4 grid overflow-hidden rounded-xl border border-[#CBD5E1] bg-white lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
          <Link href={`/posts/${featuredPost.slug}`} className="relative block min-h-52 overflow-hidden bg-[#EDE9FE]">
            <Image src={featuredPost.coverImage ?? fallbackCover} alt="" fill preload={featuredPost.slug === preloadSlug} sizes="(max-width: 1024px) 100vw, 58vw" unoptimized={Boolean(featuredPost.coverImage)} className="object-cover transition-transform duration-300 hover:scale-[1.02]" />
          </Link>
          <div className="flex flex-col p-4 sm:p-5">
            <span className="w-fit rounded-md bg-[#EDE9FE] px-2 py-1 text-[10px] font-bold text-[#6D28D9]">Nổi bật</span>
            <p className="mt-3 text-[11px] font-bold text-[#64748B]">{featuredPost.category} · {featuredPost.dateLabel}</p>
            <Link href={`/posts/${featuredPost.slug}`} className="mt-2"><h2 className="text-xl font-extrabold leading-7 tracking-tight text-[#1E293B] hover:text-[#6D28D9] sm:text-2xl">{featuredPost.title}</h2></Link>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#64748B]">{featuredPost.excerpt}</p>
            <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs font-semibold text-[#64748B]">
              <div className="flex items-center gap-4"><span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-[#7C3AED]" />{featuredPost.readingTime}</span><span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5 text-[#7C3AED]" />{featuredPost.readerCount}</span></div>
              <Link href={`/posts/${featuredPost.slug}`} className="inline-flex items-center gap-1 font-bold text-[#6D28D9] hover:underline">Đọc bài <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
          </div>
        </section>
      ) : null}

      {latestPosts.length ? (
        <section className="mt-7">
          <div className="flex items-center justify-between gap-4"><h2 className="text-base font-extrabold text-[#1E293B]">Mới cập nhật</h2><span className="text-xs font-semibold text-[#64748B]">Theo thời gian xuất bản</span></div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{latestPosts.map((post) => <PostListItem key={post.slug} post={post} />)}</div>
        </section>
      ) : null}

      {activeFeed === "devinsight" ? (
        <section className="mt-8"><PostFeed title="Bài viết DevInsight" description="Hướng dẫn, kinh nghiệm và tài nguyên từ đội ngũ DevInsight." posts={devinsightPosts.filter((post) => post.slug !== featuredPost?.slug)} /></section>
      ) : activeFeed === "news" ? (
        <section className="mt-8"><PostFeed title="Tin tức công nghệ" description="Cập nhật đáng chú ý từ ngành công nghệ và cộng đồng phát triển." posts={technologyNews.filter((post) => post.slug !== featuredPost?.slug)} emptyMessage="Chưa có tin tức công nghệ phù hợp." /></section>
      ) : devinsightPosts.length && technologyNews.length ? (
        <section className="mt-8 grid gap-7 lg:grid-cols-2"><PostFeed title="Bài viết DevInsight" description="Hướng dẫn, kinh nghiệm và tài nguyên từ đội ngũ DevInsight." posts={devinsightPosts.filter((post) => post.slug !== featuredPost?.slug)} columns="grid-cols-1 sm:grid-cols-2" /><PostFeed title="Tin tức công nghệ" description="Cập nhật đáng chú ý từ ngành công nghệ và cộng đồng phát triển." posts={technologyNews.filter((post) => post.slug !== featuredPost?.slug)} columns="grid-cols-1 sm:grid-cols-2" /></section>
      ) : technologyNews.length ? (
        <section className="mt-8"><PostFeed title="Tin tức công nghệ" description="Cập nhật đáng chú ý từ ngành công nghệ và cộng đồng phát triển." posts={technologyNews.filter((post) => post.slug !== featuredPost?.slug)} /></section>
      ) : devinsightPosts.length ? (
        <section className="mt-8"><PostFeed title="Bài viết DevInsight" description="Hướng dẫn, kinh nghiệm và tài nguyên từ đội ngũ DevInsight." posts={devinsightPosts.filter((post) => post.slug !== featuredPost?.slug)} /></section>
      ) : (
        <section className="mt-5 rounded-xl border border-dashed border-[#94A3B8] bg-white px-6 py-10 text-center"><h2 className="text-base font-extrabold text-[#1E293B]">Chưa tìm thấy nội dung phù hợp</h2><p className="mt-1.5 text-xs text-[#64748B]">Thử một từ khóa khác hoặc bỏ bớt bộ lọc.</p></section>
      )}
    </>
  );
}

function PostFeed({ title, description, posts, emptyMessage = "Bài nổi bật đang được hiển thị ở đầu trang.", columns = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" }: { title: string; description: string; posts: PostListItemData[]; emptyMessage?: string; columns?: string }) {
  return <section><h2 className="text-base font-extrabold text-[#1E293B]">{title}</h2><p className="mt-1 text-xs leading-5 text-[#64748B]">{description}</p>{posts.length ? <div className={`mt-3 grid gap-4 ${columns}`}>{posts.map((post) => <PostListItem key={post.slug} post={post} />)}</div> : <p className="mt-3 rounded-lg border border-dashed border-[#CBD5E1] bg-white px-3 py-4 text-xs leading-5 text-[#64748B]">{emptyMessage}</p>}</section>;
}
