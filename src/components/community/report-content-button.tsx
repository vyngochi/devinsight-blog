"use client";

import { useActionState } from "react";
import { Flag } from "lucide-react";
import {
  reportCommunityContentAction,
  type CommunityFormState,
} from "@/features/community/server/community.actions";

const initialState: CommunityFormState = {};

export function ReportContentButton({
  questionId,
  answerId,
}: {
  questionId?: string;
  answerId?: string;
}) {
  const [state, formAction, pending] = useActionState(
    reportCommunityContentAction,
    initialState,
  );
  return (
    <details className="relative">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs font-bold text-[#64748B] hover:text-[#E11D48]">
        <Flag className="h-3.5 w-3.5" />
        Báo cáo
      </summary>
      <form
        action={formAction}
        className="absolute right-0 z-20 mt-2 w-64 rounded-xl border-2 border-[#1E293B] bg-white p-3 shadow-pop-sm"
      >
        {questionId ? (
          <input type="hidden" name="questionId" value={questionId} />
        ) : null}
        {answerId ? (
          <input type="hidden" name="answerId" value={answerId} />
        ) : null}
        <label className="block text-xs font-extrabold text-[#1E293B]">
          Lý do
        </label>
        <select
          name="reason"
          className="mt-1 w-full rounded-lg border border-[#1E293B] bg-white px-2 py-2 text-xs font-semibold"
        >
          <option>Spam hoặc quảng cáo</option>
          <option>Nội dung không phù hợp</option>
          <option>Thông tin sai lệch</option>
          <option>Quấy rối thành viên</option>
        </select>
        <textarea
          name="detail"
          maxLength={500}
          rows={2}
          placeholder="Ghi chú thêm (không bắt buộc)"
          className="mt-2 w-full rounded-lg border border-[#CBD5E1] p-2 text-xs outline-none focus:border-[#7C3AED]"
        />
        {state.error ? (
          <p className="mt-2 text-xs font-semibold text-[#BE123C]">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p className="mt-2 text-xs font-semibold text-[#047857]">
            {state.success}
          </p>
        ) : null}
        <button
          disabled={pending}
          className="mt-2 w-full rounded-lg border border-[#1E293B] bg-[#FBBF24] px-2 py-2 text-xs font-extrabold text-[#1E293B] disabled:opacity-60"
        >
          {pending ? "Đang gửi" : "Gửi báo cáo"}
        </button>
      </form>
    </details>
  );
}
