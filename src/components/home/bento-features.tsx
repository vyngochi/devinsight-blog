import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Newspaper } from "lucide-react";
import type { PostSummary } from "@/types/blog";

const fallbackCover = "/images/posts/devinsight-cover-fallback.png";
const technologyTags = new Set([
  "news",
  "tin-tuc",
  "tin tức",
  "cong-nghe",
  "công nghệ",
]);

function isTechnologyPost(post: PostSummary) {
  return (
    post.category === "Khám phá" ||
    post.tags.some((tag) => technologyTags.has(tag.toLocaleLowerCase("vi-VN")))
  );
}

export function BentoFeatures({ posts }: { posts: PostSummary[] }) {
  const technologyPosts = posts.filter(isTechnologyPost);
  const highlightedPosts = (technologyPosts.length ? technologyPosts : posts).slice(0, 3);
  const featuredPost = highlightedPosts[0];
  const secondaryPosts = highlightedPosts.slice(1);

  if (!featuredPost) {
    return (
      <section className="w-full border-y-2 border-[#1E293B] bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold text-[#7C3AED]">Công nghệ đáng theo dõi</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1E293B] sm:text-3xl">
            Tin mới sẽ được chọn lọc tại đây.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#64748B]">
            Khi DevInsight có bài viết mới, những nội dung đáng chú ý sẽ xuất hiện trên trang chủ.
          </p>
          <Link
            href="/posts"
            className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#7C3AED] hover:underline"
          >
            Xem trang Bài viết <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full border-y-2 border-[#1E293B] bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#7C3AED]">
            <Newspaper className="h-4 w-4" aria-hidden="true" />
            Công nghệ đáng theo dõi
          </div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1E293B] sm:text-3xl">
            Những chủ đề công nghệ nổi bật cho cộng đồng DevInsight.
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            Cập nhật công cụ, xu hướng và góc nhìn giúp bạn theo sát ngành phần mềm.
          </p>
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
          <article className="overflow-hidden rounded-xl border-2 border-[#1E293B] bg-[#F8FAFC] shadow-pop-lg">
            <Link
              href={`/posts/${featuredPost.slug}`}
              className="relative block aspect-[16/9] overflow-hidden bg-[#EDE9FE] bg-cover bg-center"
              style={{ backgroundImage: `url("${featuredPost.coverImage ?? fallbackCover}")` }}
              aria-label={`Đọc bài: ${featuredPost.title}`}
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
            <div className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-[#64748B]">
                <span className="rounded-md bg-[#EDE9FE] px-2 py-1 text-[#6D28D9]">{featuredPost.category}</span>
                <time dateTime={featuredPost.publishedAt}>{featuredPost.dateLabel}</time>
              </div>
              <Link href={`/posts/${featuredPost.slug}`} className="mt-3 block">
                <h3 className="text-xl font-extrabold leading-7 text-[#1E293B] transition-colors hover:text-[#7C3AED] sm:text-2xl">
                  {featuredPost.title}
                </h3>
              </Link>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#64748B]">{featuredPost.excerpt}</p>
              <div className="mt-4 flex items-center justify-between gap-3 text-xs font-bold text-[#64748B]">
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-[#7C3AED]" aria-hidden="true" />{featuredPost.readingTime}</span>
                <Link href={`/posts/${featuredPost.slug}`} className="inline-flex items-center gap-1 text-[#7C3AED] hover:underline">
                  Đọc bài <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>

          <div className="flex self-start flex-col rounded-xl border-2 border-[#1E293B] bg-white px-4 sm:px-5">
            {secondaryPosts.length ? secondaryPosts.map((post) => (
              <article key={post.slug} className="flex gap-3 border-b-2 border-[#E2E8F0] py-4 last:border-b-0">
                <Link
                  href={`/posts/${post.slug}`}
                  className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-[#EDE9FE] bg-cover bg-center"
                  style={{ backgroundImage: `url("${post.coverImage ?? fallbackCover}")` }}
                  aria-label={`Đọc bài: ${post.title}`}
                >
                  <Image
                    src={post.coverImage ?? fallbackCover}
                    alt=""
                    fill
                    sizes="112px"
                    unoptimized={Boolean(post.coverImage)}
                    className="object-cover"
                  />
                </Link>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[#7C3AED]">{post.category}</p>
                  <Link href={`/posts/${post.slug}`} className="mt-1 block">
                    <h3 className="line-clamp-2 text-sm font-extrabold leading-5 text-[#1E293B] hover:text-[#7C3AED]">{post.title}</h3>
                  </Link>
                  <p className="mt-1 text-[11px] font-semibold text-[#64748B]">{post.dateLabel}</p>
                </div>
              </article>
            )) : (
              <div className="flex flex-1 flex-col justify-center py-7">
                <p className="text-sm font-bold text-[#1E293B]">Đang chọn lọc thêm nội dung</p>
                <p className="mt-1 text-xs leading-5 text-[#64748B]">Các tin đáng chú ý khác sẽ được cập nhật tại đây.</p>
              </div>
            )}
            <Link href="/posts" className="inline-flex items-center gap-1 py-4 text-sm font-bold text-[#7C3AED] hover:underline">
              Khám phá tất cả bài viết <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
