"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFDF5]/90 backdrop-blur-md border-b-2 border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#8B5CF6] border-2 border-[#1E293B] shadow-pop-sm flex items-center justify-center text-white font-extrabold text-xl group-hover:rotate-6 transition-transform">
            D<span className="text-[#FBBF24]">I</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-[#1E293B] flex items-center gap-1">
              DevInsight
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FBBF24] text-[#1E293B] border border-[#1E293B] font-mono font-bold">
                .io.vn
              </span>
            </span>
            <span className="text-[11px] font-medium text-[#64748B] tracking-wide">
              Học code, chia sẻ thật
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-bold text-sm text-[#1E293B]">
          <Link
            href="/"
            className="hover:text-[#8B5CF6] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#8B5CF6]"
          >
            Trang Chủ
          </Link>
          <Link
            href="/posts"
            className="hover:text-[#8B5CF6] transition-colors py-1"
          >
            Bài Viết
          </Link>
          <Link
            href="/categories"
            className="hover:text-[#8B5CF6] transition-colors py-1"
          >
            Chủ Đề
          </Link>
          <Link
            href="/about"
            className="hover:text-[#8B5CF6] transition-colors py-1"
          >
            Về DevInsight
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Quick Search Button */}
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border-2 border-[#1E293B] shadow-pop-sm hover:bg-[#F1F5F9] text-xs font-semibold text-[#64748B] transition-all"
            aria-label="Tìm kiếm"
          >
            <Search className="w-4 h-4 text-[#1E293B]" strokeWidth={2.5} />
            <span className="hidden md:inline">Tìm kiếm...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#F1F5F9] border border-[#1E293B] rounded">
              ⌘K
            </kbd>
          </button>

          <Link href="/posts">
            <Button
              variant="primary"
              size="sm"
              icon={<Sparkles className="w-4 h-4" strokeWidth={2.5} />}
            >
              Đọc bài mới
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white border-2 border-[#1E293B] shadow-pop-sm text-[#1E293B]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" strokeWidth={2.5} />
            ) : (
              <Menu className="w-6 h-6" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t-2 border-[#1E293B] bg-[#FFFDF5] p-6 flex flex-col gap-4 shadow-pop-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-lg text-[#1E293B] py-2 border-b border-[#E2E8F0]"
          >
            Trang Chủ
          </Link>
          <Link
            href="/posts"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-lg text-[#1E293B] py-2 border-b border-[#E2E8F0]"
          >
            Tất Cả Bài Viết
          </Link>
          <Link
            href="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-lg text-[#1E293B] py-2 border-b border-[#E2E8F0]"
          >
            Khám phá chủ đề
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-lg text-[#1E293B] py-2 border-b border-[#E2E8F0]"
          >
            Về DevInsight
          </Link>
          <div className="pt-2 flex flex-col gap-3">
            <Link href="/posts" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full">
                Khám Phá Bài Viết
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
