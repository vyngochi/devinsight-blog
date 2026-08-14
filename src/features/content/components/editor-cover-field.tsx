"use client";

/* Editor previews allow arbitrary external URLs before they are saved. */
/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import { ImageIcon, Upload } from "lucide-react";

export function EditorCoverField({ value, onChange, accent = "violet" }: { value: string; onChange: (value: string) => void; accent?: "violet" | "pink" }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const focusClass = accent === "pink" ? "focus:border-[#BE185D] focus:ring-[#FCE7F3]" : "focus:border-[#7C3AED] focus:ring-[#EDE9FE]";

  async function upload(file: File) {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/post-images/upload", { method: "POST", body: formData });
      const result = (await response.json()) as { key?: string; error?: string };
      if (!response.ok || !result.key) throw new Error(result.error ?? "Không thể tải ảnh lên.");
      const path = result.key.replace(/^post-images\//, "").split("/").map(encodeURIComponent).join("/");
      onChange(`/api/post-images/${path}`);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Không thể tải ảnh lên.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-1.5 text-xs font-bold text-[#475569]">
      <span>Ảnh cover</span>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_9rem]">
        <div className="flex min-w-0 gap-2">
          <input name="coverImage" type="url" value={value} onChange={(event) => onChange(event.target.value)} placeholder="https://... hoặc tải ảnh lên" className={`h-10 min-w-0 flex-1 rounded-lg border border-[#CBD5E1] px-3 font-normal outline-none focus:ring-2 ${focusClass}`} />
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); event.currentTarget.value = ""; }} />
          <button type="button" disabled={uploading} onClick={() => inputRef.current?.click()} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-[#1E293B] bg-white px-3 font-extrabold text-[#1E293B] disabled:opacity-50"><Upload className="h-4 w-4" />{uploading ? "Đang tải" : "Tải ảnh"}</button>
        </div>
        <div className="grid aspect-video place-items-center overflow-hidden rounded-lg border border-[#CBD5E1] bg-[#F8FAFC]">
          {value ? <img src={value} alt="Xem trước ảnh cover" className="h-full w-full object-cover" /> : <ImageIcon className="h-6 w-6 text-[#94A3B8]" />}
        </div>
      </div>
      <p className="font-normal text-[#64748B]">Khuyến nghị tỷ lệ 16:9, tối thiểu 1200 x 675 px.</p>
      {error ? <p role="alert" className="text-[#BE123C]">{error}</p> : null}
    </div>
  );
}
