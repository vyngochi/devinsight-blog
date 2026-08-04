"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full bg-[#1E293B] text-white border-t-4 border-[#1E293B] pt-16 pb-12 relative overflow-hidden">
      {/* Decorative SVG Shapes in Footer */}
      <div className="absolute top-8 left-10 w-16 h-16 rounded-full bg-[#8B5CF6]/20 border border-white/10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-[#FBBF24]/20 border border-white/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-slate-700">
          {/* Column 1: Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/Brand/Logo.png"
                alt="DevInsight Logo"
                width={40}
                height={40}
                className="w-10 h-10 rounded-xl border-2 border-white shadow-pop-sm object-cover"
              />
              <span className="font-extrabold text-2xl tracking-tight text-white">
                DevInsight<span className="text-[#FBBF24]">.io.vn</span>
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-md">
              Blog kỹ thuật do sinh viên xây dựng, nơi chia sẻ kiến thức lập
              trình, tài nguyên học tập, tin công nghệ và trải nghiệm làm dự án.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="font-extrabold text-base text-[#FBBF24] uppercase tracking-wider font-mono">
              Chủ Đề Nổi Bật
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-300">
              <li>
                <Link
                  href="/posts"
                  className="hover:text-[#FBBF24] transition-colors"
                >
                  Hướng dẫn cho người mới
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="hover:text-[#FBBF24] transition-colors"
                >
                  Mẹo nhanh khi làm dự án
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="hover:text-[#FBBF24] transition-colors"
                >
                  Tài nguyên học lập trình
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="hover:text-[#FBBF24] transition-colors"
                >
                  Tin và góc nhìn công nghệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links & Community */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <h4 className="font-extrabold text-base text-[#F472B6] uppercase tracking-wider font-mono">
              Liên Kết & Cộng Đồng
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-300">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#F472B6] transition-colors"
                >
                  Về DevInsight
                </Link>
              </li>
              <li>
                <Link
                  href="/rss.xml"
                  className="hover:text-[#F472B6] transition-colors"
                >
                  RSS Feed bài viết mới
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#F472B6] transition-colors"
                >
                  GitHub & đóng góp nội dung
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} DevInsight. All rights reserved.</p>
          <p className="text-center sm:text-right leading-relaxed">
            Được thực hiện bởi{" "}
            <Link
              href="https://github.com/vyngochi"
              target="_blank"
              rel="noreferrer"
              className="text-[#F472B6]"
            >
              Ngô Chí Vỹ
            </Link>{" "}
            dành cho cộng đồng học lập trình Việt Nam.
          </p>
        </div>
      </div>
    </footer>
  );
}
