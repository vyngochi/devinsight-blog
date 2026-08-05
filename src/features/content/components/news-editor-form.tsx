"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  ArrowLeft,
  Clock3,
  Eye,
  Newspaper,
  Save,
  Send,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { PostBlockEditor } from "@/features/content/components/post-block-editor";
import {
  saveNewsAction,
  type PostEditorState,
} from "@/features/content/server/post-editor.actions";
import type { NewsEditorInitialData } from "@/features/content/editor-types";

const initialState: PostEditorState = {};

export function NewsEditorForm({ defaultAuthor, initialData }: { defaultAuthor: string; initialData?: NewsEditorInitialData }) {
  const [state, action, pending] = useActionState(saveNewsAction, initialState);
  const [showPreview, setShowPreview] = useState(false);
  const [showMetadata, setShowMetadata] = useState(true);
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");

  return (
    <form
      action={action}
      noValidate
      className="flex h-dvh min-h-screen flex-col overflow-hidden bg-[#F8FAFC] text-[#1E293B]"
    >
      {initialData ? <><input type="hidden" name="originalSlug" value={initialData.slug} /><input type="hidden" name="existingReportedAtLabel" value={initialData.reportedAtLabel} /></> : null}
      <header className="sticky top-0 z-30 border-b border-[#CBD5E1] bg-[#FFFDF5]/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/admin/news"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#1E293B] bg-white hover:bg-[#EDE9FE]"
              aria-label="Quay lại danh sách tin tức"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.16em] text-[#BE185D]">
                <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
                DEVINSIGHT NEWSROOM
              </p>
              <p className="truncate text-sm font-extrabold">
                {initialData ? "Chỉnh sửa tin công nghệ" : "Soạn tin công nghệ"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMetadata((current) => !current)}
              className={`inline-flex items-center gap-1.5 rounded-lg border border-[#1E293B] px-3 py-2 text-xs font-bold ${showMetadata ? "bg-[#EDE9FE] text-[#6D28D9]" : "bg-white text-[#1E293B]"}`}
            >
              <Settings2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">
                {showMetadata ? "Ẩn thông tin" : "Thông tin bài"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowPreview((current) => !current)}
              className={`inline-flex items-center gap-1.5 rounded-lg border border-[#1E293B] px-3 py-2 text-xs font-bold ${showPreview ? "bg-[#1E293B] text-white" : "bg-white text-[#1E293B]"}`}
            >
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">
                {showPreview ? "Ẩn xem trước" : "Xem trước"}
              </span>
            </button>
            <button
              disabled={pending}
              name="intent"
              value="draft"
              className="hidden items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-bold text-[#334155] disabled:opacity-60 sm:inline-flex"
            >
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Lưu nháp
            </button>
            <button
              disabled={pending}
              name="intent"
              value="publish"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#1E293B] bg-[#FBBF24] px-3 py-2 text-xs font-extrabold text-[#1E293B] disabled:opacity-60"
            >
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
              {pending ? "Đang lưu" : "Xuất bản tin"}
            </button>
          </div>
        </div>
      </header>

      <section
        className={`border-b border-[#CBD5E1] bg-white px-4 py-5 sm:px-6 ${showMetadata ? "" : "hidden"}`}
      >
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <label className="grid gap-1.5 text-xs font-bold text-[#334155]">
              Tiêu đề tin
              <input
                required
                name="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={255}
                placeholder="Ví dụ: OpenAI công bố ..."
                className="h-11 rounded-lg border border-[#CBD5E1] px-3 text-base font-extrabold text-[#1E293B] outline-none focus:border-[#BE185D] focus:ring-2 focus:ring-[#FCE7F3]"
              />
            </label>
            <label className="mt-3 grid gap-1.5 text-xs font-bold text-[#334155]">
              Lead tin tức
              <textarea
                required
                name="excerpt"
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                maxLength={500}
                rows={2}
                placeholder="Tóm tắt diễn biến mới nhất trong 1-2 câu, trả lời điều gì đã xảy ra và vì sao quan trọng."
                className="resize-y rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-sm leading-6 text-[#1E293B] outline-none focus:border-[#BE185D] focus:ring-2 focus:ring-[#FCE7F3]"
              />
            </label>
          </div>
          <aside className="rounded-xl border border-[#F9A8D4] bg-[#FDF2F8] p-4 text-xs leading-5 text-[#831843]">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            <p className="mt-2 font-extrabold">Checklist trước khi đăng</p>
            <p className="mt-1">
              Ưu tiên thông tin đã xác minh, headline rõ ràng và trích nguồn
              gốc.
            </p>
          </aside>
        </div>

        <div className="mx-auto mt-4 grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="grid gap-1 text-xs font-bold text-[#475569]">
            Slug{" "}
            <input
              name="slug"
              maxLength={180}
              defaultValue={initialData?.slug}
              placeholder="de-trong-de-tao-tu-tieu-de"
              className="h-9 rounded-lg border border-[#CBD5E1] px-3 font-normal outline-none focus:border-[#BE185D]"
            />
          </label>
          <label className="grid gap-1 text-xs font-bold text-[#475569]">
            Tên nguồn{" "}
            <input
              name="sourceName"
              maxLength={120}
              defaultValue={initialData?.sourceName}
              placeholder="Ví dụ: The Verge"
              className="h-9 rounded-lg border border-[#CBD5E1] px-3 font-normal outline-none focus:border-[#BE185D]"
            />
          </label>
          <label className="grid gap-1 text-xs font-bold text-[#475569]">
            Link nguồn{" "}
            <input
              name="sourceUrl"
              type="url"
              defaultValue={initialData?.sourceUrl}
              placeholder="https://..."
              className="h-9 rounded-lg border border-[#CBD5E1] px-3 font-normal outline-none focus:border-[#BE185D]"
            />
          </label>
          <label className="grid gap-1 text-xs font-bold text-[#475569]">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              Thời điểm tin
            </span>
            <input
              name="reportedAt"
              type="datetime-local"
              className="h-9 rounded-lg border border-[#CBD5E1] px-3 font-normal outline-none focus:border-[#BE185D]"
            />
          </label>
          <label className="grid gap-1 text-xs font-bold text-[#475569] lg:col-span-2">
            Tags bổ sung{" "}
            <input
              name="tags"
              maxLength={350}
              defaultValue={initialData?.tags}
              placeholder="ai, openai, mô hình ngôn ngữ"
              className="h-9 rounded-lg border border-[#CBD5E1] px-3 font-normal outline-none focus:border-[#BE185D]"
            />
          </label>
          <label className="grid gap-1 text-xs font-bold text-[#475569]">
            Tác giả{" "}
            <input
              required
              name="authorName"
              maxLength={120}
              defaultValue={initialData?.authorName ?? defaultAuthor}
              className="h-9 rounded-lg border border-[#CBD5E1] px-3 font-normal outline-none focus:border-[#BE185D]"
            />
          </label>
          <label className="grid gap-1 text-xs font-bold text-[#475569]">
            URL ảnh cover{" "}
            <input
              name="coverImage"
              type="url"
              defaultValue={initialData?.coverImage}
              placeholder="https://..."
              className="h-9 rounded-lg border border-[#CBD5E1] px-3 font-normal outline-none focus:border-[#BE185D]"
            />
          </label>
        </div>
      </section>

      <PostBlockEditor
        key={initialData?.slug ?? "new-news"}
        showPreview={showPreview}
        previewTitle={title}
        previewExcerpt={excerpt}
        mode="news"
        initialContent={initialData?.content}
      />

      {state.error ? (
        <p
          role="alert"
          className="fixed bottom-24 left-1/2 z-[60] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg bg-[#FFF1F2] px-4 py-3 text-sm font-bold text-[#BE123C] shadow-lg"
        >
          {state.error}
        </p>
      ) : null}
      {state.success && state.slug ? (
        <p
          role="status"
          className="fixed bottom-24 left-1/2 z-[60] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg bg-[#ECFDF5] px-4 py-3 text-sm font-bold text-[#047857] shadow-lg"
        >
          {state.success}{" "}
          <Link href={`/posts/${state.slug}`} className="underline">
            Mở tin
          </Link>
        </p>
      ) : null}
    </form>
  );
}
