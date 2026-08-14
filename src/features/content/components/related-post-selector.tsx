"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import type { RelatedPostCandidate } from "@/features/content/editor-types";

export function RelatedPostSelector({ candidates, initialSlugs }: { candidates: RelatedPostCandidate[]; initialSlugs: string[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(initialSlugs);
  const normalizedQuery = query.trim().toLocaleLowerCase("vi-VN");
  const selectedCandidates = selected.map((slug) => candidates.find((candidate) => candidate.slug === slug)).filter((candidate): candidate is RelatedPostCandidate => Boolean(candidate));
  const results = candidates
    .filter((candidate) => !selected.includes(candidate.slug))
    .filter((candidate) => normalizedQuery ? (candidate.title + " " + candidate.slug).toLocaleLowerCase("vi-VN").includes(normalizedQuery) : true)
    .slice(0, 8);

  return (
    <fieldset className="grid gap-2 md:col-span-2">
      <input type="hidden" name="relatedSlugs" value={selected.join(",")} readOnly />
      <legend className="text-sm font-bold text-[#334155]">Bài viết liên quan</legend>
      <p className="text-xs text-[#64748B]">Tìm và chọn tối đa 12 bài. Thứ tự chọn cũng là thứ tự hiển thị.</p>
      {selectedCandidates.length ? <div className="flex flex-wrap gap-2">{selectedCandidates.map((candidate) => (
        <span key={candidate.slug} className="inline-flex items-center gap-2 rounded-lg border border-[#C4B5FD] bg-[#F5F3FF] px-3 py-2 text-xs font-bold text-[#5B21B6]">
          <span className="max-w-72 truncate">{candidate.title}</span>
          <button type="button" onClick={() => setSelected((items) => items.filter((slug) => slug !== candidate.slug))} aria-label={"Bỏ " + candidate.title} className="rounded p-0.5 hover:bg-[#EDE9FE]"><X className="h-3.5 w-3.5" /></button>
        </span>
      ))}</div> : null}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#64748B]" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tiêu đề hoặc slug..." className="w-full rounded-lg border-2 border-[#CBD5E1] py-2.5 pl-10 pr-3 text-sm font-normal outline-none focus:border-[#7C3AED]" />
      </div>
      {query.trim() ? <div className="max-h-56 overflow-y-auto rounded-lg border border-[#CBD5E1] bg-white">
        {results.length ? results.map((candidate) => (
          <button key={candidate.slug} type="button" disabled={selected.length >= 12} onClick={() => { setSelected((items) => [...items, candidate.slug]); setQuery(""); }} className="flex w-full items-center justify-between gap-3 border-b border-[#E2E8F0] px-3 py-2.5 text-left last:border-0 hover:bg-[#F8FAFC] disabled:opacity-50">
            <span className="min-w-0"><span className="block truncate text-sm font-bold">{candidate.title}</span><span className="block truncate font-mono text-[10px] text-[#64748B]">/{candidate.slug}</span></span>
            <span className="shrink-0 text-[10px] font-bold text-[#64748B]">{candidate.status === "PUBLISHED" ? "Đã xuất bản" : candidate.status === "DRAFT" ? "Bản nháp" : "Đã lưu trữ"}</span>
          </button>
        )) : <p className="px-3 py-4 text-xs text-[#64748B]">Không tìm thấy bài phù hợp.</p>}
      </div> : null}
    </fieldset>
  );
}
