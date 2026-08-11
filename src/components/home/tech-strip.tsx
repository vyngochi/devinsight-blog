import Link from "next/link";
import { BookOpen, Compass, FolderOpen, UsersRound } from "lucide-react";

const topics = [
  {
    name: "Khám phá",
    description: "Công nghệ và góc nhìn mới",
    icon: Compass,
    color: "bg-[#F472B6]",
  },
  {
    name: "Tài nguyên",
    description: "Công cụ, roadmap, tài liệu",
    icon: FolderOpen,
    color: "bg-[#FBBF24] text-[#1E293B]",
  },
  {
    name: "Cộng đồng",
    description: "Chia sẻ từ người học code",
    icon: UsersRound,
    color: "bg-[#34D399] text-[#1E293B]",
  },
];

export function TechStrip() {
  return (
    <section
      id="chu-de"
      className="w-full border-y-2 border-[#1E293B] bg-[#1E293B] py-7 text-white flex items-center"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map(({ name, description, icon: Icon, color }) => (
            <Link
              key={name}
              href="/categories"
              className="group flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 p-4 transition-colors hover:border-white"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#1E293B] ${color}`}
              >
                <Icon className="w-5 h-5" />
              </span>
              <span>
                <span className="block font-extrabold">{name}</span>
                <span className="block text-xs text-slate-300">
                  {description}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
