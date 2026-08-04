"use client";

import Link from "next/link";
import {
  BarChart3,
  FileArchive,
  FileText,
  Flag,
  Settings,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Tổng quan", icon: BarChart3, exact: true },
  { href: "/admin/users", label: "Người dùng", icon: Users },
  { href: "/admin/posts", label: "Bài viết", icon: FileText },
  { href: "/admin/community", label: "Kiểm duyệt", icon: Flag },
  { href: "/admin/settings", label: "Cấu hình", icon: Settings },
  { href: "/admin/resources", label: "Tài nguyên", icon: FileArchive },
];

export function AdminNavigation() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2 overflow-x-auto p-3 md:flex-col md:overflow-visible md:p-0">
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${active ? "bg-[#8B5CF6] text-white shadow-pop-sm" : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#1E293B]"}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
