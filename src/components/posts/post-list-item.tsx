import Link from "next/link";
import { ArrowRight, Clock, Eye, GraduationCap, UserRound } from "lucide-react";
import type { PostListItem as PostListItemData } from "@/features/content/server/post-listing.service";
import { Badge } from "@/components/ui/button";

const numberFormat = new Intl.NumberFormat("vi-VN");

export function PostListItem({ post }: { post: PostListItemData }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border-2 border-[#1E293B] bg-white p-4 shadow-pop sm:p-5">
      <div>
        <div className="flex items-center justify-between gap-2">
          <Badge color={post.badgeColor}>{post.category}</Badge>
          <time
            className="shrink-0 text-[11px] font-bold text-[#64748B]"
            dateTime={post.publishedAt}
          >
            {post.dateLabel}
          </time>
        </div>
        <Link href={`/posts/${post.slug}`} className="mt-3 block">
          <h2 className="text-base font-extrabold leading-snug text-[#1E293B] hover:text-[#7C3AED] sm:text-lg">
            {post.title}
          </h2>
        </Link>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#64748B]">
          {post.excerpt}
        </p>
      </div>

      <div className="mt-4 border-t-2 border-[#E2E8F0] pt-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#64748B]">
          <span className="inline-flex items-center gap-1 font-semibold">
            <UserRound
              className="h-3.5 w-3.5 text-[#8B5CF6]"
              aria-hidden="true"
            />
            {post.author.name}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold">
            <Clock className="h-3.5 w-3.5 text-[#8B5CF6]" aria-hidden="true" />
            {post.readingTime}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#475569]">
            <Eye className="h-3.5 w-3.5 text-[#8B5CF6]" aria-hidden="true" />
            {numberFormat.format(post.readerCount)}
          </span>
          <Link
            href={`/posts/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-extrabold text-[#7C3AED] hover:underline"
          >
            Đọc bài
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
