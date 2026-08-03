"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Sparkles, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFDF5]/90 backdrop-blur-md border-b-2 border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/Brand/Logo.png"
            alt="DevInsight Logo"
            width={40}
            height={40}
            className="w-10 h-10 rounded-xl border-2 border-[#1E293B] shadow-pop-sm object-cover group-hover:rotate-6 transition-transform"
          />
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

          {/* "Học tập" Dropdown Menu */}
          <div className="relative group py-5">
            <button className="flex items-center gap-1.5 hover:text-[#8B5CF6] transition-colors py-1 cursor-pointer font-bold">
              <span>Học tập</span>
              <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 text-[#64748B] group-hover:text-[#8B5CF6]" />
            </button>

            {/* Dropdown Card */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-95 bg-white border-2 border-[#1E293B] rounded-2xl shadow-pop-lg p-3.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#64748B] px-3 py-1.5 border-b border-[#E2E8F0] mb-2 flex items-center justify-between">
                <span>Chủ đề kiến thức</span>
                <span className="text-[#8B5CF6]">DevInsight</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/categories/react"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#F1F5F9] border border-transparent hover:border-[#1E293B] transition-all group/item"
                >
                  <span className="px-2.5 h-8 min-w-9 w-auto rounded-lg bg-[#8B5CF6] text-white flex items-center justify-center font-mono font-bold text-xs border border-[#1E293B] shrink-0 group-hover/item:scale-105 transition-transform">
                    React
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-extrabold text-[#1E293B] truncate">
                      React
                    </span>
                    <span className="text-[10px] text-[#64748B] font-medium truncate">
                      UI Components
                    </span>
                  </div>
                </Link>

                <Link
                  href="/categories/javascript"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#F1F5F9] border border-transparent hover:border-[#1E293B] transition-all group/item"
                >
                  <span className="px-2.5 h-8 min-w-9 w-auto rounded-lg bg-[#FBBF24] text-[#1E293B] flex items-center justify-center font-mono font-bold text-xs border border-[#1E293B] shrink-0 group-hover/item:scale-105 transition-transform">
                    JS
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-extrabold text-[#1E293B] truncate">
                      JavaScript
                    </span>
                    <span className="text-[10px] text-[#64748B] font-medium truncate">
                      Core & Async
                    </span>
                  </div>
                </Link>

                <Link
                  href="/categories/csharp"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#F1F5F9] border border-transparent hover:border-[#1E293B] transition-all group/item"
                >
                  <span className="px-2.5 h-8 min-w-9 w-auto rounded-lg bg-[#F472B6] text-white flex items-center justify-center font-mono font-bold text-xs border border-[#1E293B] shrink-0 group-hover/item:scale-105 transition-transform">
                    C#
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-extrabold text-[#1E293B] truncate">
                      C# / .NET
                    </span>
                    <span className="text-[10px] text-[#64748B] font-medium truncate">
                      OOP & Backend
                    </span>
                  </div>
                </Link>

                <Link
                  href="/categories/git"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#F1F5F9] border border-transparent hover:border-[#1E293B] transition-all group/item"
                >
                  <span className="px-2.5 h-8 min-w-9 w-auto rounded-lg bg-[#34D399] text-[#1E293B] flex items-center justify-center font-mono font-bold text-xs border border-[#1E293B] shrink-0 group-hover/item:scale-105 transition-transform">
                    Git
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-extrabold text-[#1E293B] truncate">
                      Git / GitHub
                    </span>
                    <span className="text-[10px] text-[#64748B] font-medium truncate">
                      Quản lý Code
                    </span>
                  </div>
                </Link>

                <Link
                  href="/categories/python"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#F1F5F9] border border-transparent hover:border-[#1E293B] transition-all group/item"
                >
                  <span className="px-2.5 h-8 min-w-9 w-auto rounded-lg bg-[#38BDF8] text-[#1E293B] flex items-center justify-center font-mono font-bold text-xs border border-[#1E293B] shrink-0 group-hover/item:scale-105 transition-transform">
                    Py
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-extrabold text-[#1E293B] truncate">
                      Python
                    </span>
                    <span className="text-[10px] text-[#64748B] font-medium truncate">
                      Cơ bản & Script
                    </span>
                  </div>
                </Link>

                <Link
                  href="/categories/nextjs"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#F1F5F9] border border-transparent hover:border-[#1E293B] transition-all group/item"
                >
                  <span className="px-2.5 h-8 min-w-9 w-auto rounded-lg bg-[#1E293B] text-white flex items-center justify-center font-mono font-bold text-xs border border-[#1E293B] shrink-0 group-hover/item:scale-105 transition-transform">
                    Next
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-extrabold text-[#1E293B] truncate">
                      Next.js
                    </span>
                    <span className="text-[10px] text-[#64748B] font-medium truncate">
                      App Router
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

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
            <Button variant="primary" size="sm">
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
          <div className="py-2 border-b border-[#E2E8F0]">
            <span className="font-bold text-lg text-[#1E293B] block mb-2">
              Học tập
            </span>
            <div className="grid grid-cols-2 gap-2 pl-2">
              <Link
                href="/categories/react"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-[#8B5CF6] flex items-center gap-1.5 p-1.5 rounded-lg bg-white border border-[#1E293B]"
              >
                React
              </Link>
              <Link
                href="/categories/javascript"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-[#1E293B] flex items-center gap-1.5 p-1.5 rounded-lg bg-[#FBBF24] border border-[#1E293B]"
              >
                JavaScript
              </Link>
              <Link
                href="/categories/csharp"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-[#F472B6] flex items-center gap-1.5 p-1.5 rounded-lg bg-white border border-[#1E293B]"
              >
                C# / .NET
              </Link>
              <Link
                href="/categories/git"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-[#1E293B] flex items-center gap-1.5 p-1.5 rounded-lg bg-[#34D399] border border-[#1E293B]"
              >
                Git / GitHub
              </Link>
              <Link
                href="/categories/python"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-[#0284C7] flex items-center gap-1.5 p-1.5 rounded-lg bg-white border border-[#1E293B]"
              >
                Python
              </Link>
              <Link
                href="/categories/nextjs"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-white flex items-center gap-1.5 p-1.5 rounded-lg bg-[#1E293B]"
              >
                Next.js
              </Link>
            </div>
          </div>
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
