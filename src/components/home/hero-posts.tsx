import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Star, Eye } from "lucide-react";
import type { PostListItem } from "@/features/content/server/post-listing.service";
import { Badge } from "@/components/ui/button";

const fallbackCover = "/images/posts/devinsight-cover-fallback.png";

export function HeroPosts({ posts }: { posts: PostListItem[] }) {
  // Ưu tiên bài viết featured, nếu không đủ thì lấy các bài mới nhất
  const featuredPosts = posts.filter((p) => p.featured);
  const otherPosts = posts.filter((p) => !p.featured);

  const topPosts = [...featuredPosts, ...otherPosts].slice(0, 4);
  const mainPost = topPosts[0];
  const sidePosts = topPosts.slice(1);

  if (!mainPost) {
    return (
      <section className="w-full bg-[#F8FAFC] py-16 md:py-24 border-b-2 border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1E293B]">
            DevInsight Blog
          </h1>
          <p className="mt-4 text-[#64748B]">Chưa có bài viết nào được đăng.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-dot-pattern-light pt-8 pb-12 sm:pt-6 sm:pb-16 border-b-2 border-[#1E293B]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge color="violet" className="font-mono mb-3">
              BÀI VIẾT NỔI BẬT
            </Badge>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#1E293B]">
              DevInsight Blog
            </h1>
          </div>
          <div className="hidden sm:block">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#1E293B] hover:text-[#7C3AED] transition-colors bg-white px-4 py-2 rounded-full border-2 border-[#1E293B] shadow-pop-sm hover:shadow-pop-md"
            >
              Xem tất cả <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.8fr)]">
          {/* Main Hero Post */}
          <article className="overflow-hidden rounded-2xl border-4 border-[#1E293B] bg-white shadow-pop-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-pop-xl group flex flex-col">
            <Link
              href={`/posts/${mainPost.slug}`}
              className="relative block h-48 sm:h-56 lg:h-64 w-full overflow-hidden bg-[#EDE9FE] bg-cover bg-center border-b-4 border-[#1E293B]"
              style={{
                backgroundImage: `url("${mainPost.coverImage ?? fallbackCover}")`,
              }}
              aria-label={`Đọc bài: ${mainPost.title}`}
            >
              <Image
                src={mainPost.coverImage ?? fallbackCover}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 65vw"
                unoptimized={Boolean(mainPost.coverImage)}
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </Link>
            <div className="p-4 sm:p-6 flex flex-col flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold text-[#64748B]">
                <span className="rounded-md bg-[#EDE9FE] px-2 py-1 text-[#6D28D9]">
                  {mainPost.category}
                </span>
                <time dateTime={mainPost.publishedAt}>
                  {mainPost.dateLabel}
                </time>
                {mainPost.featured && (
                  <span className="inline-flex items-center gap-1 text-[#F59E0B]">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </span>
                )}
              </div>
              <Link href={`/posts/${mainPost.slug}`} className="mt-3 block">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight text-[#1E293B] transition-colors group-hover:text-[#7C3AED]">
                  {mainPost.title}
                </h3>
              </Link>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#64748B] line-clamp-2">
                {mainPost.excerpt}
              </p>
              <div className="mt-auto pt-5 flex items-center gap-4 text-xs font-bold text-[#64748B]">
                <span className="inline-flex items-center gap-1.5">
                  <Clock
                    className="h-4 w-4 text-[#7C3AED]"
                    aria-hidden="true"
                  />
                  {mainPost.readingTime}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-[#7C3AED]" aria-hidden="true" />
                  {mainPost.readerCount} lượt xem
                </span>
              </div>
            </div>
          </article>

          {/* Side Stacked Posts */}
          <div className="flex flex-col gap-6">
            {sidePosts.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 rounded-2xl border-4 border-[#1E293B] bg-white p-4 shadow-pop-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-pop-md"
              >
                <Link
                  href={`/posts/${post.slug}`}
                  className="relative h-40 sm:h-28 lg:h-40 xl:h-28 w-full sm:w-32 lg:w-full xl:w-32 shrink-0 overflow-hidden rounded-xl border-2 border-[#1E293B] bg-[#EDE9FE] bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${post.coverImage ?? fallbackCover}")`,
                  }}
                  aria-label={`Đọc bài: ${post.title}`}
                >
                  <Image
                    src={post.coverImage ?? fallbackCover}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 128px, 100vw"
                    unoptimized={Boolean(post.coverImage)}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </Link>
                <div className="flex flex-col flex-1 justify-center min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] sm:text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider">
                      {post.category}
                    </p>
                  </div>
                  <Link href={`/posts/${post.slug}`} className="mt-1.5 block">
                    <h3 className="line-clamp-2 text-base sm:text-sm md:text-base font-extrabold leading-tight text-[#1E293B] group-hover:text-[#7C3AED]">
                      {post.title}
                    </h3>
                  </Link>
                  <div className="mt-2 flex items-center gap-3 text-[11px] font-semibold text-[#64748B]">
                    <span>{post.dateLabel}</span>
                    <span className="inline-flex items-center gap-1">
                      <Eye
                        className="h-3 w-3 text-[#7C3AED]"
                        aria-hidden="true"
                      />
                      {post.readerCount}
                    </span>
                  </div>
                </div>
              </article>
            ))}

            {sidePosts.length === 0 && (
              <div className="flex flex-1 flex-col justify-center items-center rounded-2xl border-4 border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-8 text-center">
                <p className="text-sm font-bold text-[#1E293B]">
                  Đang cập nhật thêm nội dung
                </p>
                <p className="mt-1 text-xs leading-5 text-[#64748B]">
                  Các bài viết mới sẽ sớm xuất hiện tại đây.
                </p>
              </div>
            )}
            <div className="sm:hidden mt-2 text-center">
              <Link
                href="/posts"
                className="inline-flex items-center justify-center gap-2 w-full text-sm font-bold text-[#1E293B] bg-white px-4 py-3 rounded-xl border-2 border-[#1E293B] shadow-pop-sm"
              >
                Xem tất cả bài viết{" "}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
