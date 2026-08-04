import Link from "next/link";
import { Search, X } from "lucide-react";
import { PostListItem } from "@/components/posts/post-list-item";
import { getPostListing } from "@/features/content/server/post-listing.service";
import type { PostCategory } from "@/types/blog";

const postCategories: PostCategory[] = [
  "Học tập",
  "Mẹo nhanh",
  "Khám phá",
  "Tài nguyên",
  "Cộng đồng",
];

type PostsPageProps = {
  searchParams: Promise<{
    category?: string | string[];
    q?: string | string[];
  }>;
};

function getSingleSearchParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function createPostsHref(category: string | undefined, query: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (query) params.set("q", query);
  const search = params.toString();
  return search ? `/posts?${search}` : "/posts";
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const query = getSingleSearchParam(params.q);
  const requestedCategory = getSingleSearchParam(params.category);
  const allPosts = await getPostListing();
  const activeCategory = postCategories.find(
    (category) => category === requestedCategory,
  );
  const normalizedQuery = query.toLocaleLowerCase("vi-VN");
  const posts = allPosts.filter((post) => {
    const matchesCategory = !activeCategory || post.category === activeCategory;
    const searchableContent = [
      post.title,
      post.excerpt,
      post.category,
      post.author.name,
      ...post.tags,
    ]
      .join(" ")
      .toLocaleLowerCase("vi-VN");

    return matchesCategory && (!normalizedQuery || searchableContent.includes(normalizedQuery));
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1E293B] sm:text-5xl">
          Tất cả bài viết
        </h1>
        <p className="mt-3 leading-relaxed text-[#64748B]">
          Tìm hướng dẫn, mẹo thực hành và tài nguyên phù hợp với việc học lập trình của bạn.
        </p>
      </div>

      <form action="/posts" className="mt-8 flex max-w-2xl gap-3" role="search">
        {activeCategory ? <input type="hidden" name="category" value={activeCategory} /> : null}
        <label htmlFor="post-search" className="sr-only">
          Tìm bài viết
        </label>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]" aria-hidden="true" />
          <input
            id="post-search"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Tìm theo tiêu đề, thẻ hoặc tác giả"
            className="h-12 w-full rounded-xl border-2 border-[#1E293B] bg-white py-3 pl-12 pr-4 text-sm font-medium text-[#1E293B] outline-none placeholder:text-[#94A3B8] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#DDD6FE]"
          />
        </div>
        <button type="submit" className="rounded-xl border-2 border-[#1E293B] bg-[#8B5CF6] px-5 text-sm font-extrabold text-white hover:bg-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:ring-offset-2">
          Tìm kiếm
        </button>
      </form>

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Lọc bài viết theo chuyên mục">
        <Link
          href={createPostsHref(undefined, query)}
          className={`rounded-full border-2 border-[#1E293B] px-4 py-2 text-sm font-bold ${!activeCategory ? "bg-[#1E293B] text-white" : "bg-white text-[#1E293B] hover:bg-[#F1F5F9]"}`}
        >
          Tất cả ({allPosts.length})
        </Link>
        {postCategories.map((category) => {
          const count = allPosts.filter((post) => post.category === category).length;
          const isActive = category === activeCategory;
          return (
            <Link
              key={category}
              href={createPostsHref(category, query)}
              className={`rounded-full border-2 border-[#1E293B] px-4 py-2 text-sm font-bold ${isActive ? "bg-[#1E293B] text-white" : "bg-white text-[#1E293B] hover:bg-[#F1F5F9]"}`}
            >
              {category} ({count})
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm font-bold text-[#475569]">
          {posts.length} bài viết phù hợp
        </p>
        {(activeCategory || query) && (
          <Link href="/posts" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#7C3AED] hover:underline">
            <X className="h-4 w-4" aria-hidden="true" />
            Xóa bộ lọc
          </Link>
        )}
      </div>

      {posts.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostListItem key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border-2 border-dashed border-[#94A3B8] bg-white px-6 py-12 text-center">
          <h2 className="text-xl font-extrabold text-[#1E293B]">Chưa tìm thấy bài viết phù hợp</h2>
          <p className="mt-2 text-[#64748B]">Thử một từ khóa khác hoặc bỏ bớt bộ lọc chuyên mục.</p>
          <Link href="/posts" className="mt-5 inline-flex font-bold text-[#7C3AED] hover:underline">
            Xem tất cả bài viết
          </Link>
        </div>
      )}
    </section>
  );
}
