"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  LayoutDashboard,
  Menu,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { AuthModal } from "@/components/auth/auth-modal";
import { UserAvatar } from "@/components/auth/user-avatar";
import { GlobalSearchModal } from "@/components/search/global-search-modal";
import { Button } from "@/components/ui/button";

const primaryLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/posts", label: "Bài viết" },
  { href: "/community", label: "Cộng đồng" },
  { href: "/resources", label: "Tài nguyên" },
] as const;

const secondaryLinks = [{ href: "/about", label: "Về DevInsight" }] as const;

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const isActive = (href: string) =>
    href === "/"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);
  const desktopLinkClass = (active: boolean) =>
    `relative whitespace-nowrap py-1 text-sm font-bold transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#8B5CF6] ${active ? "text-[#8B5CF6] after:w-full" : "text-[#1E293B] after:w-0 hover:text-[#8B5CF6] hover:after:w-full"}`;
  const mobileLinkClass = (active: boolean) =>
    `border-b border-[#E2E8F0] py-3 text-base font-bold sm:py-2 sm:text-sm ${active ? "text-[#8B5CF6]" : "text-[#1E293B] hover:text-[#8B5CF6]"}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-[#1E293B] bg-[#FFFDF5]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-start gap-3 px-4 sm:px-6 lg:px-8 xl:justify-between">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <Image
            src="/Brand/Logo.png"
            alt="DevInsight"
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-xl border-2 border-[#1E293B] object-cover shadow-pop-sm"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="truncate text-lg font-extrabold tracking-tight text-[#1E293B]">
                DevInsight
              </span>
              <span className="hidden rounded-full border border-[#1E293B] bg-[#FBBF24] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#1E293B] sm:inline">
                .io.vn
              </span>
            </div>
            <span className="block truncate text-[11px] font-medium text-[#64748B]">
              Học code, chia sẻ thật
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-5 xl:flex">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={desktopLinkClass(isActive(link.href))}
            >
              {link.label}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              onFocus={() => setMoreOpen(true)}
              onBlur={() => setMoreOpen(false)}
              aria-expanded={moreOpen}
              className={`${desktopLinkClass(secondaryLinks.some((link) => isActive(link.href)))} inline-flex items-center gap-1`}
            >
              Thêm{" "}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`}
              />
            </button>
            {moreOpen ? (
              <div className="absolute right-0 top-8 w-44 rounded-xl border-2 border-[#1E293B] bg-white p-1.5 shadow-pop-lg">
                {secondaryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMoreOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-sm font-bold ${isActive(link.href) ? "bg-[#EDE9FE] text-[#6D28D9]" : "text-[#1E293B] hover:bg-[#F1F5F9]"}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </nav>
        <div className="ml-auto hidden items-center gap-2 sm:flex xl:ml-0">
          <button
            type="button"
            onClick={() => setGlobalSearchOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-lg border-2 border-[#1E293B] bg-white px-2.5 text-xs font-semibold text-[#64748B] shadow-pop-sm hover:bg-[#F1F5F9]"
            aria-label="Tìm kiếm"
          >
            <Search className="h-4 w-4 text-[#1E293B]" />
            <span className="hidden 2xl:inline">Tìm kiếm</span>
          </button>
          {session?.user ? (
            <>
              <Link
                href="/profile"
                aria-label="Hồ sơ cá nhân"
                title="Hồ sơ cá nhân"
                className="rounded-full focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:ring-offset-2"
              >
                <UserAvatar
                  name={session.user.name}
                  email={session.user.email}
                  image={session.user.image}
                  size="sm"
                />
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Đăng xuất
              </Button>
              {session.user.role !== "USER" ? (
                <Link
                  href="/admin"
                  title="Trang quản trị"
                  aria-label="Trang quản trị"
                  className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#1E293B] bg-[#FBBF24] text-[#1E293B] shadow-pop-sm hover:-translate-y-0.5"
                >
                  <LayoutDashboard className="h-4 w-4" />
                </Link>
              ) : null}
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAuthModalOpen(true)}
            >
              Đăng nhập
            </Button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((value) => !value)}
          className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 border-[#1E293B] bg-white text-[#1E293B] shadow-pop-sm sm:ml-0 xl:hidden"
          aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>
      {mobileMenuOpen ? (
        <div className="border-t-2 border-[#1E293B] bg-[#FFFDF5] px-6 pb-6 pt-3 sm:absolute sm:right-6 sm:top-full sm:mt-2 sm:w-80 sm:rounded-xl sm:border-2 sm:p-4 sm:shadow-pop-lg lg:right-8 xl:hidden">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setGlobalSearchOpen(true);
            }}
            className="mb-2 flex w-full items-center gap-2 rounded-lg border-2 border-[#1E293B] bg-white px-3 py-2.5 text-left text-sm font-bold text-[#475569]"
          >
            <Search className="h-4 w-4 text-[#1E293B]" />
            Tìm kiếm toàn trang
          </button>
          <nav className="flex flex-col">
            {[...primaryLinks, ...secondaryLinks].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={mobileLinkClass(isActive(link.href))}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 flex flex-col gap-3">
            {session?.user ? (
              <>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full"
                    icon={<UserRound className="h-4 w-4" />}
                  >
                    Hồ sơ cá nhân
                  </Button>
                </Link>
                {session.user.role === "ADMIN" ? (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="tertiary"
                      className="w-full"
                      icon={<LayoutDashboard className="h-4 w-4" />}
                    >
                      Trang quản trị
                    </Button>
                  </Link>
                ) : null}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Đăng xuất
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
              >
                Đăng nhập
              </Button>
            )}
            <Link href="/posts" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full">
                Đọc bài mới
              </Button>
            </Link>
          </div>
        </div>
      ) : null}
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <GlobalSearchModal
        open={globalSearchOpen}
        onOpen={() => setGlobalSearchOpen(true)}
        onClose={() => setGlobalSearchOpen(false)}
      />
    </header>
  );
}
