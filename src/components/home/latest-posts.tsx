"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Eye, Sparkles } from "lucide-react";
import { StickerCard } from "@/components/ui/sticker-card";
import { Button, Badge } from "@/components/ui/button";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  badgeColor: "violet" | "pink" | "yellow" | "mint";
  readTime: string;
  views: string;
  date: string;
  featured?: boolean;
}

const posts: Post[] = [
  {
    id: "1",
    slug: "lo-trinh-hoc-javascript",
    title: "Lộ trình học JavaScript cho người mới: nên bắt đầu từ đâu?",
    excerpt:
      "Một kế hoạch học gọn gàng, từ biến và hàm đến DOM, async/await và cách tự làm dự án nhỏ để kiểm tra kiến thức.",
    category: "Học tập",
    badgeColor: "violet",
    readTime: "7 phút",
    views: "1.2k",
    date: "02/08/2026",
    featured: true,
  },
  {
    id: "2",
    slug: "git-co-ban-cho-sinh-vien",
    title: "Git cơ bản cho sinh viên: 6 lệnh cần dùng trong dự án nhóm",
    excerpt:
      "Hiểu đúng add, commit, pull, branch và pull request để làm nhóm bớt rối, không còn sợ xung đột code.",
    category: "Mẹo nhanh",
    badgeColor: "pink",
    readTime: "5 phút",
    views: "986",
    date: "30/07/2026",
  },
  {
    id: "3",
    slug: "tai-nguyen-luyen-code",
    title: "10 tài nguyên miễn phí giúp bạn luyện code có định hướng",
    excerpt:
      "Danh sách tài liệu, nền tảng luyện tập và roadmap phù hợp khi bạn muốn học đều nhưng chưa biết chọn nguồn nào.",
    category: "Tài nguyên",
    badgeColor: "yellow",
    readTime: "6 phút",
    views: "1.5k",
    date: "26/07/2026",
  },
  {
    id: "4",
    slug: "tin-cong-nghe-thang-7",
    title: "Điểm tin công nghệ: những cập nhật lập trình viên nên theo dõi",
    excerpt:
      "Tóm tắt ngắn các công cụ, framework và xu hướng nổi bật, kèm góc nhìn về điều gì thật sự đáng để thử.",
    category: "Khám phá",
    badgeColor: "mint",
    readTime: "8 phút",
    views: "731",
    date: "22/07/2026",
  },
];

const categories = ["Tất cả", "Học tập", "Mẹo nhanh", "Tài nguyên", "Khám phá"];

export function LatestPosts() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const filteredPosts =
    activeCategory === "Tất cả"
      ? posts
      : posts.filter((post) => post.category === activeCategory);
  return (
    <section className="w-full border-t-2 border-[#1E293B] bg-[#F1F5F9] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Badge color="pink" className="font-mono">
              MỚI CẬP NHẬT
            </Badge>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#1E293B] sm:text-4xl">
              Bài viết mới để học và làm tốt hơn mỗi ngày.
            </h2>
          </div>
          <div
            className="flex flex-wrap gap-2"
            aria-label="Lọc bài viết theo chủ đề"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border-2 border-[#1E293B] px-4 py-2 text-xs font-bold transition-colors ${activeCategory === category ? "bg-[#1E293B] text-white" : "bg-white text-[#1E293B] hover:bg-[#FBBF24]"}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <StickerCard
              key={post.id}
              shadowColor={post.badgeColor}
              bg="bg-white"
              className="flex min-h-72 flex-col justify-between p-7 border-4"
              badge={
                post.featured ? (
                  <span className="rounded-full border-2 border-[#1E293B] bg-[#FBBF24] px-3 py-1 font-mono text-xs font-bold text-[#1E293B] shadow-pop-sm">
                    NÊN ĐỌC
                  </span>
                ) : undefined
              }
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <Badge color={post.badgeColor}>{post.category}</Badge>
                  <span className="font-mono text-xs font-bold text-[#64748B]">
                    {post.date}
                  </span>
                </div>
                <Link href={`/posts/${post.slug}`} className="group">
                  <h3 className="mt-5 text-2xl font-extrabold leading-snug text-[#1E293B] transition-colors group-hover:text-[#8B5CF6]">
                    {post.title}
                  </h3>
                </Link>
                <p className="mt-3 leading-relaxed text-[#64748B]">
                  {post.excerpt}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t-2 border-[#F1F5F9] pt-5 text-xs font-bold text-[#64748B]">
                <span className="flex gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-[#8B5CF6]" />
                    {post.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-[#8B5CF6]" />
                    {post.views}
                  </span>
                </span>
                <Link
                  href={`/posts/${post.slug}`}
                  className="inline-flex items-center gap-1 text-[#8B5CF6] hover:underline"
                >
                  Đọc bài <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </StickerCard>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/posts">
            <Button
              variant="outline"
              size="lg"
              icon={<Sparkles className="w-5 h-5 text-[#8B5CF6]" />}
            >
              Xem tất cả bài viết
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
