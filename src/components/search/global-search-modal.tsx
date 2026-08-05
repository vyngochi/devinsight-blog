"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FileText, LoaderCircle, MessageSquare, Search, X } from "lucide-react";

type SearchResult = {
  id: string;
  type: "Bài viết" | "Tài nguyên" | "Cộng đồng";
  title: string;
  description: string;
  meta: string;
  href: string;
};

type GlobalSearchModalProps = {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
};

function ResultIcon({ type }: { type: SearchResult["type"] }) {
  return type === "Cộng đồng" ? (
    <MessageSquare className="h-4 w-4" />
  ) : (
    <FileText className="h-4 w-4" />
  );
}

export function GlobalSearchModal({
  open,
  onClose,
  onOpen,
}: GlobalSearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpen();
      }
      if (event.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onOpen, open]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setStatus("loading");
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}`,
          {
            signal: controller.signal,
            cache: "no-store",
          },
        );
        const data = (await response.json()) as { results?: SearchResult[] };
        if (!response.ok) throw new Error("Search unavailable");
        setResults(data.results ?? []);
        setStatus("idle");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setStatus("error");
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  if (!open || typeof document === "undefined") return null;
  const hasQuery = query.trim().length >= 2;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-[#0F172A]/55 px-4 py-10 sm:py-20"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Tìm kiếm toàn trang"
        className="w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-[#1E293B] bg-white shadow-pop-lg dark:border-slate-600 dark:bg-slate-900"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b-2 border-[#1E293B] px-4 py-3 dark:border-slate-600">
          <Search className="h-5 w-5 shrink-0 text-[#6D28D9]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm bài viết, tài nguyên, câu hỏi..."
            className="min-w-0 flex-1 bg-transparent text-base font-semibold text-[#1E293B] outline-none placeholder:text-[#94A3B8] dark:text-white"
          />
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-[#475569] hover:bg-[#F1F5F9] dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Đóng tìm kiếm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[60dvh] overflow-y-auto p-2">
          {!hasQuery ? (
            <div className="px-4 py-10 text-center">
              <Search className="mx-auto h-8 w-8 text-[#A78BFA]" />
              <p className="mt-3 font-extrabold text-[#1E293B] dark:text-white">
                Tìm mọi nội dung trên DevInsight
              </p>
              <p className="mt-1 text-sm text-[#64748B] dark:text-slate-300">
                Nhập ít nhất 2 ký tự để tìm trong bài viết, tài nguyên và cộng
                đồng.
              </p>
            </div>
          ) : status === "loading" ? (
            <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm font-semibold text-[#64748B]">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Đang tìm kiếm
            </div>
          ) : status === "error" ? (
            <p
              role="alert"
              className="px-4 py-10 text-center text-sm font-semibold text-[#BE123C]"
            >
              Tìm kiếm đang tạm thời không khả dụng. Hãy thử lại sau.
            </p>
          ) : results.length ? (
            <ul>
              {results.map((result) => (
                <li key={result.id}>
                  <Link
                    href={result.href}
                    onClick={onClose}
                    className="flex gap-3 rounded-xl px-3 py-3 hover:bg-[#F1F5F9] dark:hover:bg-slate-800"
                  >
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#1E293B] bg-[#EDE9FE] text-[#6D28D9] dark:border-slate-500 dark:bg-violet-950 dark:text-violet-200">
                      <ResultIcon type={result.type} />
                    </span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-extrabold text-[#1E293B] dark:text-white">
                          {result.title}
                        </span>
                        <span className="font-mono text-[11px] font-bold text-[#7C3AED] dark:text-violet-200">
                          {result.type}
                        </span>
                      </span>
                      <span className="mt-1 block line-clamp-2 text-sm text-[#64748B] dark:text-slate-300">
                        {result.description}
                      </span>
                      <span className="mt-1 block text-xs font-semibold text-[#475569] dark:text-slate-400">
                        {result.meta}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-10 text-center text-sm font-semibold text-[#64748B] dark:text-slate-300">
              Không tìm thấy nội dung phù hợp với “{query.trim()}”.
            </p>
          )}
        </div>
        <div className="border-t border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B] dark:border-slate-700 dark:text-slate-400">
          Nhấn Esc để đóng
        </div>
      </section>
    </div>,
    document.body,
  );
}
