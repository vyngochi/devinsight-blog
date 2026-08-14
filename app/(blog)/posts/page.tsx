import type { Metadata } from "next";
import { Search } from "lucide-react";
import { PostsBrowser } from "@/components/posts/posts-browser";
import { getPostListing } from "@/features/content/server/post-listing.service";
import type { PostCategory } from "@/types/blog";

const postCategories: PostCategory[] = [
  "Học tập",
  "Mẹo nhanh",
  "Khám phá",
  "Tài nguyên",
  "Cộng đồng",
];

type Feed = "devinsight" | "news";
type PostsPageProps = {
  searchParams: Promise<{
    category?: string | string[];
    feed?: string | string[];
    q?: string | string[];
  }>;
};

function getSingleSearchParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

export async function generateMetadata({ searchParams }: PostsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const hasFilters = Boolean(
    getSingleSearchParam(params.category) ||
      getSingleSearchParam(params.feed) ||
      getSingleSearchParam(params.q),
  );

  return {
    title: "Bài viết và tin tức công nghệ",
    description: "Bài viết học lập trình từ DevInsight và tin tức công nghệ được chọn lọc cho sinh viên.",
    alternates: { canonical: "/posts" },
    robots: hasFilters ? { index: false, follow: true } : undefined,
    openGraph: {
      title: "Bài viết và tin tức công nghệ",
      description: "Bài viết học lập trình từ DevInsight và tin tức công nghệ được chọn lọc cho sinh viên.",
      url: "/posts",
      type: "website",
    },
  };
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const query = getSingleSearchParam(params.q);
  const requestedCategory = getSingleSearchParam(params.category);
  const requestedFeed = getSingleSearchParam(params.feed);
  const activeCategory = postCategories.find((category) => category === requestedCategory);
  const activeFeed: Feed | undefined =
    requestedFeed === "devinsight" || requestedFeed === "news" ? requestedFeed : undefined;
  const allPosts = await getPostListing();

  return (
    <main className="min-h-[70dvh] bg-[#F8FAFC] py-6 sm:py-8">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="border-b border-[#CBD5E1] pb-5 sm:pb-6">
          <p className="text-[11px] font-bold text-[#6D28D9]">DevInsight Newsroom</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#1E293B] sm:text-3xl">Bài viết và tin tức công nghệ</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">Hướng dẫn để học và làm tốt hơn, cùng các tin tức công nghệ đáng theo dõi.</p>

          <form action="/posts" className="mt-4 flex max-w-2xl gap-2" role="search">
            <input id="post-category-filter" type="hidden" name="category" defaultValue={activeCategory ?? ""} />
            <input id="post-feed-filter" type="hidden" name="feed" defaultValue={activeFeed ?? ""} />
            <label htmlFor="post-search" className="sr-only">Tìm bài viết</label>
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" aria-hidden="true" />
              <input id="post-search" name="q" type="search" defaultValue={query} placeholder="Tìm tiêu đề, thẻ hoặc tác giả" className="h-10 w-full rounded-lg border border-[#CBD5E1] bg-white py-2 pl-9 pr-3 text-xs font-medium text-[#1E293B] outline-none placeholder:text-[#64748B] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#DDD6FE]" />
            </div>
            <button type="submit" className="h-10 whitespace-nowrap rounded-lg bg-[#1E293B] px-4 text-xs font-bold text-white hover:bg-[#334155] active:translate-y-px focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:ring-offset-2">Tìm kiếm</button>
          </form>
        </header>

        <PostsBrowser allPosts={allPosts} initialFeed={activeFeed} initialCategory={activeCategory} query={query} categories={postCategories} />
      </div>
    </main>
  );
}
