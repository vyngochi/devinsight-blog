import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";

export type RelatedPostItem = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  readingTime: number;
  category: string;
};

export function RelatedPosts({ posts }: { posts: RelatedPostItem[] }) {
  if (!posts.length) return null;
  return (
    <section className="mt-12 border-t-2 border-[#1E293B] pt-8" aria-labelledby="related-posts-title">
      <div className="flex items-end justify-between gap-4"><div><p className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#8B5CF6]">ĐỌC TIẾP</p><h2 id="related-posts-title" className="mt-2 text-2xl font-extrabold text-[#1E293B]">Bài viết liên quan</h2></div><span className="hidden text-xs font-bold text-[#64748B] sm:block">Kéo ngang để xem thêm</span></div>
      <div className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
        {posts.map((post) => (
          <article key={post.slug} className="w-[82vw] max-w-sm shrink-0 snap-start overflow-hidden rounded-xl border-2 border-[#1E293B] bg-white shadow-pop-sm sm:w-80">
            {post.coverImage ? <Image src={post.coverImage} alt="" width={640} height={320} unoptimized className="aspect-[16/8] w-full object-cover" /> : <div className="aspect-[16/8] bg-dot-pattern-light" />}
            <div className="p-4"><div className="flex items-center gap-2 text-[10px] font-bold text-[#64748B]"><span className="text-[#7C3AED]">{post.category}</span><span>·</span><Clock className="h-3 w-3" /><span>{post.readingTime} phút</span></div><h3 className="mt-2 line-clamp-2 text-base font-extrabold leading-6 text-[#1E293B]">{post.title}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-[#64748B]">{post.excerpt}</p><Link href={"/posts/" + post.slug} className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-[#6D28D9] hover:underline">Đọc bài viết <ArrowRight className="h-3.5 w-3.5" /></Link></div>
          </article>
        ))}
      </div>
    </section>
  );
}
