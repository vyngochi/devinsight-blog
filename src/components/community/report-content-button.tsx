"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { Flag, X } from "lucide-react";
import { reportCommunityContentAction, type CommunityFormState } from "@/features/community/server/community.actions";

const initialState: CommunityFormState = {};

export function ReportContentButton({ questionId, answerId }: { questionId?: string; answerId?: string }) {
  const [state, formAction, pending] = useActionState(reportCommunityContentAction, initialState);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button type="button" aria-expanded={open} aria-controls={popoverId} aria-haspopup="dialog" onClick={() => setOpen((current) => !current)} className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-semibold text-[#64748B] hover:bg-[#FFF1F2] hover:text-[#BE123C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]">
        <Flag className="h-3.5 w-3.5" /> Báo cáo
      </button>
      {open ? (
        <form id={popoverId} role="dialog" aria-label="Báo cáo nội dung" action={formAction} className="absolute right-0 z-20 mt-1.5 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-[#CBD5E1] bg-white p-3.5 shadow-xl">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-extrabold text-[#1E293B]">Báo cáo nội dung</p>
            <button type="button" onClick={() => setOpen(false)} aria-label="Đóng form báo cáo" className="grid h-7 w-7 place-items-center rounded-md text-[#64748B] hover:bg-[#F1F5F9]"><X className="h-3.5 w-3.5" /></button>
          </div>
          {questionId ? <input type="hidden" name="questionId" value={questionId} /> : null}
          {answerId ? <input type="hidden" name="answerId" value={answerId} /> : null}
          <label className="block text-[11px] font-bold text-[#334155]">Lý do</label>
          <select name="reason" className="mt-1 w-full rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-2 text-xs font-semibold text-[#1E293B] outline-none focus:border-[#7C3AED]">
            <option>Spam hoặc quảng cáo</option><option>Nội dung không phù hợp</option><option>Thông tin sai lệch</option><option>Quấy rối thành viên</option>
          </select>
          <textarea name="detail" maxLength={500} rows={2} placeholder="Ghi chú thêm (không bắt buộc)" className="mt-2 w-full resize-none rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#1E293B] outline-none placeholder:text-[#94A3B8] focus:border-[#7C3AED]" />
          {state.error ? <p className="mt-2 text-xs font-semibold text-[#BE123C]" role="alert">{state.error}</p> : null}
          {state.success ? <p className="mt-2 text-xs font-semibold text-[#047857]" role="status">{state.success}</p> : null}
          <button disabled={pending} className="mt-2 w-full rounded-lg bg-[#7C3AED] px-2 py-2 text-xs font-extrabold text-white hover:bg-[#6D28D9] disabled:opacity-60">{pending ? "Đang gửi" : "Gửi báo cáo"}</button>
        </form>
      ) : null}
    </div>
  );
}
