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
  return (
    <button
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2.5 text-xs font-extrabold text-white hover:bg-[#6D28D9] active:translate-y-px disabled:cursor-wait disabled:opacity-60"
    >
      <Send className="h-3.5 w-3.5" />
      {pending ? "Đang đăng..." : children}
    </button>
  );
}

function FormMessage({ state }: { state: CommunityFormState }) {
  if (state.error)
    return (
      <p
        className="mt-3 rounded-lg border border-[#FDA4AF] bg-[#FFF1F2] px-3 py-2 text-xs font-semibold text-[#BE123C]"
        role="alert"
      >
        {state.error}
      </p>
    );
  if (state.success)
    return (
      <p
        className="mt-3 rounded-lg border border-[#86EFAC] bg-[#F0FDF4] px-3 py-2 text-xs font-semibold text-[#047857]"
        role="status"
      >
        {state.success}
      </p>
    );
  return null;
}

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-xs font-semibold text-[#1E293B] outline-none placeholder:text-[#94A3B8] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#DDD6FE]";

export function CommunityQuestionForm() {
  const [state, formAction] = useActionState(
    createCommunityQuestionAction,
    initialState,
  );
  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="question-title"
          className="block text-xs font-extrabold text-[#1E293B]"
        >
          Tiêu đề câu hỏi
        </label>
        <input
          id="question-title"
          name="title"
          required
          maxLength={220}
          placeholder="Ví dụ: Vì sao Promise cần await?"
          className={fieldClass}
        />
      </div>
      <div>
        <label
          htmlFor="question-topic"
          className="block text-xs font-extrabold text-[#1E293B]"
        >
          Chủ đề
        </label>
        <select
          id="question-topic"
          name="topic"
          defaultValue="JavaScript"
          className={fieldClass}
        >
          {COMMUNITY_TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>
      <CommunityEditor
        name="content"
        label="Nội dung"
        description="Có thể dùng tiêu đề, danh sách, inline code và code block."
      />
      <label className="flex items-start gap-2.5 rounded-lg bg-[#F8FAFC] p-3 text-xs leading-5 text-[#475569]">
        <input
          type="checkbox"
          name="anonymous"
          className="mt-0.5 h-4 w-4 accent-[#7C3AED]"
        />
        <span>
          <strong className="text-[#1E293B]">
            Đăng ẩn danh
          </strong>
          <br />
          Quản trị viên vẫn có thể xem tài khoản để xử lý vi phạm.
        </span>
      </label>
      <FormMessage state={state} />
      <SubmitButton>Đăng câu hỏi</SubmitButton>
    </form>
  );
}

export function CommunityAnswerForm({
  questionId,
  parentId,
  label = "Viết câu trả lời",
}: {
  questionId: string;
  parentId?: string;
  label?: string;
}) {
  const [state, setState] = useState<CommunityFormState>(initialState);
  const [isOpen, setIsOpen] = useState(false);
  const editorId = `community-answer-${parentId ?? questionId}`;

  async function submitAnswer(formData: FormData) {
    const result = await createCommunityAnswerAction(initialState, formData);
    setState(result);
    if (result.success) setIsOpen(false);
  }

  if (!isOpen)
    return (
      <div className="mt-3">
        {state.success ? (
          <p className="mb-2 rounded-lg border border-[#86EFAC] bg-[#F0FDF4] px-3 py-2 text-xs font-semibold text-[#047857]" role="status">
            {state.success}
          </p>
        ) : null}
        <button
          type="button"
          aria-expanded="false"
          aria-controls={editorId}
          onClick={() => {
            setState(initialState);
            setIsOpen(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-bold text-[#6D28D9] hover:bg-[#EDE9FE] active:translate-y-px"
        >
          <MessageSquarePlus className="h-3.5 w-3.5" />
          {label}
        </button>
      </div>
    );

  return (
    <form
      id={editorId}
      action={submitAnswer}
      className="mt-3 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] p-3"
    >
      <input type="hidden" name="questionId" value={questionId} />
      {parentId ? (
        <input type="hidden" name="parentId" value={parentId} />
      ) : null}
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-xs font-extrabold text-[#1E293B]">
          {label}
        </h3>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="grid h-7 w-7 place-items-center rounded-md text-[#64748B] hover:bg-white"
          aria-label="Đóng form phản hồi"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <CommunityEditor
        name="content"
        label="Nội dung phản hồi"
        description="Chia sẻ thông tin hữu ích và không đăng dữ liệu riêng tư."
      />
      <label className="mt-3 flex items-center gap-2 text-xs text-[#475569]">
        <input
          type="checkbox"
          name="anonymous"
          className="h-4 w-4 accent-[#7C3AED]"
        />
        Đăng ẩn danh
      </label>
      <FormMessage state={state} />
      <div className="mt-3">
        <SubmitButton>Đăng phản hồi</SubmitButton>
      </div>
    </form>
  );
}
