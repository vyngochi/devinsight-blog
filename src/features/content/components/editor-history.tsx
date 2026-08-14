"use client";

import { History, RotateCcw, X } from "lucide-react";
import type { LocalEditorDraft } from "@/features/content/components/use-local-editor-draft";

export function EditorHistory({ open, drafts, onClose, onRestore }: { open: boolean; drafts: LocalEditorDraft[]; onClose: () => void; onRestore: (draft: LocalEditorDraft) => void }) {
  if (!open) return null;
  return (
    <aside className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col border-l-2 border-[#1E293B] bg-white shadow-2xl" aria-label="Lịch sử bản nháp">
      <header className="flex items-center justify-between border-b border-[#CBD5E1] px-4 py-4">
        <div><p className="flex items-center gap-2 text-sm font-extrabold"><History className="h-4 w-4" />Lịch sử cục bộ</p><p className="mt-1 text-xs text-[#64748B]">Tối đa 10 bản gần nhất trên thiết bị này.</p></div>
        <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-[#F1F5F9]" aria-label="Đóng lịch sử"><X className="h-4 w-4" /></button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {drafts.length ? <div className="space-y-2">{drafts.map((draft) => <button key={draft.savedAt} type="button" onClick={() => onRestore(draft)} className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#CBD5E1] p-3 text-left hover:border-[#8B5CF6] hover:bg-[#F5F3FF]"><span><span className="block text-xs font-extrabold">{draft.fields.title || "Bản chưa có tiêu đề"}</span><span className="mt-1 block text-[11px] text-[#64748B]">{new Date(draft.savedAt).toLocaleString("vi-VN")}</span></span><RotateCcw className="h-4 w-4 shrink-0 text-[#6D28D9]" /></button>)}</div> : <p className="rounded-xl border border-dashed border-[#CBD5E1] p-6 text-center text-xs text-[#64748B]">Chưa có phiên bản cục bộ.</p>}
      </div>
    </aside>
  );
}
