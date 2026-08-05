"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ArrowLeft, Eye, Save, Send, Settings2 } from "lucide-react";
import {
  EDITOR_BADGE_COLORS,
  EDITOR_POST_CATEGORIES,
} from "@/features/content/post-editor-policy";
import { PostBlockEditor } from "@/features/content/components/post-block-editor";
import {
  savePostAction,
  type PostEditorState,
} from "@/features/content/server/post-editor.actions";
import type { EditorPostInitialData } from "@/features/content/editor-types";

const initialState: PostEditorState = {};

export function PostEditorForm({ defaultAuthor, initialData }: { defaultAuthor: string; initialData?: EditorPostInitialData }) {
  const [state, action, pending] = useActionState(savePostAction, initialState);
  const [showPreview, setShowPreview] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");

  return (
    <form
      action={action}
      noValidate
      className="flex h-dvh min-h-screen flex-col overflow-hidden bg-[#F8FAFC] text-[#1E293B]"
    >
      {initialData ? <input type="hidden" name="originalSlug" value={initialData.slug} /> : null}
      <header className="z-30 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b-2 border-[#1E293B] bg-[#FFFDF5] px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/admin/posts"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#1E293B] bg-white hover:bg-[#EDE9FE]"
            aria-label="Quay lại danh sách bài viết"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#8B5CF6]">
              DEVINSIGHT WRITER
            </p>
            <p className="truncate text-sm font-extrabold">{initialData ? "Chỉnh sửa bài viết" : "Bài viết mới"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMetadata((current) => !current)}
            className={`inline-flex items-center gap-2 rounded-lg border-2 border-[#1E293B] px-3 py-2 text-xs font-extrabold ${showMetadata ? "bg-[#EDE9FE] text-[#6D28D9]" : "bg-white"}`}
          >
            <Settings2 className="h-4 w-4" />
            <span className="hidden sm:inline">{showMetadata ? "Ẩn thông tin" : "Thông tin bài"}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowPreview((current) => !current)}
            className={`inline-flex items-center gap-2 rounded-lg border-2 border-[#1E293B] px-3 py-2 text-xs font-extrabold ${showPreview ? "bg-[#1E293B] text-white" : "bg-white"}`}
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">
              {showPreview ? "Ẩn preview" : "Preview"}
            </span>
          </button>
          <button
            disabled={pending}
            name="intent"
            value="draft"
            className="hidden items-center gap-2 rounded-lg border-2 border-[#1E293B] bg-white px-3 py-2 text-xs font-extrabold disabled:opacity-60 sm:inline-flex"
          >
            <Save className="h-4 w-4" />
            Lưu nháp
          </button>
          <button
            disabled={pending}
            name="intent"
            value="publish"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1E293B] bg-[#FBBF24] px-3 py-2 text-xs font-extrabold disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {pending ? "Đang lưu..." : "Xuất bản"}
          </button>
        </div>
      </header>

      <section
        className={`relative z-20 shrink-0 border-b-2 border-[#1E293B] bg-white px-4 py-5 shadow-pop-sm sm:px-6 ${showMetadata ? "" : "hidden"}`}
      >
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-bold text-[#334155] md:col-span-2">
            Tiêu đề
            <input
              required
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={255}
              className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal outline-none focus:border-[#7C3AED]"
              placeholder="Ví dụ: 6 lệnh Git cơ bản cho dự án nhóm"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-[#334155]">
            Slug
            <span className="text-xs font-medium text-[#64748B]">
              Để trống để tạo từ tiêu đề
            </span>
            <input
              name="slug"
              maxLength={180}
              defaultValue={initialData?.slug}
              className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal outline-none focus:border-[#7C3AED]"
              placeholder="git-co-ban-cho-du-an-nhom"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-[#334155]">
            Chuyên mục
            <select
              required
              name="category"
              defaultValue={initialData?.category ?? ""}
              className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal outline-none focus:border-[#7C3AED]"
            >
              <option value="" disabled>
                Chọn chuyên mục
              </option>
              {EDITOR_POST_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-[#334155] md:col-span-2">
            Mô tả ngắn
            <textarea
              required
              name="excerpt"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              maxLength={500}
              rows={2}
              className="resize-y rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal outline-none focus:border-[#7C3AED]"
              placeholder="Phần mô tả hiển thị ở danh sách bài viết và Google."
            />
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-[#334155]">
            Tags
            <input
              name="tags"
              maxLength={450}
              defaultValue={initialData?.tags}
              className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal outline-none focus:border-[#7C3AED]"
              placeholder="git, github, teamwork"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-[#334155]">
            Thời gian đọc (phút)
            <input
              required
              name="readingTime"
              type="number"
              min="1"
              max="180"
              defaultValue={initialData?.readingTime ?? 5}
              className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal outline-none focus:border-[#7C3AED]"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-[#334155]">
            Tác giả
            <input
              required
              name="authorName"
              maxLength={120}
              defaultValue={initialData?.authorName ?? defaultAuthor}
              className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal outline-none focus:border-[#7C3AED]"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-[#334155]">
            Vai trò tác giả
            <input
              name="authorRole"
              maxLength={160}
              defaultValue={initialData?.authorRole}
              className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal outline-none focus:border-[#7C3AED]"
              placeholder="Software Engineering Student"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-[#334155]">
            Màu nhãn
            <select
              name="badgeColor"
              defaultValue={initialData?.badgeColor ?? "violet"}
              className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal outline-none focus:border-[#7C3AED]"
            >
              {EDITOR_BADGE_COLORS.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-[#334155]">
            URL ảnh cover
            <input
              name="coverImage"
              type="url"
              defaultValue={initialData?.coverImage}
              className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal outline-none focus:border-[#7C3AED]"
              placeholder="https://..."
            />
          </label>
        </div>
      </section>

      <PostBlockEditor
        key={initialData?.slug ?? "new-post"}
        showPreview={showPreview}
        previewTitle={title}
        previewExcerpt={excerpt}
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
            Mở bài viết
          </Link>
        </p>
      ) : null}
    </form>
  );
}
