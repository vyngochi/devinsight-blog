"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, type MouseEvent } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Circle,
  Eye,
  History,
  Newspaper,
  Plus,
  Save,
  Send,
  Settings2,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { PostBlockEditor } from "@/features/content/components/post-block-editor";
import {
  saveNewsAction,
  type PostEditorState,
} from "@/features/content/server/post-editor.actions";
import type { NewsEditorInitialData } from "@/features/content/editor-types";
import { useEditorSafety } from "@/features/content/components/use-editor-safety";
import { useLocalEditorDraft } from "@/features/content/components/use-local-editor-draft";
import { useEditorShortcuts } from "@/features/content/components/use-editor-shortcuts";
import { EditorCoverField } from "@/features/content/components/editor-cover-field";
import { EditorHistory } from "@/features/content/components/editor-history";
import type { LocalEditorDraft } from "@/features/content/components/use-local-editor-draft";

const initialState: PostEditorState = {};

export function NewsEditorForm({ defaultAuthor, draftOwnerId, initialData }: { defaultAuthor: string; draftOwnerId: string; initialData?: NewsEditorInitialData }) {
  const [state, action, pending] = useActionState(saveNewsAction, initialState);
  const [showPreview, setShowPreview] = useState(false);
  const [showMetadata, setShowMetadata] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [sources, setSources] = useState(initialData?.sources.length ? initialData.sources : [{ name: "", url: "" }]);
  const [reportedAt, setReportedAt] = useState("");
  const [scheduledAt, setScheduledAt] = useState(initialData?.scheduledAt ?? "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "");
  const [sourceError, setSourceError] = useState("");
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
    storageKey: `devinsight:editor:news:${draftOwnerId}:${initialData?.slug ?? "new"}`,
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
    try {
      const restoredSources = JSON.parse(fields.sources ?? "[]") as Array<{ name: string; url: string }>;
      setSources(restoredSources.length ? restoredSources : [{ name: "", url: "" }]);
    } catch {
      setSources([{ name: "", url: "" }]);
    }
    setReportedAt(fields.reportedAt ?? "");
    setScheduledAt(fields.scheduledAt ?? "");
    setCoverImage(fields.coverImage ?? "");
    for (const [name, value] of Object.entries(fields)) {
      if (["title", "excerpt", "sources", "reportedAt", "coverImage", "content", "originalSlug", "existingReportedAtLabel"].includes(name)) continue;
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
    if (!form) return;
    const publishing = event.currentTarget.value === "publish";
    const sourceMissing = !sources.length || sources.some((source) => !source.name.trim() || !source.url.trim());
    if (publishing && sourceMissing) {
      event.preventDefault();
      setSourceError("Tin tức cần có đầy đủ tên nguồn và link nguồn trước khi xuất bản.");
      setShowMetadata(true);
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[data-news-source-invalid='true']")?.focus());
      return;
    }
    setSourceError("");
    if (form.checkValidity()) return;
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
    if (!window.confirm(currentStatus === "PUBLISHED" ? "Cập nhật bản tin đang công khai?" : "Xuất bản bản tin ngay bây giờ?")) event.preventDefault();
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
    { label: "Có headline rõ ràng", done: title.trim().length > 0 },
    { label: "Có lead tóm tắt", done: excerpt.trim().length > 0 },
    { label: `${sources.filter((source) => source.name.trim() && source.url.trim()).length} nguồn hợp lệ`, done: sources.length > 0 && sources.every((source) => Boolean(source.name.trim() && source.url.trim())) },
    { label: "Có thời điểm tin", done: Boolean(reportedAt || initialData?.reportedAtLabel) },
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
      {initialData ? <><input type="hidden" name="originalSlug" value={initialData.slug} /><input type="hidden" name="existingReportedAtLabel" value={initialData.reportedAtLabel} /></> : null}
      <input type="hidden" name="sources" value={JSON.stringify(sources)} readOnly />
      <header className="sticky top-0 z-30 border-b border-[#CBD5E1] bg-[#FFFDF5]/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/admin/news"
              onClick={(event) => {
                if (!confirmNavigation()) event.preventDefault();
              }}
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
              <p className={`mt-0.5 text-[10px] font-bold ${dirty ? "text-[#B45309]" : "text-[#64748B]"}`}>
                {pending ? "Đang lưu..." : dirty ? lastAutoSavedAt ? `Chưa lưu lên server · đã sao lưu lúc ${new Date(lastAutoSavedAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}` : "Có thay đổi chưa lưu" : activeSchedule ? `Đã lên lịch ${new Date(activeSchedule).toLocaleString("vi-VN")}` : currentStatus === "PUBLISHED" ? "Đã xuất bản" : "Bản nháp đã lưu"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowHistory(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#1E293B] bg-white px-3 py-2 text-xs font-bold" title="Lịch sử bản nháp"><History className="h-3.5 w-3.5" /><span className="hidden lg:inline">Lịch sử</span></button>
            <button
              type="button"
              data-editor-preview
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
              value="schedule"
              onClick={validateSchedule}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#BE185D] bg-[#FDF2F8] px-3 py-2 text-xs font-bold text-[#9D174D] disabled:opacity-60"
            ><Clock3 className="h-3.5 w-3.5" /><span className="hidden lg:inline">Lên lịch</span></button>
            <button
              disabled={pending}
              data-editor-save
              name="intent"
              value={currentStatus === "PUBLISHED" ? "save-published" : "draft"}
              onClick={validateBeforeSubmit}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-bold text-[#334155] disabled:opacity-60"
            >
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{currentStatus === "PUBLISHED" ? "Lưu thay đổi" : "Lưu nháp"}</span>
              <span className="sm:hidden">Lưu</span>
            </button>
            <button
              disabled={pending}
              name="intent"
              value="publish"
              onClick={confirmPublish}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#1E293B] bg-[#FBBF24] px-3 py-2 text-xs font-extrabold text-[#1E293B] disabled:opacity-60"
            >
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
              {pending ? "Đang lưu" : "Xuất bản tin"}
            </button>
          </div>
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
        className={`min-h-0 flex-1 overflow-y-auto overscroll-contain border-b border-[#CBD5E1] bg-white px-4 py-5 sm:px-6 ${showMetadata ? "" : "hidden"}`}
      >
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <label className="grid gap-1.5 text-xs font-bold text-[#334155]">
              <span className="flex items-center justify-between gap-3"><span>Tiêu đề tin</span><span className="font-medium text-[#64748B]">{title.length}/255</span></span>
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
              <span className="flex items-center justify-between gap-3"><span>Lead tin tức</span><span className={excerpt.length > 160 ? "font-medium text-[#B45309]" : "font-medium text-[#64748B]"}>{excerpt.length}/500, SEO nên dưới 160</span></span>
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
            <ul className="mt-2 space-y-1.5">
              {checklist.map((item) => (
                <li key={item.label} className={`flex items-center gap-2 ${item.done ? "text-[#166534]" : "text-[#9F1239]"}`}>
                  {item.done ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : <Circle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                  {item.label}
                </li>
              ))}
            </ul>
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
            Lịch xuất bản
            <input name="scheduledAt" type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} className="h-9 rounded-lg border border-[#CBD5E1] px-3 font-normal outline-none focus:border-[#BE185D]" />
          </label>
          <div className="space-y-2 sm:col-span-2 lg:col-span-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-[#475569]">Nguồn tin</span>
              <button type="button" disabled={sources.length >= 5} onClick={() => { setSources((current) => [...current, { name: "", url: "" }]); setSourceError(""); }} className="inline-flex items-center gap-1 rounded-lg border border-[#1E293B] bg-white px-2.5 py-1.5 text-xs font-extrabold disabled:opacity-40"><Plus className="h-3.5 w-3.5" />Thêm nguồn</button>
            </div>
            {sources.map((source, index) => {
              const invalid = Boolean(sourceError && (!source.name.trim() || !source.url.trim()));
              return <div key={index} className="grid gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)_auto]"><input value={source.name} onChange={(event) => { const name = event.target.value; setSources((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, name } : item)); setSourceError(""); }} data-news-source-invalid={invalid && !source.name.trim()} maxLength={120} placeholder={`Tên nguồn ${index + 1}`} aria-label={`Tên nguồn ${index + 1}`} className="h-9 rounded-lg border border-[#CBD5E1] px-3 text-xs outline-none focus:border-[#BE185D]" /><input value={source.url} onChange={(event) => { const url = event.target.value; setSources((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, url } : item)); setSourceError(""); }} data-news-source-invalid={invalid && !source.url.trim()} type="url" placeholder="https://..." aria-label={`Link nguồn ${index + 1}`} className="h-9 rounded-lg border border-[#CBD5E1] px-3 text-xs outline-none focus:border-[#BE185D]" /><button type="button" disabled={sources.length === 1} onClick={() => setSources((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="grid h-9 w-9 place-items-center rounded-lg text-[#BE123C] hover:bg-[#FFF1F2] disabled:opacity-30" aria-label={`Xóa nguồn ${index + 1}`}><Trash2 className="h-4 w-4" /></button></div>;
            })}
          </div>
          <label className="grid gap-1 text-xs font-bold text-[#475569]">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              Thời điểm tin
            </span>
            <input
              name="reportedAt"
              type="datetime-local"
              value={reportedAt}
              onChange={(event) => setReportedAt(event.target.value)}
              className="h-9 rounded-lg border border-[#CBD5E1] px-3 font-normal outline-none focus:border-[#BE185D]"
            />
          </label>
          {sourceError ? <p id="news-source-error" role="alert" className="text-xs font-bold text-[#BE123C] sm:col-span-2 lg:col-span-4">{sourceError}</p> : null}
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
          <div className="sm:col-span-2 lg:col-span-4"><EditorCoverField value={coverImage} onChange={setCoverImage} accent="pink" /></div>
        </div>
      </section>

      <PostBlockEditor
        key={`${initialData?.slug ?? "new-news"}:${editorRevision}`}
        showPreview={showPreview}
        previewTitle={title}
        previewExcerpt={excerpt}
        mode="news"
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
            Mở tin
          </Link>
        </p>
      ) : null}
      <EditorHistory open={showHistory} drafts={draftHistory} onClose={() => setShowHistory(false)} onRestore={restoreLocalDraft} />
    </form>
  );
}
