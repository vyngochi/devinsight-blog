"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowLeft, CalendarClock, CheckCircle2, Circle, Eye, History, Save, Send, Settings2, ShieldCheck } from "lucide-react";
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
import type { RelatedPostCandidate } from "@/features/content/editor-types";
import { RelatedPostSelector } from "@/features/content/components/related-post-selector";
import { useEditorSafety } from "@/features/content/components/use-editor-safety";
import { useLocalEditorDraft } from "@/features/content/components/use-local-editor-draft";
import { useEditorShortcuts } from "@/features/content/components/use-editor-shortcuts";
import { EditorCoverField } from "@/features/content/components/editor-cover-field";
import { EditorHistory } from "@/features/content/components/editor-history";
import type { LocalEditorDraft } from "@/features/content/components/use-local-editor-draft";

const initialState: PostEditorState = {};

export function PostEditorForm({ defaultAuthor, draftOwnerId, initialData, relatedCandidates = [] }: { defaultAuthor: string; draftOwnerId: string; initialData?: EditorPostInitialData; relatedCandidates?: RelatedPostCandidate[] }) {
  const [state, action, pending] = useActionState(savePostAction, initialState);
  const [showPreview, setShowPreview] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "");
  const [scheduledAt, setScheduledAt] = useState(initialData?.scheduledAt ?? "");
  const [editorContent, setEditorContent] = useState(initialData?.content);
  const [editorRevision, setEditorRevision] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  useEditorShortcuts(formRef);
  const { dirty, changeVersion, markDirty, markSaved, confirmNavigation } = useEditorSafety();
  const currentStatus = state.status ?? initialData?.status ?? "DRAFT";
  const activeSchedule = state.scheduledAt ?? initialData?.scheduledAt;
  const {
    recoveryDraft,
    lastAutoSavedAt,
    clearLocalDraft,
    dismissRecovery,
    acceptRecovery,
    draftHistory,
  } = useLocalEditorDraft({
    storageKey: `devinsight:editor:article:${draftOwnerId}:${initialData?.slug ?? "new"}`,
    formRef,
    dirty,
    changeVersion,
  });

  useEffect(() => {
    if (state.success) {
      markSaved();
      clearLocalDraft();
    }
  }, [state, markSaved, clearLocalDraft]);

  function restoreLocalDraft(draft: LocalEditorDraft | null = recoveryDraft) {
    if (!draft || !formRef.current) return;
    const { fields } = draft;
    setTitle(fields.title ?? "");
    setExcerpt(fields.excerpt ?? "");
    setCategory(fields.category ?? "");
    setCoverImage(fields.coverImage ?? "");
    setScheduledAt(fields.scheduledAt ?? "");
    for (const [name, value] of Object.entries(fields)) {
      if (["title", "excerpt", "category", "coverImage", "content", "originalSlug"].includes(name)) continue;
      const control = formRef.current.elements.namedItem(name);
      if (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement || control instanceof HTMLSelectElement) {
        control.value = value;
      }
    }
    setEditorContent(fields.content);
    setEditorRevision((current) => current + 1);
    acceptRecovery();
    setShowHistory(false);
    markDirty();
  }

  function validateBeforeSubmit(event: MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.form;
    if (!form || form.checkValidity()) return;
    event.preventDefault();
    setShowMetadata(true);
    requestAnimationFrame(() => {
      form.querySelector<HTMLElement>(":invalid")?.focus();
      form.reportValidity();
    });
  }

  function confirmPublish(event: MouseEvent<HTMLButtonElement>) {
    validateBeforeSubmit(event);
    if (event.defaultPrevented) return;
    if (!window.confirm(currentStatus === "PUBLISHED" ? "Cập nhật bài viết đang công khai?" : "Xuất bản bài viết ngay bây giờ?")) event.preventDefault();
  }

  function validateSchedule(event: MouseEvent<HTMLButtonElement>) {
    validateBeforeSubmit(event);
    if (event.defaultPrevented) return;
    if (!scheduledAt || new Date(scheduledAt) <= new Date()) {
      event.preventDefault();
      setShowMetadata(true);
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>("[name='scheduledAt']")?.focus());
    }
  }

  const checklist = [
    { label: "Có tiêu đề", done: title.trim().length > 0 },
    { label: "Có mô tả ngắn", done: excerpt.trim().length > 0 },
    { label: "Đã chọn chuyên mục", done: Boolean(category) },
    { label: "Có ảnh cover", done: Boolean(coverImage.trim()) },
  ];

  return (
    <form
      ref={formRef}
      action={action}
      noValidate
      onChangeCapture={markDirty}
      className="flex h-dvh min-h-screen flex-col overflow-hidden bg-[#F8FAFC] text-[#1E293B]"
    >
      {initialData ? <input type="hidden" name="originalSlug" value={initialData.slug} /> : null}
      <header className="z-30 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b-2 border-[#1E293B] bg-[#FFFDF5] px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/admin/posts"
            onClick={(event) => {
              if (!confirmNavigation()) event.preventDefault();
            }}
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
            <p className={`mt-0.5 text-[10px] font-bold ${dirty ? "text-[#B45309]" : "text-[#64748B]"}`}>
              {pending ? "Đang lưu..." : dirty ? lastAutoSavedAt ? `Chưa lưu lên server · đã sao lưu lúc ${new Date(lastAutoSavedAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}` : "Có thay đổi chưa lưu" : activeSchedule ? `Đã lên lịch ${new Date(activeSchedule).toLocaleString("vi-VN")}` : currentStatus === "PUBLISHED" ? "Đã xuất bản" : "Bản nháp đã lưu"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowHistory(true)} className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1E293B] bg-white px-3 py-2 text-xs font-extrabold" title="Lịch sử bản nháp"><History className="h-4 w-4" /><span className="hidden lg:inline">Lịch sử</span></button>
          <button
            type="button"
            data-editor-preview
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
            value="schedule"
            onClick={validateSchedule}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1E293B] bg-[#EDE9FE] px-3 py-2 text-xs font-extrabold text-[#5B21B6] disabled:opacity-60"
          ><CalendarClock className="h-4 w-4" /><span className="hidden lg:inline">Lên lịch</span></button>
          <button
            disabled={pending}
            data-editor-save
            name="intent"
            value={currentStatus === "PUBLISHED" ? "save-published" : "draft"}
            onClick={validateBeforeSubmit}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1E293B] bg-white px-3 py-2 text-xs font-extrabold disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">{currentStatus === "PUBLISHED" ? "Lưu thay đổi" : "Lưu nháp"}</span>
            <span className="sm:hidden">Lưu</span>
          </button>
          <button
            disabled={pending}
            name="intent"
            value="publish"
            onClick={confirmPublish}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1E293B] bg-[#FBBF24] px-3 py-2 text-xs font-extrabold disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {pending ? "Đang lưu..." : "Xuất bản"}
          </button>
        </div>
      </header>

      {recoveryDraft ? (
        <div role="status" className="z-20 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#FCD34D] bg-[#FFFBEB] px-4 py-3 text-xs text-[#78350F] sm:px-6">
          <p className="font-bold">Tìm thấy bản sao cục bộ lúc {new Date(recoveryDraft.savedAt).toLocaleString("vi-VN")}.</p>
          <div className="flex gap-2">
            <button type="button" onClick={dismissRecovery} className="rounded-lg border border-[#D97706] bg-white px-3 py-1.5 font-bold">Bỏ bản tạm</button>
            <button type="button" onClick={() => restoreLocalDraft()} className="rounded-lg border border-[#1E293B] bg-[#FBBF24] px-3 py-1.5 font-extrabold text-[#1E293B]">Khôi phục</button>
          </div>
        </div>
      ) : null}

      <section
        className={`relative z-20 min-h-0 flex-1 overflow-y-auto overscroll-contain border-b-2 border-[#1E293B] bg-white px-4 py-5 shadow-pop-sm sm:px-6 ${showMetadata ? "" : "hidden"}`}
      >
        <div className="mx-auto mb-4 flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-[#C4B5FD] bg-[#F5F3FF] px-4 py-3 text-xs">
          <span className="inline-flex items-center gap-2 font-extrabold text-[#5B21B6]"><ShieldCheck className="h-4 w-4" aria-hidden="true" />Checklist xuất bản</span>
          {checklist.map((item) => (
            <span key={item.label} className={`inline-flex items-center gap-1.5 font-bold ${item.done ? "text-[#166534]" : "text-[#64748B]"}`}>
              {item.done ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> : <Circle className="h-3.5 w-3.5" aria-hidden="true" />}
              {item.label}
            </span>
          ))}
        </div>
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-bold text-[#334155] md:col-span-2">
            <span className="flex items-center justify-between gap-3"><span>Tiêu đề</span><span className="text-xs font-medium text-[#64748B]">{title.length}/255</span></span>
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
              value={category}
              onChange={(event) => setCategory(event.target.value)}
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
            <span className="flex items-center justify-between gap-3"><span>Mô tả ngắn</span><span className={`text-xs font-medium ${excerpt.length > 160 ? "text-[#B45309]" : "text-[#64748B]"}`}>{excerpt.length}/500, SEO nên dưới 160</span></span>
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
            Thời điểm xuất bản
            <input name="scheduledAt" type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal outline-none focus:border-[#7C3AED]" />
            <span className="text-xs font-medium text-[#64748B]">Dùng cùng nút Lên lịch trên thanh công cụ.</span>
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
          <div className="md:col-span-2"><EditorCoverField value={coverImage} onChange={setCoverImage} /></div>
          <RelatedPostSelector candidates={relatedCandidates} initialSlugs={initialData?.relatedSlugs ?? []} />
        </div>
      </section>

      <PostBlockEditor
        key={`${initialData?.slug ?? "new-post"}:${editorRevision}`}
        showPreview={showPreview}
        previewTitle={title}
        previewExcerpt={excerpt}
        initialContent={editorContent}
        onDirty={markDirty}
        toolbarVisible={!showMetadata}
        workspaceVisible={!showMetadata}
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
      <EditorHistory open={showHistory} drafts={draftHistory} onClose={() => setShowHistory(false)} onRestore={restoreLocalDraft} />
    </form>
  );
}
