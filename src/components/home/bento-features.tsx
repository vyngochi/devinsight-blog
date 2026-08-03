import Link from "next/link";
import { ArrowUpRight, BookMarked, Lightbulb, UsersRound } from "lucide-react";
import { StickerCard } from "@/components/ui/sticker-card";

const collections = [
  { title: "Học từng bước", description: "Bài hướng dẫn nhập môn, video ngắn và mẹo thực hành để xây nền tảng vững hơn.", label: "HƯỚNG DẪN", icon: BookMarked, color: "bg-[#8B5CF6] text-white" },
  { title: "Khám phá công nghệ", description: "Ghi chú về xu hướng, công cụ mới và những điều đáng thử trong thế giới phần mềm.", label: "GÓC CÔNG NGHỆ", icon: Lightbulb, color: "bg-[#F472B6] text-white" },
  { title: "Cùng nhau tiến bộ", description: "Câu chuyện học code, kinh nghiệm làm dự án và bài viết đóng góp từ cộng đồng.", label: "CỘNG ĐỒNG", icon: UsersRound, color: "bg-[#34D399] text-[#1E293B]" },
];

export function BentoFeatures() {
  return (
    <section className="w-full bg-[#FFFDF5] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 font-mono text-xs font-bold tracking-wider text-[#8B5CF6]">CHỌN CÁCH BẠN MUỐN HỌC</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1E293B] sm:text-4xl">Nội dung thiết thực cho người đang học và làm phần mềm.</h2>
        </div>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
          {collections.map(({ title, description, label, icon: Icon, color }) => (
            <Link key={title} href="/categories" className="group">
              <StickerCard hoverWiggle={false} shadowColor="default" bg="bg-white" className="h-full p-7 group-hover:-translate-y-1">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#1E293B] ${color}`}><Icon className="w-6 h-6" /></div>
                <p className="mt-7 font-mono text-xs font-bold text-[#64748B]">{label}</p>
                <h3 className="mt-2 text-2xl font-extrabold text-[#1E293B]">{title}</h3>
                <p className="mt-3 leading-relaxed text-[#64748B]">{description}</p>
                <span className="mt-7 inline-flex items-center gap-1 text-sm font-extrabold text-[#8B5CF6]">Xem nội dung <ArrowUpRight className="w-4 h-4" /></span>
              </StickerCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
