"use client";

import Link from "next/link";
import { BarChart3, FileArchive, FileText, Flag, Mail, Newspaper, Settings, Users, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import type { user_role } from "@/generated/prisma/client";
import type { AuthorPermissions } from "@/features/admin/server/author-permissions";

type NavigationItem = { href: string; label: string; icon: LucideIcon; exact?: boolean; adminOnly?: boolean; permission?: keyof AuthorPermissions };
const items: NavigationItem[] = [
  { href: "/admin", label: "Tổng quan", icon: BarChart3, exact: true, permission: "viewOwnAnalytics" },
  { href: "/admin/users", label: "Người dùng", icon: Users, adminOnly: true },
  { href: "/admin/newsletter", label: "Nhận tin", icon: Mail, adminOnly: true },
  { href: "/admin/posts", label: "Bài viết", icon: FileText, permission: "writePosts" },
  { href: "/admin/news", label: "Tin tức", icon: Newspaper, permission: "writeNews" },
  { href: "/admin/community", label: "Kiểm duyệt", icon: Flag, permission: "moderateCommunity" },
  { href: "/admin/settings", label: "Cấu hình", icon: Settings, adminOnly: true },
  { href: "/admin/resources", label: "Tài nguyên", icon: FileArchive, permission: "manageResources" },
];

export function AdminNavigation({ role, permissions }: { role: user_role; permissions?: AuthorPermissions }) {
  const pathname = usePathname();
  const visibleItems = items.filter((item) => role === "ADMIN" || (!item.adminOnly && (!item.permission || permissions?.[item.permission])));
  return <nav className="flex gap-2 overflow-x-auto p-3 md:flex-col md:overflow-visible md:p-0">{visibleItems.map(({ href, label, icon: Icon, exact }) => {
    const active = exact ? pathname === href : pathname.startsWith(href);
    return <Link key={href} href={href} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${active ? "bg-[#8B5CF6] text-white shadow-pop-sm" : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#1E293B]"}`}><Icon className="h-4 w-4" />{label}</Link>;
  })}</nav>;
}
