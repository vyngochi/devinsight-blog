"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD") // Remove accents
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9 -]/g, "") // Remove invalid chars
    .replace(/\s+/g, "-") // Collapse whitespace and replace by -
    .replace(/-+/g, "-"); // Collapse dashes
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Tìm container bài viết
    const articleContainer = document.getElementById("article-content");
    if (!articleContainer) return;

    // Lấy tất cả h2, h3
    const elements = Array.from(articleContainer.querySelectorAll("h2, h3"));

    if (elements.length === 0) return;

    const items: TocItem[] = elements.map((el) => {
      if (!el.id) {
        el.id = slugify(el.textContent || "section");
      }
      return {
        id: el.id,
        text: el.textContent || "",
        level: Number(el.tagName.substring(1)), // 2 hoặc 3
      };
    });

    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -60% 0px", // Margin cho vùng nhìn thấy (trigger ở phần trên cùng)
      },
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  if (headings.length === 0) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100; // Offset cho header
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-24 space-y-4 rounded-xl border border-[#CBD5E1] bg-white p-5 shadow-sm hidden lg:block">
      <h3 className="text-sm font-extrabold text-[#1E293B] uppercase tracking-wider">
        Mục lục
      </h3>
      <ul className="flex flex-col gap-2.5 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`transition-colors ${heading.level === 3 ? "ml-4" : ""}`}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={`block leading-snug hover:text-[#6D28D9] ${
                activeId === heading.id
                  ? "font-bold text-[#6D28D9]"
                  : "font-medium text-[#64748B]"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
