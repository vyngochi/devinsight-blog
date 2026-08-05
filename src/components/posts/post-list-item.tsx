import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Eye } from "lucide-react";
import type { PostListItem as PostListItemData } from "@/features/content/server/post-listing.service";

const numberFormat = new Intl.NumberFormat("vi-VN");
const fallbackCover = "/images/posts/devinsight-cover-fallback.png";

export function PostListItem({ post }: { post: PostListItemData }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#CBD5E1] bg-white transition-colors hover:border-[#A78BFA]">
      <Link
        href={`/posts/${post.slug}`}
        className="relative block aspect-[16/9] overflow-hidden bg-[#EDE9FE] bg-cover bg-center"
        aria-label={`Đọc bài: ${post.title}`}
        style={{ backgroundImage: `url("${post.coverImage ?? fallbackCover}")` }}
      >
        <Image
          src={post.coverImage ?? fallbackCover}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={Boolean(post.coverImage)}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex items-center justify-between gap-2 text-[10px] font-bold">
          <span className="rounded-md bg-[#EDE9FE] px-2 py-1 text-[#6D28D9]">
            {post.category}
          </span>
          <time className="shrink-0 text-[#64748B]" dateTime={post.publishedAt}>
            {post.dateLabel}
          </time>
        </div>

        <Link href={`/posts/${post.slug}`} className="mt-3 block">
          <h2 className="line-clamp-2 text-sm font-extrabold leading-5 text-[#1E293B] group-hover:text-[#6D28D9] sm:text-base">
            {post.title}
          </h2>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[#64748B]">
          {post.excerpt}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 text-[11px] font-semibold text-[#64748B]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Clock
                className="h-3.5 w-3.5 text-[#7C3AED]"
                aria-hidden="true"
              />
              {post.readingTime}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 text-[#7C3AED]" aria-hidden="true" />
              {numberFormat.format(post.readerCount)}
            </span>
          </div>

          <Link
            href={`/posts/${post.slug}`}
            className="inline-flex items-center gap-1 font-bold text-[#6D28D9] hover:underline"
          >
            Đọc <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
