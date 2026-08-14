"use client";

/* The preview accepts either a private same-origin R2 proxy URL or an editor-provided external URL. */
/* eslint-disable @next/next/no-img-element */

import {
  useRef,
  useState,
  type CSSProperties,
  type SetStateAction,
} from "react";
import {
  ChevronDown,
  ChevronUp,
  Code2,
  Copy,
  GripVertical,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Lightbulb,
  ListPlus,
  List,
  ListOrdered,
  Plus,
  Pilcrow,
  Quote,
  Trash2,
  Upload,
} from "lucide-react";
import {
  CalloutRichTextEditor,
  CalloutRichTextPreview,
} from "@/features/content/components/callout-rich-text-editor";
import {
  CodeBlockEditor,
} from "@/features/content/components/code-block-editor";
import { Callout } from "@/components/mdx/callout";
import { CodeBlock } from "@/components/mdx/code-block";
import { Figure } from "@/components/mdx/figure";
import { ImageGrid } from "@/components/mdx/image-grid";

type BlockType =
  | "heading1"
  | "heading2"
  | "heading3"
  | "paragraph"
  | "bulletList"
  | "orderedList"
  | "quote"
  | "divider"
  | "code"
  | "callout"
  | "image"
  | "imageGallery";
export type PostEditorMode = "article" | "news";
type ImageGalleryLayout = "two" | "three" | "featured";
type CalloutType = "tip" | "note" | "info" | "warning" | "success" | "danger";
type CalloutTone = "violet" | "blue" | "green" | "yellow" | "red";
const calloutToneStyles: Record<CalloutTone, string> = {
  violet: "border-[#7C3AED] bg-[#F5F3FF] text-[#4C1D95]",
  blue: "border-[#2563EB] bg-[#EFF6FF] text-[#1E3A8A]",
  green: "border-[#059669] bg-[#ECFDF5] text-[#065F46]",
  yellow: "border-[#D97706] bg-[#FFFBEB] text-[#78350F]",
  red: "border-[#E11D48] bg-[#FFF1F2] text-[#881337]",
};
type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  sourceName: string;
  sourceUrl: string;
};

type EditorBlock = {
  id: string;
  type: BlockType;
  text: string;
  language?: string;
  calloutType?: CalloutType;
  calloutTone?: CalloutTone;
  calloutTitle?: string;
  src?: string;
  alt?: string;
  caption?: string;
  sourceName?: string;
  sourceUrl?: string;
  images?: GalleryImage[];
  layout?: ImageGalleryLayout;
};

const articleBlockOptions: Array<{
  type: BlockType;
  label: string;
  icon: typeof Heading1;
}> = [
  { type: "heading1", label: "Tiêu đề 1", icon: Heading1 },
  { type: "heading2", label: "Tiêu đề 2", icon: Heading2 },
  { type: "heading3", label: "Tiêu đề 3", icon: Heading3 },
  { type: "paragraph", label: "Đoạn văn", icon: Pilcrow },
  { type: "bulletList", label: "Danh sách", icon: List },
  { type: "orderedList", label: "Danh sách số", icon: ListOrdered },
  { type: "quote", label: "Trích dẫn", icon: Quote },
  { type: "divider", label: "Phân cách", icon: ListPlus },
  { type: "code", label: "Code", icon: Code2 },
  { type: "callout", label: "Lưu ý", icon: Lightbulb },
  { type: "image", label: "Ảnh", icon: ImageIcon },
  { type: "imageGallery", label: "Bộ ảnh", icon: ImageIcon },
];

const newsBlockOptions = articleBlockOptions.filter(
  (option) => option.type !== "code",
);

function createBlock(type: BlockType): EditorBlock {
  return {
    id: crypto.randomUUID(),
    type,
    text: "",
    ...(type === "code" ? { language: "typescript" } : {}),
    ...(type === "callout"
      ? { calloutType: "note" as const, calloutTone: "yellow" as const, calloutTitle: "" }
      : {}),
    ...(type === "image"
      ? { src: "", alt: "", caption: "", sourceName: "", sourceUrl: "" }
      : {}),
    ...(type === "imageGallery"
      ? {
          layout: "two" as const,
          images: [
            { src: "", alt: "", caption: "", sourceName: "", sourceUrl: "" },
            { src: "", alt: "", caption: "", sourceName: "", sourceUrl: "" },
          ],
        }
      : {}),
  };
}

function initialBlocks(mode: PostEditorMode): EditorBlock[] {
  if (mode === "news") {
    return [
      createBlock("paragraph"),
      createBlock("heading2"),
      createBlock("paragraph"),
      createBlock("heading2"),
      createBlock("paragraph"),
    ];
  }
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
    {
      ...createBlock("callout"),
      text: "Ghi chú quan trọng dành cho người đọc.",
      calloutType: "note",
    },
  ];
}

function serializeBlocks(blocks: EditorBlock[]) {
  const attribute = (value: string | undefined) =>
    (value ?? "").replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  const figure = (image: GalleryImage) =>
    `<Figure src="${attribute(image.src.trim())}" alt="${attribute((image.alt || "Hình ảnh minh họa").trim())}" caption="${attribute(image.caption.trim())}" sourceName="${attribute(image.sourceName.trim())}" sourceUrl="${attribute(image.sourceUrl.trim())}" />`;
  return blocks
    .map((block) => {
      const text = block.text.trim();
      if (block.type === "heading1") return text ? `# ${text}` : "";
      if (block.type === "heading2") return text ? `## ${text}` : "";
      if (block.type === "heading3") return text ? `### ${text}` : "";
      if (block.type === "paragraph") return text;
      if (block.type === "bulletList") return text ? text.split("\n").map((item) => item.trim()).filter(Boolean).map((item) => `- ${item.replace(/^[-*]\s*/, "")}`).join("\n") : "";
      if (block.type === "orderedList") return text ? text.split("\n").map((item) => item.trim()).filter(Boolean).map((item, index) => `${index + 1}. ${item.replace(/^\d+\.\s*/, "")}`).join("\n") : "";
      if (block.type === "quote") return text ? text.split("\n").map((line) => `> ${line}`).join("\n") : "";
      if (block.type === "divider") return "---";
      if (block.type === "code")
        return text
          ? `\`\`\`${block.language || "text"}\n${block.text}\n\`\`\``
          : "";
      if (block.type === "callout")
        return text
          ? `<Callout type="${block.calloutType || "note"}" tone="${block.calloutTone || "yellow"}" title="${attribute(block.calloutTitle?.trim())}">\n\n${text}\n\n</Callout>`
          : "";
      if (block.type === "image" && block.src?.trim())
        return figure({
          src: block.src,
          alt: block.alt ?? "",
          caption: block.caption ?? "",
          sourceName: block.sourceName ?? "",
          sourceUrl: block.sourceUrl ?? "",
        });
      if (block.type === "imageGallery") {
        const images = (block.images ?? []).filter((image) => image.src.trim());
        if (!images.length) return "";
        if (images.length === 1) return figure(images[0]);
        return `<ImageGrid layout="${block.layout ?? "two"}">\n\n${images.map(figure).join("\n\n")}\n\n</ImageGrid>`;
      }
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

function blocksFromContent(content: string, mode: PostEditorMode) {
  const normalizedContent = content.replace(/\r\n?/g, "\n");
  const protectedPattern =
    /```([\w-]*)\n([\s\S]*?)\n```|<Callout(?:\s+([^>]*))?>\s*([\s\S]*?)\s*<\/Callout>|<ImageGrid\s+layout="(two|three|featured)">\s*([\s\S]*?)\s*<\/ImageGrid>|<Figure\s+([^>]*?)\s*\/>/g;
  const decode = (value: string) =>
    value.replaceAll("&quot;", '"').replaceAll("&amp;", "&");
  const figureFromAttributes = (attributes: string) => {
    const value = (name: string) =>
      decode(attributes.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? "");
    return {
      src: value("src"),
      alt: value("alt"),
      caption: value("caption"),
      sourceName: value("sourceName"),
      sourceUrl: value("sourceUrl"),
    };
  };
  const blocks: EditorBlock[] = [];
  const addPlainText = (value: string) => {
    value
      .split(/\n{2,}/)
      .map((part) => part.trim())
      .filter(Boolean)
      .forEach((part) => {
        const heading = part.match(/^(#{1,3})\s+(.+)$/);
        const image = part.match(/^!\[([^\]]*)\]\(([\s\S]+)\)$/);
        const list = part.split("\n").every((line) => /^[-*]\s+/.test(line));
        const orderedList = part.split("\n").every((line) => /^\d+\.\s+/.test(line));
        const quote = part.split("\n").every((line) => /^>\s?/.test(line));
        if (part === "---") blocks.push(createBlock("divider"));
        else if (heading)
          blocks.push({
            ...createBlock(heading[1].length === 1 ? "heading1" : heading[1].length === 2 ? "heading2" : "heading3"),
            text: heading[2],
          });
        else if (image)
          blocks.push({
            ...createBlock("image"),
            src: image[2],
            alt: image[1],
          });
        else if (list) blocks.push({ ...createBlock("bulletList"), text: part.split("\n").map((line) => line.replace(/^[-*]\s+/, "")).join("\n") });
        else if (orderedList) blocks.push({ ...createBlock("orderedList"), text: part.split("\n").map((line) => line.replace(/^\d+\.\s+/, "")).join("\n") });
        else if (quote) blocks.push({ ...createBlock("quote"), text: part.split("\n").map((line) => line.replace(/^>\s?/, "")).join("\n") });
        else blocks.push({ ...createBlock("paragraph"), text: part });
      });
  };
  let lastIndex = 0;
  for (const match of normalizedContent.matchAll(protectedPattern)) {
    addPlainText(normalizedContent.slice(lastIndex, match.index));
    if (match[2] !== undefined)
      blocks.push({
        ...createBlock("code"),
        language: match[1] || "text",
        text: match[2],
      });
    else if (match[4] !== undefined) {
      const calloutAttributes = match[3] ?? "";
      const calloutValue = (name: string) => decode(calloutAttributes.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? "");
      const calloutType = (calloutValue("type") || "note") as CalloutType;
      blocks.push({
        ...createBlock("callout"),
        calloutType,
        calloutTone: (calloutValue("tone") as CalloutTone) || (calloutType === "tip" ? "green" : "yellow"),
        calloutTitle: calloutValue("title"),
        text: match[4].trim(),
      });
    }
    else if (match[6] !== undefined) {
      const figures = [...match[6].matchAll(/<Figure\s+([^>]*?)\s*\/>/g)].map(
        (image) => figureFromAttributes(image[1]),
      );
      const markdownImages = [
        ...match[6].matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g),
      ].map((image) => ({
        alt: image[1],
        src: image[2],
        caption: "",
        sourceName: "",
        sourceUrl: "",
      }));
      const images = figures.length ? figures : markdownImages;
      blocks.push(
        images.length > 1
          ? {
              ...createBlock("imageGallery"),
              layout: match[5] as ImageGalleryLayout,
              images,
            }
          : { ...createBlock("image"), ...(images[0] ?? {}) },
      );
    } else
      blocks.push({
        ...createBlock("image"),
        ...figureFromAttributes(match[7] ?? ""),
      });
    lastIndex = (match.index ?? 0) + match[0].length;
  }
  addPlainText(normalizedContent.slice(lastIndex));
  return blocks.length ? blocks : initialBlocks(mode);
}

function galleryGridClass(layout: ImageGalleryLayout | undefined) {
  if (layout === "three") return "grid-cols-1 sm:grid-cols-3";
  if (layout === "featured")
    return "grid-cols-1 sm:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)]";
  return "grid-cols-1 sm:grid-cols-2";
}

function PreviewPane({
  blocks,
  title,
  excerpt,
  mode = "article",
}: {
  blocks: EditorBlock[];
  title: string;
  excerpt: string;
  mode?: PostEditorMode;
}) {
  return (
    <aside className="h-full overflow-y-auto bg-[#FFFDF5] px-6 py-10 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-3xl">
        <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-[#8B5CF6]">
          {mode === "news" ? "BẢN TIN XEM TRƯỚC" : "BẢN XEM TRƯỚC"}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#1E293B] sm:text-4xl">
          {title || (mode === "news" ? "Tiêu đề tin tức" : "Tiêu đề bài viết")}
        </h1>
        {excerpt ? (
          <p className="mt-4 text-base leading-7 text-[#64748B]">{excerpt}</p>
        ) : null}
        <div className="mt-10 border-t-2 border-[#1E293B] pt-8">
          {blocks.map((block) => {
            if (
              !block.text.trim() &&
              block.type !== "image" &&
              block.type !== "imageGallery" &&
              block.type !== "divider"
            )
              return null;
            if (block.type === "heading1")
              return (
                <h1
                  key={block.id}
                  className="mt-10 text-3xl font-extrabold text-[#1E293B]"
                >
                  {block.text}
                </h1>
              );
            if (block.type === "heading2")
              return (
                <h2
                  key={block.id}
                  className="mt-10 scroll-mt-24 text-2xl font-extrabold tracking-tight text-[#1E293B]"
                >
                  {block.text}
                </h2>
              );
            if (block.type === "heading3")
              return (
                <h3
                  key={block.id}
                  className="mt-7 scroll-mt-24 text-xl font-extrabold text-[#1E293B]"
                >
                  {block.text}
                </h3>
              );
            if (block.type === "paragraph")
              return (
                <div key={block.id} className="mt-3">
                  <CalloutRichTextPreview value={block.text} variant="article" />
                </div>
              );
            if (block.type === "bulletList")
              return <div key={block.id} className="mt-4"><CalloutRichTextPreview value={block.text.split("\n").filter(Boolean).map((item) => `- ${item.replace(/^[-*]\s*/, "")}`).join("\n")} variant="article" /></div>;
            if (block.type === "orderedList")
              return <div key={block.id} className="mt-4"><CalloutRichTextPreview value={block.text.split("\n").filter(Boolean).map((item, index) => `${index + 1}. ${item.replace(/^\d+\.\s*/, "")}`).join("\n")} variant="article" /></div>;
            if (block.type === "quote")
              return <blockquote key={block.id} className="my-6 border-l-4 border-[#8B5CF6] pl-5 text-lg font-semibold italic leading-8 text-[#475569]"><CalloutRichTextPreview value={block.text} variant="article" /></blockquote>;
            if (block.type === "divider")
              return <hr key={block.id} className="my-10 border-0 border-t-2 border-[#CBD5E1]" />;
            if (block.type === "callout")
              return (
                <Callout key={block.id} type={block.calloutType} tone={block.calloutTone} title={block.calloutTitle}>
                  <CalloutRichTextPreview value={block.text} />
                </Callout>
              );
            if (block.type === "code")
              return (
                <CodeBlock key={block.id}>
                  <code className={`language-${block.language || "text"}`}>{block.text}</code>
                </CodeBlock>
              );
            if (block.type === "image" && block.src)
              return <Figure key={block.id} src={block.src} alt={block.alt} caption={block.caption} sourceName={block.sourceName} sourceUrl={block.sourceUrl} />;
            if (block.type === "imageGallery") {
              const images = (block.images ?? []).filter((image) => image.src);
              return images.length ? (
                <ImageGrid
                  key={block.id}
                  layout={block.layout}
                >
                  {images.map((image, imageIndex) => (
                    <Figure key={`${block.id}-${imageIndex}`} {...image} />
                  ))}
                </ImageGrid>
              ) : null;
            }
            return null;
          })}
        </div>
      </div>
    </aside>
  );
}

export function PostBlockEditor({
  showPreview,
  previewTitle,
  previewExcerpt,
  mode = "article",
  initialContent,
  onDirty,
  toolbarVisible = true,
  workspaceVisible = true,
}: {
  showPreview: boolean;
  previewTitle: string;
  previewExcerpt: string;
  mode?: PostEditorMode;
  initialContent?: string;
  onDirty?: () => void;
  toolbarVisible?: boolean;
  workspaceVisible?: boolean;
}) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(() =>
    initialContent
      ? blocksFromContent(initialContent, mode)
      : initialBlocks(mode),
  );
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [split, setSplit] = useState(52);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const blockOptions = mode === "news" ? newsBlockOptions : articleBlockOptions;
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  function changeBlocks(update: SetStateAction<EditorBlock[]>) {
    onDirty?.();
    setBlocks(update);
  }

  function updateBlock(id: string, patch: Partial<EditorBlock>) {
    changeBlocks((current) =>
      current.map((block) =>
        block.id === id ? { ...block, ...patch } : block,
      ),
    );
  }

  function updateGalleryImage(
    blockId: string,
    imageIndex: number,
    patch: Partial<GalleryImage>,
  ) {
    changeBlocks((current) =>
      current.map((block) => {
        if (block.id !== blockId) return block;
        return {
          ...block,
          images: (block.images ?? []).map((image, index) =>
            index === imageIndex ? { ...image, ...patch } : image,
          ),
        };
      }),
    );
  }

  function moveGalleryImage(
    blockId: string,
    imageIndex: number,
    direction: -1 | 1,
  ) {
    changeBlocks((current) =>
      current.map((block) => {
        if (block.id !== blockId || !block.images) return block;
        const target = imageIndex + direction;
        if (target < 0 || target >= block.images.length) return block;
        const images = [...block.images];
        [images[imageIndex], images[target]] = [
          images[target],
          images[imageIndex],
        ];
        return { ...block, images };
      }),
    );
  }

  function moveBlock(id: string, direction: -1 | 1) {
    changeBlocks((current) => {
      const index = current.findIndex((block) => block.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function duplicateBlock(id: string) {
    changeBlocks((current) => {
      const index = current.findIndex((block) => block.id === id);
      if (index < 0) return current;
      const source = current[index];
      const duplicate: EditorBlock = {
        ...source,
        id: crypto.randomUUID(),
        images: source.images?.map((image) => ({ ...image })),
      };
      const next = [...current];
      next.splice(index + 1, 0, duplicate);
      return next;
    });
  }

  function insertParagraphAfter(id: string) {
    changeBlocks((current) => {
      const index = current.findIndex((block) => block.id === id);
      if (index < 0) return current;
      const next = [...current];
      next.splice(index + 1, 0, createBlock("paragraph"));
      return next;
    });
  }

  function dropBlock(targetId: string) {
    if (!draggedId || draggedId === targetId) return;
    changeBlocks((current) => {
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
    setSplit(
      Math.min(
        72,
        Math.max(28, ((event.clientX - bounds.left) / bounds.width) * 100),
      ),
    );
  }

  async function uploadImage(blockId: string, file: File) {
    setUploadError(null);
    setUploadingId(blockId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/post-images/upload", {
        method: "POST",
        body: formData,
      });
      const upload = (await response.json()) as {
        error?: string;
        key?: string;
      };
      if (!response.ok || !upload.key)
        throw new Error(upload.error ?? "Không thể tải hình ảnh lên.");
      const path = upload.key
        .replace(/^post-images\//, "")
        .split("/")
        .map(encodeURIComponent)
        .join("/");
      updateBlock(blockId, {
        src: `/api/post-images/${path}`,
        alt: file.name.replace(/\.[^.]+$/, ""),
      });
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Không thể tải hình ảnh lên.",
      );
    } finally {
      setUploadingId(null);
    }
  }

  async function uploadGalleryImage(
    blockId: string,
    imageIndex: number,
    file: File,
  ) {
    const uploadId = `${blockId}:${imageIndex}`;
    setUploadError(null);
    setUploadingId(uploadId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/post-images/upload", {
        method: "POST",
        body: formData,
      });
      const upload = (await response.json()) as {
        error?: string;
        key?: string;
      };
      if (!response.ok || !upload.key)
        throw new Error(upload.error ?? "Không thể tải hình ảnh lên.");
      const path = upload.key
        .replace(/^post-images\//, "")
        .split("/")
        .map(encodeURIComponent)
        .join("/");
      updateGalleryImage(blockId, imageIndex, {
        src: `/api/post-images/${path}`,
        alt: file.name.replace(/\.[^.]+$/, ""),
      });
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Không thể tải hình ảnh lên.",
      );
    } finally {
      setUploadingId(null);
    }
  }

  function renderBlock(block: EditorBlock, index: number) {
    return (
      <article
        key={block.id}
        draggable
        onDragStart={() => setDraggedId(block.id)}
        onDragEnd={() => setDraggedId(null)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={() => dropBlock(block.id)}
        className={`rounded-xl border-2 bg-white p-4 ${draggedId === block.id ? "border-[#A78BFA] opacity-60" : "border-[#E2E8F0]"}`}
      >
        <div className="mb-3 flex items-center gap-2">
          <button
            type="button"
            className="cursor-grab rounded-md p-1.5 text-[#94A3B8] hover:bg-[#F1F5F9]"
            aria-label="Kéo để sắp xếp"
          >
            <GripVertical className="h-5 w-5" />
          </button>
          <span className="mr-auto text-xs font-extrabold uppercase tracking-wide text-[#64748B]">
            {blockOptions.find((option) => option.type === block.type)?.label}
          </span>
          <button
            type="button"
            onClick={() => insertParagraphAfter(block.id)}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#EDE9FE] hover:text-[#6D28D9]"
            aria-label="Thêm đoạn văn bên dưới"
            title="Thêm đoạn bên dưới"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => duplicateBlock(block.id)}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F1F5F9]"
            aria-label="Nhân bản khối"
            title="Nhân bản khối"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => moveBlock(block.id, -1)}
            disabled={index === 0}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-30"
            aria-label="Đưa khối lên"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => moveBlock(block.id, 1)}
            disabled={index === blocks.length - 1}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-30"
            aria-label="Đưa khối xuống"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              changeBlocks((current) =>
                current.filter((item) => item.id !== block.id),
              )
            }
            className="rounded-md p-1.5 text-[#BE123C] hover:bg-[#FFF1F2]"
            aria-label="Xóa khối"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        {block.type === "heading1" || block.type === "heading2" || block.type === "heading3" ? (
          <input
            value={block.text}
            onChange={(event) =>
              updateBlock(block.id, { text: event.target.value })
            }
            maxLength={255}
            placeholder={
              block.type === "heading1" ? "Tiêu đề chính" : block.type === "heading2" ? "Tiêu đề phần" : "Tiêu đề phụ"
            }
            className="w-full rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-bold text-[#1E293B] outline-none focus:border-[#7C3AED]"
          />
        ) : null}
        {block.type === "paragraph" ? (
          <textarea
            value={block.text}
            onChange={(event) =>
              updateBlock(block.id, { text: event.target.value })
            }
            rows={4}
            placeholder="Viết nội dung đoạn văn..."
            className="w-full resize-y rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 text-sm leading-6 text-[#334155] outline-none focus:border-[#7C3AED]"
          />
        ) : null}
        {block.type === "bulletList" ? (
          <textarea value={block.text} onChange={(event) => updateBlock(block.id, { text: event.target.value })} rows={4} placeholder={"Mỗi dòng là một mục\nMục tiếp theo"} className="w-full resize-y rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 text-sm leading-6 text-[#334155] outline-none focus:border-[#7C3AED]" />
        ) : null}
        {block.type === "orderedList" ? (
          <textarea value={block.text} onChange={(event) => updateBlock(block.id, { text: event.target.value })} rows={4} placeholder={"Mỗi dòng là một mục có thứ tự\nMục tiếp theo"} className="w-full resize-y rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 text-sm leading-6 text-[#334155] outline-none focus:border-[#7C3AED]" />
        ) : null}
        {block.type === "quote" ? (
          <textarea value={block.text} onChange={(event) => updateBlock(block.id, { text: event.target.value })} rows={3} placeholder="Nội dung trích dẫn" className="w-full resize-y rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 text-sm italic leading-6 text-[#334155] outline-none focus:border-[#7C3AED]" />
        ) : null}
        {block.type === "divider" ? <div className="py-4"><hr className="border-[#CBD5E1]" /></div> : null}
        {block.type === "code" ? (
          <div className="grid gap-3">
            <label className="grid max-w-xs gap-1 text-xs font-bold text-[#64748B]">
              Ngôn ngữ
              <select
                value={block.language}
                onChange={(event) =>
                  updateBlock(block.id, { language: event.target.value })
                }
                className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2 font-semibold outline-none focus:border-[#7C3AED]"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="bash">Bash</option>
                <option value="json">JSON</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="sql">SQL</option>
                <option value="text">Văn bản</option>
              </select>
            </label>
            <CodeBlockEditor
              value={block.text}
              language={block.language || "text"}
              onChange={(text) => updateBlock(block.id, { text })}
            />
          </div>
        ) : null}
        {block.type === "callout" ? (
          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-xs font-bold text-[#64748B]">
                Mục đích
                <select value={block.calloutType} onChange={(event) => updateBlock(block.id, { calloutType: event.target.value as CalloutType })} className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2 font-semibold outline-none focus:border-[#7C3AED]">
                  <option value="note">Ghi chú</option>
                  <option value="tip">Mẹo hay</option>
                  <option value="info">Thông tin</option>
                  <option value="warning">Cảnh báo</option>
                  <option value="success">Kết quả tốt</option>
                  <option value="danger">Nguy hiểm</option>
                </select>
              </label>
              <label className="grid gap-1 text-xs font-bold text-[#64748B]">
                Màu hiển thị
                <select value={block.calloutTone} onChange={(event) => updateBlock(block.id, { calloutTone: event.target.value as CalloutTone })} className={`rounded-lg border-2 px-3 py-2 font-semibold outline-none focus:border-[#7C3AED] ${calloutToneStyles[block.calloutTone ?? "yellow"]}`}>
                  <option value="violet">Tím</option>
                  <option value="blue">Xanh dương</option>
                  <option value="green">Xanh lá</option>
                  <option value="yellow">Vàng</option>
                  <option value="red">Đỏ</option>
                </select>
              </label>
            </div>
            <label className="grid gap-1 text-xs font-bold text-[#64748B]">
              Tiêu đề tùy chọn
              <input value={block.calloutTitle ?? ""} onChange={(event) => updateBlock(block.id, { calloutTitle: event.target.value })} maxLength={120} placeholder="Ví dụ: Trước khi tiếp tục" className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal text-[#334155] outline-none focus:border-[#7C3AED]" />
            </label>
            <div>
              <span className="mb-1 block text-xs font-bold text-[#64748B]">Nội dung</span>
              <CalloutRichTextEditor value={block.text} onChange={(text) => updateBlock(block.id, { text })} />
            </div>
          </div>
        ) : null}
        {block.type === "image" ? (
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={(node) => {
                  fileInputs.current[block.id] = node;
                }}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                className="hidden"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (file) void uploadImage(block.id, file);
                }}
              />
              <button
                type="button"
                disabled={uploadingId === block.id}
                onClick={() => fileInputs.current[block.id]?.click()}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1E293B] bg-[#FBBF24] px-3 py-2 text-sm font-extrabold disabled:opacity-60"
              >
                <Upload className="h-4 w-4" />
                {uploadingId === block.id ? "Đang tải ảnh..." : "Tải ảnh lên"}
              </button>
              <span className="text-xs font-medium text-[#64748B]">
                JPG, PNG, WebP, GIF, AVIF · tối đa 10 MB
              </span>
            </div>
            <label className="grid gap-1 text-xs font-bold text-[#64748B]">
              Mô tả ảnh (alt text)
              <input
                value={block.alt ?? ""}
                onChange={(event) =>
                  updateBlock(block.id, { alt: event.target.value })
                }
                maxLength={240}
                placeholder="Mô tả nội dung ảnh cho trình đọc màn hình"
                className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal text-[#334155] outline-none focus:border-[#7C3AED]"
              />
            </label>
            <label className="grid gap-1 text-xs font-bold text-[#64748B]">
              Chú thích ảnh
              <input
                value={block.caption ?? ""}
                onChange={(event) =>
                  updateBlock(block.id, { caption: event.target.value })
                }
                maxLength={300}
                placeholder="Thông tin hiển thị bên dưới ảnh"
                className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal text-[#334155] outline-none focus:border-[#7C3AED]"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-xs font-bold text-[#64748B]">
                Tên nguồn ảnh
                <input
                  value={block.sourceName ?? ""}
                  onChange={(event) =>
                    updateBlock(block.id, { sourceName: event.target.value })
                  }
                  maxLength={120}
                  placeholder="Ví dụ: Unsplash"
                  className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal text-[#334155] outline-none focus:border-[#7C3AED]"
                />
              </label>
              <label className="grid gap-1 text-xs font-bold text-[#64748B]">
                Link nguồn ảnh
                <input
                  value={block.sourceUrl ?? ""}
                  onChange={(event) =>
                    updateBlock(block.id, { sourceUrl: event.target.value })
                  }
                  type="url"
                  placeholder="https://..."
                  className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal text-[#334155] outline-none focus:border-[#7C3AED]"
                />
              </label>
            </div>
            <label className="grid gap-1 text-xs font-bold text-[#64748B]">
              URL ảnh
              <input
                value={block.src ?? ""}
                onChange={(event) =>
                  updateBlock(block.id, { src: event.target.value })
                }
                type="url"
                placeholder="https://..."
                className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2.5 font-normal text-[#334155] outline-none focus:border-[#7C3AED]"
              />
            </label>
            {block.src ? (
              <img
                src={block.src}
                alt={block.alt || "Xem trước hình ảnh"}
                className="max-h-96 rounded-lg border border-[#E2E8F0] object-contain"
              />
            ) : null}
          </div>
        ) : null}
        {block.type === "imageGallery" ? (
          <div className="grid gap-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <label className="grid gap-1 text-xs font-bold text-[#64748B]">
                Bố cục
                <select
                  value={block.layout ?? "two"}
                  onChange={(event) =>
                    updateBlock(block.id, {
                      layout: event.target.value as ImageGalleryLayout,
                    })
                  }
                  className="rounded-lg border-2 border-[#CBD5E1] px-3 py-2 font-semibold outline-none focus:border-[#7C3AED]"
                >
                  <option value="two">2 ảnh đều nhau</option>
                  <option value="three">3 ảnh trên một hàng</option>
                  <option value="featured">Ảnh chính và ảnh phụ</option>
                </select>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateBlock(block.id, {
                      images: [
                        ...(block.images ?? []),
                        {
                          src: "",
                          alt: "",
                          caption: "",
                          sourceName: "",
                          sourceUrl: "",
                        },
                      ],
                    })
                  }
                  disabled={(block.images?.length ?? 0) >= 3}
                  className="rounded-lg border-2 border-[#1E293B] bg-[#FBBF24] px-3 py-2 text-xs font-extrabold disabled:opacity-40"
                >
                  Thêm ảnh
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateBlock(block.id, {
                      images: (block.images ?? []).slice(0, -1),
                    })
                  }
                  disabled={(block.images?.length ?? 0) <= 2}
                  className="rounded-lg border-2 border-[#CBD5E1] bg-white px-3 py-2 text-xs font-extrabold disabled:opacity-40"
                >
                  Bớt ảnh
                </button>
              </div>
            </div>
            <div className={`grid gap-3 ${galleryGridClass(block.layout)}`}>
              {(block.images ?? []).map((image, imageIndex) => {
                const fileInputId = `${block.id}:${imageIndex}`;
                return (
                  <div
                    key={fileInputId}
                    className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#475569]">
                        Ảnh {imageIndex + 1}
                      </span>
                      <span className="flex gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            moveGalleryImage(block.id, imageIndex, -1)
                          }
                          disabled={imageIndex === 0}
                          className="rounded p-1 text-[#64748B] hover:bg-white disabled:opacity-30"
                          aria-label="Đưa ảnh lên trước"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            moveGalleryImage(block.id, imageIndex, 1)
                          }
                          disabled={
                            imageIndex === (block.images?.length ?? 0) - 1
                          }
                          className="rounded p-1 text-[#64748B] hover:bg-white disabled:opacity-30"
                          aria-label="Đưa ảnh về sau"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    </div>
                    <input
                      ref={(node) => {
                        fileInputs.current[fileInputId] = node;
                      }}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        if (file)
                          void uploadGalleryImage(block.id, imageIndex, file);
                      }}
                    />
                    <button
                      type="button"
                      disabled={uploadingId === fileInputId}
                      onClick={() => fileInputs.current[fileInputId]?.click()}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#1E293B] bg-white px-2.5 py-2 text-xs font-extrabold disabled:opacity-60"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      {uploadingId === fileInputId ? "Đang tải" : "Tải ảnh"}
                    </button>
                    <label className="mt-2 grid gap-1 text-[11px] font-bold text-[#64748B]">
                      URL ảnh
                      <input
                        value={image.src}
                        onChange={(event) =>
                          updateGalleryImage(block.id, imageIndex, {
                            src: event.target.value,
                          })
                        }
                        type="url"
                        placeholder="https://..."
                        className="rounded-lg border border-[#CBD5E1] px-2.5 py-2 text-xs font-normal text-[#334155] outline-none focus:border-[#7C3AED]"
                      />
                    </label>
                    <label className="mt-2 grid gap-1 text-[11px] font-bold text-[#64748B]">
                      Alt text
                      <input
                        value={image.alt}
                        onChange={(event) =>
                          updateGalleryImage(block.id, imageIndex, {
                            alt: event.target.value,
                          })
                        }
                        maxLength={240}
                        placeholder="Mô tả ảnh"
                        className="rounded-lg border border-[#CBD5E1] px-2.5 py-2 text-xs font-normal text-[#334155] outline-none focus:border-[#7C3AED]"
                      />
                    </label>
                    <label className="mt-2 grid gap-1 text-[11px] font-bold text-[#64748B]">
                      Chú thích
                      <input
                        value={image.caption}
                        onChange={(event) =>
                          updateGalleryImage(block.id, imageIndex, {
                            caption: event.target.value,
                          })
                        }
                        maxLength={300}
                        placeholder="Chú thích hiển thị"
                        className="rounded-lg border border-[#CBD5E1] px-2.5 py-2 text-xs font-normal text-[#334155] outline-none focus:border-[#7C3AED]"
                      />
                    </label>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <label className="grid gap-1 text-[11px] font-bold text-[#64748B]">
                        Tên nguồn
                        <input
                          value={image.sourceName}
                          onChange={(event) =>
                            updateGalleryImage(block.id, imageIndex, {
                              sourceName: event.target.value,
                            })
                          }
                          maxLength={120}
                          className="rounded-lg border border-[#CBD5E1] px-2.5 py-2 text-xs font-normal text-[#334155] outline-none focus:border-[#7C3AED]"
                        />
                      </label>
                      <label className="grid gap-1 text-[11px] font-bold text-[#64748B]">
                        Link nguồn
                        <input
                          value={image.sourceUrl}
                          onChange={(event) =>
                            updateGalleryImage(block.id, imageIndex, {
                              sourceUrl: event.target.value,
                            })
                          }
                          type="url"
                          placeholder="https://..."
                          className="rounded-lg border border-[#CBD5E1] px-2.5 py-2 text-xs font-normal text-[#334155] outline-none focus:border-[#7C3AED]"
                        />
                      </label>
                    </div>
                    {image.src ? (
                      <img
                        src={image.src}
                        alt={image.alt || "Xem trước hình ảnh"}
                        className="mt-2 aspect-[4/3] w-full rounded-lg object-cover"
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </article>
    );
  }

  const splitStyle = {
    "--editor-width": `${split}%`,
    "--preview-width": `${100 - split}%`,
  } as CSSProperties;
  const serializedContent = serializeBlocks(blocks);
  const wordCount = serializedContent.replace(/<[^>]+>|[#>*`_-]/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const estimatedMinutes = Math.max(1, Math.ceil(wordCount / 220));

  return (
    <section
      ref={workspaceRef}
      style={splitStyle}
      className={`${workspaceVisible ? "flex" : "hidden"} relative min-h-0 flex-1 overflow-hidden border-t-2 border-[#1E293B] bg-[#F8FAFC]`}
    >
      <input
        name="content"
        type="hidden"
        value={serializedContent}
        readOnly
      />
      <div
        className={`${showPreview ? "hidden lg:block lg:w-[var(--editor-width)] lg:shrink-0" : "block flex-1"} min-h-0 overflow-y-auto px-4 py-6 pb-28 sm:px-8`}
      >
        <div className="mx-auto max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-[11px] font-bold text-[#64748B]" aria-live="polite"><span>{blocks.length} khối</span><span>{wordCount.toLocaleString("vi-VN")} từ</span><span>Khoảng {estimatedMinutes} phút đọc</span><span className="ml-auto">Ctrl/Cmd+S để lưu</span></div>
          {blocks.map(renderBlock)}
          {uploadError ? (
            <p
              role="alert"
              className="rounded-lg bg-[#FFF1F2] px-3 py-2 text-sm font-bold text-[#BE123C]"
            >
              {uploadError}
            </p>
          ) : null}
        </div>
      </div>
      {showPreview ? (
        <>
          <button
            type="button"
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              resize(event);
            }}
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId))
                resize(event);
            }}
            className="relative z-10 hidden w-3 shrink-0 cursor-col-resize border-x border-[#CBD5E1] bg-[#EDE9FE] lg:block"
            aria-label="Kéo để thay đổi kích thước xem trước"
          >
            <span className="absolute left-1/2 top-1/2 h-12 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C3AED]" />
          </button>
          <div className="min-h-0 w-full lg:w-[var(--preview-width)] lg:shrink-0">
            <PreviewPane
              blocks={blocks}
              title={previewTitle}
              excerpt={previewExcerpt}
              mode={mode}
            />
          </div>
        </>
      ) : null}
      {toolbarVisible ? <div className="fixed bottom-5 left-1/2 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-2xl border-2 border-[#1E293B] bg-white p-2 shadow-[0_12px_0_rgba(30,41,59,0.16)]">
        {blockOptions.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            type="button"
            onClick={() =>
              changeBlocks((current) => [...current, createBlock(type)])
            }
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-extrabold text-[#334155] hover:bg-[#EDE9FE] hover:text-[#6D28D9]"
            title={`Thêm ${label}`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
        <span className="mx-1 h-7 w-px bg-[#CBD5E1]" />
        <span className="hidden shrink-0 px-2 text-[10px] font-bold text-[#64748B] sm:inline">
          <ListPlus className="mr-1 inline h-3.5 w-3.5" />
          Thêm khối
        </span>
      </div> : null}
    </section>
  );
}
