"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { MessageSquarePlus, Send, X } from "lucide-react";
import { CommunityEditor } from "@/components/community/community-editor";
import { COMMUNITY_TOPICS } from "@/features/community/community-content";
import {
  createCommunityAnswerAction,
  createCommunityQuestionAction,
  type CommunityFormState,
} from "@/features/community/server/community.actions";

const initialState: CommunityFormState = {};

function SubmitButton({ children }: { children: string }) {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#1E293B] bg-[#8B5CF6] px-5 py-3 text-sm font-extrabold text-white shadow-pop-sm hover:bg-[#7C3AED] disabled:cursor-wait disabled:opacity-60"><Send className="h-4 w-4" />{pending ? "Đang đăng..." : children}</button>;
}

function FormMessage({ state }: { state: CommunityFormState }) {
  if (state.error) return <p className="mt-4 rounded-lg border border-[#E11D48] bg-[#FFF1F2] px-3 py-2 text-sm font-semibold text-[#BE123C]" role="alert">{state.error}</p>;
  if (state.success) return <p className="mt-4 rounded-lg border border-[#059669] bg-[#ECFDF5] px-3 py-2 text-sm font-semibold text-[#047857]">{state.success}</p>;
  return null;
}

export function CommunityQuestionForm() {
  const [state, formAction] = useActionState(createCommunityQuestionAction, initialState);
  return <form action={formAction} className="space-y-5">
    <div><label htmlFor="question-title" className="block text-sm font-extrabold text-[#1E293B]">Tiêu đề câu hỏi</label><input id="question-title" name="title" required maxLength={220} placeholder="Ví dụ: Vì sao Promise cần await?" className="mt-2 w-full rounded-xl border-2 border-[#1E293B] bg-white px-4 py-3 text-sm font-semibold text-[#1E293B] outline-none placeholder:text-[#94A3B8] focus:border-[#7C3AED]" /></div>
    <div><label htmlFor="question-topic" className="block text-sm font-extrabold text-[#1E293B]">Chủ đề</label><select id="question-topic" name="topic" defaultValue="JavaScript" className="mt-2 w-full rounded-xl border-2 border-[#1E293B] bg-white px-4 py-3 text-sm font-semibold text-[#1E293B] outline-none focus:border-[#7C3AED]">{COMMUNITY_TOPICS.map((topic) => <option key={topic} value={topic}>{topic}</option>)}</select></div>
    <CommunityEditor name="content" label="Nội dung" description="Bạn có thể dùng tiêu đề, danh sách, inline code và code block. Chọn ngôn ngữ trước khi dán code." />
    <label className="flex items-start gap-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3 text-sm text-[#475569]"><input type="checkbox" name="anonymous" className="mt-0.5 h-4 w-4 accent-[#7C3AED]" /><span><strong className="text-[#1E293B]">Đăng ẩn danh với cộng đồng</strong><br />Quản trị viên vẫn có thể xem tài khoản để xử lý báo cáo và vi phạm.</span></label>
    <FormMessage state={state} />
    <SubmitButton>Đăng câu hỏi</SubmitButton>
  </form>;
}

export function CommunityAnswerForm({ questionId, parentId, label = "Viết câu trả lời" }: { questionId: string; parentId?: string; label?: string }) {
  const [state, formAction] = useActionState(createCommunityAnswerAction, initialState);
  const [isOpen, setIsOpen] = useState(false);
  const editorId = `community-answer-${parentId ?? questionId}`;

  if (!isOpen) return <button type="button" aria-expanded="false" aria-controls={editorId} onClick={() => setIsOpen(true)} className="mt-4 inline-flex items-center gap-2 rounded-lg border-2 border-[#1E293B] bg-white px-3 py-2 text-sm font-extrabold text-[#1E293B] shadow-pop-sm hover:bg-[#FBBF24]"><MessageSquarePlus className="h-4 w-4" />{label}</button>;

  return <form id={editorId} action={formAction} className="mt-4 rounded-xl border-2 border-[#1E293B] bg-[#F8FAFC] p-4">
    <input type="hidden" name="questionId" value={questionId} />
    {parentId ? <input type="hidden" name="parentId" value={parentId} /> : null}
    <div className="mb-4 flex items-center justify-between gap-3"><h3 className="text-base font-extrabold text-[#1E293B]">{label}</h3><button type="button" onClick={() => setIsOpen(false)} className="grid h-8 w-8 place-items-center rounded-lg border border-[#1E293B] bg-white text-[#1E293B] hover:bg-[#F1F5F9]" aria-label="Đóng form phản hồi"><X className="h-4 w-4" /></button></div>
    <CommunityEditor name="content" label="Nội dung phản hồi" description="Chỉ đăng thông tin hữu ích, tôn trọng và không chứa dữ liệu riêng tư." />
    <label className="mt-4 flex items-start gap-3 text-sm text-[#475569]"><input type="checkbox" name="anonymous" className="mt-0.5 h-4 w-4 accent-[#7C3AED]" /><span>Đăng ẩn danh với cộng đồng.</span></label>
    <FormMessage state={state} />
    <div className="mt-4"><SubmitButton>Đăng phản hồi</SubmitButton></div>
  </form>;
}
