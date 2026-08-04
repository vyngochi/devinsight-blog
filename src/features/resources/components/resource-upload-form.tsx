"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { RESOURCE_TOPICS } from "@/features/resources/resource-policy";
import { registerResourceAction } from "@/features/resources/server/resources.actions";

export function ResourceUploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement | null;
    const file = fileInput?.files?.[0];
    if (!file) {
      setMessage({ type: "error", text: "Hãy chọn một tệp trước khi tải lên." });
      return;
    }

    setMessage(null);
    setIsUploading(true);
    try {
      const uploadResponse = await fetch("/api/admin/resources/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, mimeType: file.type, fileSize: file.size }),
      });
      const upload = (await uploadResponse.json()) as {
        error?: string;
        key?: string;
        uploadUrl?: string;
        fileName?: string;
        mimeType?: string;
        fileSize?: number;
      };
      if (!uploadResponse.ok || !upload.key || !upload.uploadUrl || !upload.mimeType)
        throw new Error(upload.error ?? "Không thể chuẩn bị phiên tải lên.");

      const storageResponse = await fetch(upload.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": upload.mimeType },
        body: file,
      });
      if (!storageResponse.ok) throw new Error("Cloudflare R2 từ chối tệp tải lên.");

      const payload = new FormData(form);
      payload.set("fileKey", upload.key);
      payload.set("fileName", upload.fileName ?? file.name);
      payload.set("mimeType", upload.mimeType);
      payload.set("fileSize", String(upload.fileSize ?? file.size));
      payload.set("published", payload.get("published") === "on" ? "true" : "false");
      const result = await registerResourceAction({}, payload);
      if (result.error) throw new Error(result.error);

      formRef.current?.reset();
      setMessage({ type: "success", text: result.success ?? "Tài nguyên đã được lưu." });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Không thể tải tài nguyên lên." });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="rounded-2xl border-2 border-[#1E293B] bg-white p-5 shadow-pop-sm">
      <div className="flex items-start gap-3"><span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#6D28D9]"><UploadCloud className="h-5 w-5" /></span><div><h2 className="font-extrabold text-[#1E293B]">Tải tài nguyên mới</h2><p className="mt-1 text-sm text-[#64748B]">PDF, DOCX, PPTX, XLSX, TXT, CSV hoặc JSON. Tối đa 50 MB.</p></div></div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-bold text-[#334155]">Tiêu đề<input required name="title" maxLength={220} className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal outline-none focus:border-[#7C3AED]" placeholder="Ví dụ: Tài liệu React Hooks" /></label>
        <label className="grid gap-1.5 text-sm font-bold text-[#334155]">Chủ đề<select required name="topic" defaultValue="" className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal outline-none focus:border-[#7C3AED]"><option value="" disabled>Chọn chủ đề</option>{RESOURCE_TOPICS.map((topic) => <option key={topic} value={topic}>{topic}</option>)}</select></label>
      </div>
      <label className="mt-4 grid gap-1.5 text-sm font-bold text-[#334155]">Mô tả<textarea required name="description" maxLength={2000} rows={4} className="resize-y rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal outline-none focus:border-[#7C3AED]" placeholder="Nêu nội dung, đối tượng phù hợp và cách sử dụng tài liệu." /></label>
      <label className="mt-4 grid gap-1.5 text-sm font-bold text-[#334155]">Tệp đính kèm<input required name="file" type="file" accept=".pdf,.docx,.pptx,.xlsx,.txt,.csv,.json,application/pdf,text/plain,text/csv,application/json" className="cursor-pointer rounded-lg border-2 border-dashed border-[#94A3B8] bg-[#F8FAFC] px-3 py-2.5 font-normal file:mr-3 file:rounded-md file:border-0 file:bg-[#EDE9FE] file:px-3 file:py-1.5 file:font-bold file:text-[#6D28D9]" /></label>
      <label className="mt-4 flex items-center gap-2 text-sm font-bold text-[#334155]"><input name="published" type="checkbox" defaultChecked className="h-4 w-4 accent-[#7C3AED]" />Xuất bản ngay sau khi tải</label>
      {message ? <p role="status" className={`mt-4 rounded-lg px-3 py-2 text-sm font-semibold ${message.type === "error" ? "bg-[#FFF1F2] text-[#BE123C]" : "bg-[#ECFDF5] text-[#047857]"}`}>{message.text}</p> : null}
      <button disabled={isUploading} className="mt-5 inline-flex items-center gap-2 rounded-lg border-2 border-[#1E293B] bg-[#FBBF24] px-4 py-2.5 text-sm font-extrabold text-[#1E293B] disabled:cursor-not-allowed disabled:opacity-60"><UploadCloud className="h-4 w-4" />{isUploading ? "Đang tải lên..." : "Tải lên Cloudflare R2"}</button>
    </form>
  );
}
