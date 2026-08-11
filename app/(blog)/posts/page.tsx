import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, Clock, Search, X, Eye } from "lucide-react";
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
const fallbackCover = "/images/posts/devinsight-cover-fallback.png";

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

function createPostsHref({
  category,
  feed,
  query,
}: {
  category?: string;
  feed?: Feed;
  query: string;
}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (feed) params.set("feed", feed);
  if (query) params.set("q", query);
  const search = params.toString();
  return search ? `/posts?${search}` : "/posts";
}

function isTechnologyNews(
  post: Awaited<ReturnType<typeof getPostListing>>[number],
) {
  const normalizedTags = post.tags.map((tag) => tag.toLocaleLowerCase("vi-VN"));
  return (
    post.category === "Khám phá" ||
    normalizedTags.some((tag) =>
      ["news", "tin-tuc", "tin tức", "cong-nghe", "công nghệ"].includes(tag),
    )
  );
}

export async function generateMetadata({
  searchParams,
}: PostsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const hasFilters = Boolean(
    getSingleSearchParam(params.category) ||
    getSingleSearchParam(params.feed) ||
    getSingleSearchParam(params.q),
  );

  return {
    title: "Bài viết và tin tức công nghệ",
    description:
      "Bài viết học lập trình từ DevInsight và tin tức công nghệ được chọn lọc cho sinh viên.",
    alternates: { canonical: "/posts" },
    robots: hasFilters ? { index: false, follow: true } : undefined,
    openGraph: {
      title: "Bài viết và tin tức công nghệ",
      description:
        "Bài viết học lập trình từ DevInsight và tin tức công nghệ được chọn lọc cho sinh viên.",
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
  const activeCategory = postCategories.find(
    (category) => category === requestedCategory,
  );
  const activeFeed =
    requestedFeed === "devinsight" || requestedFeed === "news"
      ? requestedFeed
      : undefined;
  const allPosts = await getPostListing();
  const normalizedQuery = query.toLocaleLowerCase("vi-VN");
  const posts = allPosts.filter((post) => {
    const matchesCategory = !activeCategory || post.category === activeCategory;
    const matchesFeed =
      !activeFeed ||
      (activeFeed === "news"
        ? isTechnologyNews(post)
        : !isTechnologyNews(post));
    const searchableContent = [
      post.title,
      post.excerpt,
      post.category,
      post.author.name,
      ...post.tags,
    ]
      .join(" ")
      .toLocaleLowerCase("vi-VN");

    return (
      matchesCategory &&
      matchesFeed &&
      (!normalizedQuery || searchableContent.includes(normalizedQuery))
    );
  });
  const devinsightPosts = posts.filter((post) => !isTechnologyNews(post));
  const technologyNews = posts.filter(isTechnologyNews);
  const featuredPost = posts.find((post) => post.featured) ?? posts[0];
  const latestPosts = posts
    .filter((post) => post.slug !== featuredPost?.slug)
    .slice(0, 3);

  return (
    <main className="min-h-[70dvh] bg-[#F8FAFC] py-6 sm:py-8">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="border-b border-[#CBD5E1] pb-5 sm:pb-6">
          <p className="text-[11px] font-bold text-[#6D28D9]">
            DevInsight Newsroom
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#1E293B] sm:text-3xl">
            Bài viết và tin tức công nghệ
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
            Hướng dẫn để học và làm tốt hơn, cùng các tin tức công nghệ đáng
            theo dõi.
          </p>

          <form
            action="/posts"
            className="mt-4 flex max-w-2xl gap-2"
            role="search"
          >
            {activeCategory ? (
              <input type="hidden" name="category" value={activeCategory} />
            ) : null}
            {activeFeed ? (
              <input type="hidden" name="feed" value={activeFeed} />
            ) : null}
            <label htmlFor="post-search" className="sr-only">
              Tìm bài viết
            </label>
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]"
                aria-hidden="true"
              />
              <input
                id="post-search"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Tìm tiêu đề, thẻ hoặc tác giả"
                className="h-10 w-full rounded-lg border border-[#CBD5E1] bg-white py-2 pl-9 pr-3 text-xs font-medium text-[#1E293B] outline-none placeholder:text-[#94A3B8] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#DDD6FE]"
              />
            </div>
            <button
              type="submit"
              className="h-10 rounded-lg bg-[#1E293B] px-4 text-xs font-bold text-white hover:bg-[#334155] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:ring-offset-2"
            >
              Tìm kiếm
            </button>
          </form>
        </header>

        <nav
          className="mt-4 flex flex-wrap gap-2"
          aria-label="Lọc theo dòng nội dung"
        >
          {[
            {
              label: "Tất cả nội dung",
              feed: undefined,
              count: allPosts.length,
            },
            {
              label: "Bài viết DevInsight",
              feed: "devinsight" as const,
              count: allPosts.filter((post) => !isTechnologyNews(post)).length,
            },
            {
              label: "Tin tức công nghệ",
              feed: "news" as const,
              count: allPosts.filter(isTechnologyNews).length,
            },
          ].map((item) => {
            const selected = item.feed === activeFeed;
            return (
              <Link
                key={item.label}
                href={createPostsHref({ feed: item.feed, query })}
                className={`rounded-md px-3 py-2 text-xs font-bold ${selected ? "bg-[#1E293B] text-white" : "border border-[#CBD5E1] bg-white text-[#475569] hover:border-[#A78BFA] hover:text-[#6D28D9]"}`}
              >
                {item.label}{" "}
                <span className="ml-1 opacity-70">{item.count}</span>
              </Link>
            );
          })}
        </nav>

        <nav
          className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs font-semibold"
          aria-label="Lọc bài viết theo chuyên mục"
        >
          <Link
            href={createPostsHref({ feed: activeFeed, query })}
            className={
              !activeCategory
                ? "text-[#6D28D9]"
                : "text-[#64748B] hover:text-[#6D28D9]"
            }
          >
            Tất cả chuyên mục
          </Link>
          {postCategories.map((category) => (
            <Link
              key={category}
              href={createPostsHref({ category, feed: activeFeed, query })}
              className={
                activeCategory === category
                  ? "text-[#6D28D9]"
                  : "text-[#64748B] hover:text-[#6D28D9]"
              }
            >
              {category}
            </Link>
          ))}
        </nav>

        <div className="mt-5 flex items-center justify-between gap-4 text-xs font-semibold text-[#64748B]">
          <p>{posts.length} nội dung phù hợp</p>
          {(activeCategory || activeFeed || query) && (
            <Link
              href="/posts"
              className="inline-flex items-center gap-1 text-[#6D28D9] hover:underline"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" /> Xóa bộ lọc
            </Link>
          )}
        </div>

        {featuredPost ? (
          <section className="mt-4 grid overflow-hidden rounded-xl border border-[#CBD5E1] bg-white lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
            <Link
              href={`/posts/${featuredPost.slug}`}
              className="relative block min-h-52 overflow-hidden bg-[#EDE9FE] bg-cover bg-center"
              style={{
                backgroundImage: `url("${featuredPost.coverImage ?? fallbackCover}")`,
              }}
            >
              <Image
                src={featuredPost.coverImage ?? fallbackCover}
                alt=""
                fill
                preload
                sizes="(max-width: 1024px) 100vw, 58vw"
                unoptimized={Boolean(featuredPost.coverImage)}
                className="object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
            </Link>
            <div className="flex flex-col p-4 sm:p-5">
              <span className="w-fit rounded-md bg-[#EDE9FE] px-2 py-1 text-[10px] font-bold text-[#6D28D9]">
                Nổi bật
              </span>
              <p className="mt-3 text-[11px] font-bold text-[#64748B]">
                {featuredPost.category} · {featuredPost.dateLabel}
              </p>
              <Link href={`/posts/${featuredPost.slug}`} className="mt-2">
                <h2 className="text-xl font-extrabold leading-7 tracking-tight text-[#1E293B] hover:text-[#6D28D9] sm:text-2xl">
                  {featuredPost.title}
                </h2>
              </Link>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#64748B]">
                {featuredPost.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs font-semibold text-[#64748B]">
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[#7C3AED]" />
                    {featuredPost.readingTime}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-[#7C3AED]" />
                    {featuredPost.readerCount}
                  </span>
                </div>
                <Link
                  href={`/posts/${featuredPost.slug}`}
                  className="inline-flex items-center gap-1 font-bold text-[#6D28D9] hover:underline"
                >
                  Đọc bài <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {latestPosts.length > 0 ? (
          <section className="mt-7">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-extrabold text-[#1E293B]">
                Mới cập nhật
              </h2>
              <span className="text-xs font-semibold text-[#64748B]">
                Theo thời gian xuất bản
              </span>
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <PostListItem key={post.slug} post={post} />
              ))}
            </div>
          </section>
        ) : null}

        {activeFeed === "devinsight" ? (
          <section className="mt-8">
            <PostFeed
              title="Bài viết DevInsight"
              description="Hướng dẫn, kinh nghiệm và tài nguyên từ đội ngũ DevInsight."
              posts={devinsightPosts.filter(
                (post) => post.slug !== featuredPost?.slug,
              )}
              columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            />
          </section>
        ) : activeFeed === "news" ? (
          <section className="mt-8">
            <PostFeed
              title="Tin tức công nghệ"
              description="Cập nhật đáng chú ý từ ngành công nghệ và cộng đồng phát triển."
              posts={technologyNews.filter(
                (post) => post.slug !== featuredPost?.slug,
              )}
              emptyMessage="Chưa có tin tức công nghệ phù hợp. Chuyên mục Khám phá hoặc tag news sẽ xuất hiện tại đây."
              columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            />
          </section>
        ) : devinsightPosts.length > 0 && technologyNews.length > 0 ? (
          <section className="mt-8 grid gap-7 lg:grid-cols-2">
            <PostFeed
              title="Bài viết DevInsight"
              description="Hướng dẫn, kinh nghiệm và tài nguyên từ đội ngũ DevInsight."
              posts={devinsightPosts.filter(
                (post) => post.slug !== featuredPost?.slug,
              )}
            />
            <PostFeed
              title="Tin tức công nghệ"
              description="Cập nhật đáng chú ý từ ngành công nghệ và cộng đồng phát triển."
              posts={technologyNews.filter(
                (post) => post.slug !== featuredPost?.slug,
              )}
              emptyMessage="Chưa có tin tức công nghệ phù hợp. Chuyên mục Khám phá hoặc tag news sẽ xuất hiện tại đây."
            />
          </section>
        ) : technologyNews.length > 0 ? (
          <section className="mt-8">
            <PostFeed
              title="Tin tức công nghệ"
              description="Cập nhật đáng chú ý từ ngành công nghệ và cộng đồng phát triển."
              posts={technologyNews.filter(
                (post) => post.slug !== featuredPost?.slug,
              )}
              emptyMessage="Chưa có tin tức công nghệ phù hợp. Chuyên mục Khám phá hoặc tag news sẽ xuất hiện tại đây."
              columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            />
          </section>
        ) : devinsightPosts.length > 0 ? (
          <section className="mt-8">
            <PostFeed
              title="Bài viết DevInsight"
              description="Hướng dẫn, kinh nghiệm và tài nguyên từ đội ngũ DevInsight."
              posts={devinsightPosts.filter(
                (post) => post.slug !== featuredPost?.slug,
              )}
              columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            />
          </section>
        ) : null}

        {!posts.length ? (
          <section className="mt-5 rounded-xl border border-dashed border-[#94A3B8] bg-white px-6 py-10 text-center">
            <h2 className="text-base font-extrabold text-[#1E293B]">
              Chưa tìm thấy nội dung phù hợp
            </h2>
            <p className="mt-1.5 text-xs text-[#64748B]">
              Thử một từ khóa khác hoặc bỏ bớt bộ lọc.
            </p>
            <Link
              href="/posts"
              className="mt-3 inline-flex text-xs font-bold text-[#6D28D9] hover:underline"
            >
              Xem toàn bộ nội dung
            </Link>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function PostFeed({
  title,
  description,
  posts,
  emptyMessage = "Bài nổi bật đang được hiển thị ở đầu trang.",
  columns = "grid-cols-1 sm:grid-cols-2",
}: {
  title: string;
  description: string;
  posts: Awaited<ReturnType<typeof getPostListing>>;
  emptyMessage?: string;
  columns?: string;
}) {
  return (
    <section>
      <h2 className="text-base font-extrabold text-[#1E293B]">{title}</h2>
      <p className="mt-1 text-xs leading-5 text-[#64748B]">{description}</p>
      {posts.length ? (
        <div className={`mt-3 grid gap-4 ${columns}`}>
          {posts.map((post) => (
            <PostListItem key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="mt-3 rounded-lg border border-dashed border-[#CBD5E1] bg-white px-3 py-4 text-xs leading-5 text-[#64748B]">
          {emptyMessage}
        </p>
      )}
    </section>
  );
}
