import Link from "next/link";
import { ArrowRight, BookOpen, Code2, Newspaper } from "lucide-react";
import { Button, Badge } from "@/components/ui/button";
import { StickerCard } from "@/components/ui/sticker-card";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-dot-pattern-light py-12 md:py-20">
      <div className="absolute -right-12 top-12 hidden h-32 w-32 rounded-full border-2 border-[#1E293B] bg-[#FBBF24] shadow-pop-lg lg:block" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            <Badge color="violet" className="font-mono">
              BLOG KỸ THUẬT DÀNH CHO SINH VIÊN
            </Badge>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-[#1E293B] sm:text-5xl lg:text-6xl">
              Chia sẻ kiến thức lập trình "mì ăn liền"
            </h1>
            <p className="max-w-2xl text-lg font-medium leading-relaxed text-[#64748B] sm:text-xl">
              DevInsight chia sẻ kiến thức nền tảng, hướng dẫn thực hành, tin
              công nghệ và tài nguyên hữu ích cho hành trình trở thành kỹ sư
              phần mềm.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link href="/posts">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" strokeWidth={2.5} />}
                >
                  Đọc bài mới nhất
                </Button>
              </Link>
              <Link href="#chu-de">
                <Button variant="outline" size="lg">
                  Khám phá chủ đề
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <StickerCard
              shadowColor="yellow"
              bg="bg-white"
              className="p-6 sm:p-8 border-4"
            >
              <div className="flex items-center justify-between border-b-2 border-[#1E293B] pb-4">
                <span className="font-mono text-xs font-bold text-[#64748B]">
                  BẮT ĐẦU TỪ ĐÂY
                </span>
                <span className="rounded-full bg-[#34D399] px-3 py-1 text-xs font-bold text-[#1E293B]">
                  MIỄN PHÍ
                </span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#1E293B] bg-[#8B5CF6] text-white">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-[#1E293B]">
                      Học tập có lộ trình
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-[#64748B]">
                      Hướng dẫn, video và mẹo nhanh để bạn học đều mỗi ngày.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#1E293B] bg-[#F472B6] text-white">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-[#1E293B]">
                      Code có ngữ cảnh
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-[#64748B]">
                      Ví dụ nhỏ, giải thích rõ và gợi ý cách tự mở rộng.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#1E293B] bg-[#FBBF24] text-[#1E293B]">
                    <Newspaper className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-[#1E293B]">
                      Theo dõi điều đáng biết
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-[#64748B]">
                      Chọn lọc tin và xu hướng công nghệ đáng để sinh viên quan
                      tâm.
                    </p>
                  </div>
                </div>
              </div>
            </StickerCard>
          </div>
        </div>
      </div>
    </section>
  );
}
