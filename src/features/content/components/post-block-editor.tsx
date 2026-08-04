"use client";

/* The preview accepts either a private same-origin R2 proxy URL or an editor-provided external URL. */
/* eslint-disable @next/next/no-img-element */

import { useRef, useState, type CSSProperties } from "react";
import {
  ChevronDown,
  ChevronUp,
  Code2,
  GripVertical,
  Heading1,
  Heading2,
  ImageIcon,
  Lightbulb,
  ListPlus,
  Pilcrow,
  Trash2,
  Upload,
} from "lucide-react";

type BlockType = "heading1" | "heading2" | "paragraph" | "code" | "callout" | "image";

type EditorBlock = {
  id: string;
  type: BlockType;
  text: string;
  language?: string;
  calloutType?: "tip" | "note";
  src?: string;
  alt?: string;
};

const blockOptions: Array<{ type: BlockType; label: string; icon: typeof Heading1 }> = [
  { type: "heading1", label: "Tiêu đề 1", icon: Heading1 },
  { type: "heading2", label: "Tiêu đề 2", icon: Heading2 },
  { type: "paragraph", label: "Đoạn văn", icon: Pilcrow },
  { type: "code", label: "Code", icon: Code2 },
  { type: "callout", label: "Lưu ý", icon: Lightbulb },
  { type: "image", label: "Ảnh", icon: ImageIcon },
];

function createBlock(type: BlockType): EditorBlock {
  return {
    id: crypto.randomUUID(),
    type,
    text: "",
    ...(type === "code" ? { language: "typescript" } : {}),
    ...(type === "callout" ? { calloutType: "note" } : {}),
    ...(type === "image" ? { src: "", alt: "" } : {}),
  };
}

function initialBlocks(): EditorBlock[] {
  return [
    { ...createBlock("heading2"), text: "Mở đầu" },
    {
      ...createBlock("paragraph"),
      text: "Viết phần mở đầu ngắn gọn: bài này dành cho ai và người đọc sẽ nhận được gì.",
    },
    { ...createBlock("heading2"), text: "Nội dung chính" },
    {
      ...createBlock("code"),
      language: "typescript",
      text: 'const message = "Hello DevInsight";\nconsole.log(message);',
    },
    { ...createBlock("callout"), text: "Ghi chú quan trọng dành cho người đọc.", calloutType: "note" },
  ];
}

function serializeBlocks(blocks: EditorBlock[]) {
  return blocks
    .map((block) => {
      const text = block.text.trim();
      if (block.type === "heading1") return text ? `# ${text}` : "";
      if (block.type === "heading2") return text ? `## ${text}` : "";
      if (block.type === "paragraph") return text;
      if (block.type === "code") return text ? `\`\`\`${block.language || "text"}\n${block.text}\n\`\`\`` : "";
      if (block.type === "callout")
        return text ? `<Callout type="${block.calloutType || "note"}">\n\n${text}\n\n</Callout>` : "";
      if (block.type === "image" && block.src?.trim())
        return `![${(block.alt || "Hình ảnh minh họa").trim()}](${block.src.trim()})`;
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

function PreviewPane({ blocks, title, excerpt }: { blocks: EditorBlock[]; title: string; excerpt: string }) {
  return (
    <aside className="h-full overflow-y-auto bg-[#FFFDF5] px-6 py-10 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-3xl">
        <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-[#8B5CF6]">BẢN XEM TRƯỚC</span>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#1E293B] sm:text-4xl">{title || "Tiêu đề bài viết"}</h1>
        {excerpt ? <p className="mt-4 text-base leading-7 text-[#64748B]">{excerpt}</p> : null}
        <div className="mt-10 border-t-2 border-[#1E293B] pt-8">
          {blocks.map((block) => {
            if (!block.text.trim() && block.type !== "image") return null;
            if (block.type === "heading1") return <h1 key={block.id} className="mt-10 text-3xl font-extrabold text-[#1E293B]">{block.text}</h1>;
            if (block.type === "heading2") return <h2 key={block.id} className="mt-8 text-2xl font-extrabold text-[#1E293B]">{block.text}</h2>;
            if (block.type === "paragraph") return <p key={block.id} className="mt-5 whitespace-pre-wrap text-[15px] leading-8 text-[#334155]">{block.text}</p>;
            if (block.type === "callout") return <aside key={block.id} className={`mt-6 rounded-xl border-2 border-[#1E293B] p-5 text-sm leading-7 text-[#1E293B] ${block.calloutType === "tip" ? "bg-[#34D399]" : "bg-[#FBBF24]"}`}>{block.text}</aside>;
            if (block.type === "code") return <div key={block.id} className="mt-6 overflow-hidden rounded-xl border-2 border-[#1E293B] bg-[#111827]"><div className="flex items-center gap-2 border-b border-slate-600 bg-[#263246] px-4 py-3"><span className="h-3 w-3 rounded-full bg-[#FF5F57]" /><span className="h-3 w-3 rounded-full bg-[#FEBC2E]" /><span className="h-3 w-3 rounded-full bg-[#28C840]" /><span className="ml-2 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-300">{block.language || "text"}</span></div><pre className="overflow-x-auto p-5 text-sm leading-7 text-slate-100"><code>{block.text}</code></pre></div>;
            if (block.type === "image" && block.src) return <figure key={block.id} className="mt-7"><img src={block.src} alt={block.alt || "Hình ảnh minh họa"} className="max-h-[560px] w-full rounded-xl border-2 border-[#1E293B] object-contain" />{block.alt ? <figcaption className="mt-2 text-center text-xs text-[#64748B]">{block.alt}</figcaption> : null}</figure>;
            return null;
          })}
        </div>
      </div>
    </aside>
  );
}

export function PostBlockEditor({ showPreview, previewTitle, previewExcerpt }: { showPreview: boolean; previewTitle: string; previewExcerpt: string }) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [split, setSplit] = useState(52);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  function updateBlock(id: string, patch: Partial<EditorBlock>) {
    setBlocks((current) => current.map((block) => (block.id === id ? { ...block, ...patch } : block)));
  }

  function moveBlock(id: string, direction: -1 | 1) {
    setBlocks((current) => {
      const index = current.findIndex((block) => block.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function dropBlock(targetId: string) {
    if (!draggedId || draggedId === targetId) return;
    setBlocks((current) => {
      const source = current.findIndex((block) => block.id === draggedId);
      const target = current.findIndex((block) => block.id === targetId);
      if (source < 0 || target < 0) return current;
      const next = [...current];
      const [block] = next.splice(source, 1);
      next.splice(target, 0, block);
      return next;
    });
    setDraggedId(null);
  }

  function resize(event: React.PointerEvent<HTMLButtonElement>) {
    const bounds = workspaceRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setSplit(Math.min(72, Math.max(28, ((event.clientX - bounds.left) / bounds.width) * 100)));
  }

  async function uploadImage(blockId: string, file: File) {
    setUploadError(null);
    setUploadingId(blockId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/post-images/upload", { method: "POST", body: formData });
      const upload = (await response.json()) as { error?: string; key?: string };
      if (!response.ok || !upload.key) throw new Error(upload.error ?? "Không thể tải hình ảnh lên.");
      const path = upload.key.replace(/^post-images\//, "").split("/").map(encodeURIComponent).join("/");
      updateBlock(blockId, { src: `/api/post-images/${path}`, alt: file.name.replace(/\.[^.]+$/, "") });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Không thể tải hình ảnh lên.");
    } finally {
      setUploadingId(null);
    }
  }

  function renderBlock(block: EditorBlock, index: number) {
    return <article key={block.id} draggable onDragStart={() => setDraggedId(block.id)} onDragEnd={() => setDraggedId(null)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropBlock(block.id)} className={`rounded-xl border-2 bg-white p-4 ${draggedId === block.id ? "border-[#A78BFA] opacity-60" : "border-[#E2E8F0]"}`}>
      <div className="mb-3 flex items-center gap-2"><button type="button" className="cursor-grab rounded-md p-1.5 text-[#94A3B8] hover:bg-[#F1F5F9]" aria-label="Kéo để sắp xếp"><GripVertical className="h-5 w-5" /></button><span className="mr-auto text-xs font-extrabold uppercase tracking-wide text-[#64748B]">{blockOptions.find((option) => option.type === block.type)?.label}</span><button type="button" onClick={() => moveBlock(block.id, -1)} disabled={index === 0} className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-30" aria-label="Đưa khối lên"><ChevronUp className="h-4 w-4" /></button><button type="button" onClick={() => moveBlock(block.id, 1)} disabled={index === blocks.length - 1} className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-30" aria-label="Đưa khối xuống"><ChevronDown className="h-4 w-4" /></button><button type="button" onClick={() => setBlocks((current) => current.filter((item) => item.id !== block.id))} className="rounded-md p-1.5 text-[#BE123C] hover:bg-[#FFF1F2]" aria-label="Xóa khối"><Trash2 className="h-4 w-4" /></button></div>
      {(block.type === "heading1" || block.type === "heading2") ? <input value={block.text} onChange={(event) => updateBlock(block.id, { text: event.target.value })} maxLength={255} placeholder={block.type === "heading1" ? "Tiêu đề chính" : "Tiêu đề phần"} className="w-full rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-bold text-[#1E293B] outline-none focus:border-[#7C3AED]" /> : null}
      {block.type === "paragraph" ? <textarea value={block.text} onChange={(event) => updateBlock(block.id, { text: event.target.value })} rows={4} placeholder="Viết nội dung đoạn văn..." className="w-full resize-y rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 text-sm leading-6 text-[#334155] outline-none focus:border-[#7C3AED]" /> : null}
      {block.type === "code" ? <div className="grid gap-3"><label className="grid max-w-xs gap-1 text-xs font-bold text-[#64748B]">Ngôn ngữ<select value={block.language} onChange={(event) => updateBlock(block.id, { language: event.target.value })} className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2 font-semibold outline-none focus:border-[#7C3AED]"><option value="typescript">TypeScript</option><option value="javascript">JavaScript</option><option value="bash">Bash</option><option value="json">JSON</option><option value="html">HTML</option><option value="css">CSS</option><option value="sql">SQL</option><option value="text">Văn bản</option></select></label><textarea value={block.text} onChange={(event) => updateBlock(block.id, { text: event.target.value })} rows={8} spellCheck={false} placeholder="Dán hoặc viết mã tại đây..." className="w-full resize-y rounded-lg border-2 border-[#1E293B] bg-[#111827] px-3 py-3 font-mono text-sm leading-6 text-slate-100 outline-none focus:border-[#A78BFA]" /></div> : null}
      {block.type === "callout" ? <div className="grid gap-3"><label className="grid max-w-xs gap-1 text-xs font-bold text-[#64748B]">Loại ghi chú<select value={block.calloutType} onChange={(event) => updateBlock(block.id, { calloutType: event.target.value as "tip" | "note" })} className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2 font-semibold outline-none focus:border-[#7C3AED]"><option value="note">Lưu ý</option><option value="tip">Mẹo hay</option></select></label><textarea value={block.text} onChange={(event) => updateBlock(block.id, { text: event.target.value })} rows={3} placeholder="Viết điều cần lưu ý..." className="w-full resize-y rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 text-sm outline-none focus:border-[#7C3AED]" /></div> : null}
      {block.type === "image" ? <div className="grid gap-3"><div className="flex flex-wrap items-center gap-3"><input ref={(node) => { fileInputs.current[block.id] = node; }} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="hidden" onChange={(event) => { const file = event.currentTarget.files?.[0]; if (file) void uploadImage(block.id, file); }} /><button type="button" disabled={uploadingId === block.id} onClick={() => fileInputs.current[block.id]?.click()} className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1E293B] bg-[#FBBF24] px-3 py-2 text-sm font-extrabold disabled:opacity-60"><Upload className="h-4 w-4" />{uploadingId === block.id ? "Đang tải ảnh..." : "Tải ảnh lên"}</button><span className="text-xs font-medium text-[#64748B]">JPG, PNG, WebP, GIF, AVIF · tối đa 10 MB</span></div><label className="grid gap-1 text-xs font-bold text-[#64748B]">Mô tả ảnh (alt text)<input value={block.alt ?? ""} onChange={(event) => updateBlock(block.id, { alt: event.target.value })} maxLength={240} placeholder="Mô tả ngắn gọn nội dung hình ảnh" className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal text-[#334155] outline-none focus:border-[#7C3AED]" /></label><label className="grid gap-1 text-xs font-bold text-[#64748B]">Hoặc dán URL ảnh<input value={block.src ?? ""} onChange={(event) => updateBlock(block.id, { src: event.target.value })} type="url" placeholder="https://..." className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal text-[#334155] outline-none focus:border-[#7C3AED]" /></label>{block.src ? <img src={block.src} alt={block.alt || "Xem trước hình ảnh"} className="max-h-96 rounded-lg border border-[#E2E8F0] object-contain" /> : null}</div> : null}
    </article>;
  }

  const splitStyle = {
    "--editor-width": `${split}%`,
    "--preview-width": `${100 - split}%`,
  } as CSSProperties;

  return <section ref={workspaceRef} style={splitStyle} className="relative flex min-h-0 flex-1 overflow-hidden border-t-2 border-[#1E293B] bg-[#F8FAFC]"><input name="content" type="hidden" value={serializeBlocks(blocks)} readOnly /><div className={`${showPreview ? "hidden lg:block lg:w-[var(--editor-width)] lg:shrink-0" : "block flex-1"} min-h-0 overflow-y-auto px-4 py-6 pb-28 sm:px-8`}><div className="mx-auto max-w-3xl space-y-3">{blocks.map(renderBlock)}{uploadError ? <p role="alert" className="rounded-lg bg-[#FFF1F2] px-3 py-2 text-sm font-bold text-[#BE123C]">{uploadError}</p> : null}</div></div>{showPreview ? <><button type="button" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); resize(event); }} onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) resize(event); }} className="relative z-10 hidden w-3 shrink-0 cursor-col-resize border-x border-[#CBD5E1] bg-[#EDE9FE] lg:block" aria-label="Kéo để thay đổi kích thước xem trước"><span className="absolute left-1/2 top-1/2 h-12 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C3AED]" /></button><div className="min-h-0 w-full lg:w-[var(--preview-width)] lg:shrink-0"><PreviewPane blocks={blocks} title={previewTitle} excerpt={previewExcerpt} /></div></> : null}<div className="fixed bottom-5 left-1/2 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-2xl border-2 border-[#1E293B] bg-white p-2 shadow-[0_12px_0_rgba(30,41,59,0.16)]">{blockOptions.map(({ type, label, icon: Icon }) => <button key={type} type="button" onClick={() => setBlocks((current) => [...current, createBlock(type)])} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-extrabold text-[#334155] hover:bg-[#EDE9FE] hover:text-[#6D28D9]" title={`Thêm ${label}`}><Icon className="h-4 w-4" /><span className="hidden sm:inline">{label}</span></button>)}<span className="mx-1 h-7 w-px bg-[#CBD5E1]" /><span className="hidden shrink-0 px-2 text-[10px] font-bold text-[#64748B] sm:inline"><ListPlus className="mr-1 inline h-3.5 w-3.5" />Thêm khối</span></div></section>;
}
