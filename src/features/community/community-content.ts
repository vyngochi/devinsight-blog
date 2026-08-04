export const COMMUNITY_TOPICS = [
  "JavaScript",
  "TypeScript",
  "Java",
  "C#",
  "Web",
  "Git & GitHub",
  "Thuật toán",
  "Khác",
] as const;

export const CODE_LANGUAGES = [
  "plaintext",
  "javascript",
  "typescript",
  "java",
  "csharp",
  "html",
  "css",
  "json",
  "bash",
  "sql",
] as const;

export type CommunityTopic = (typeof COMMUNITY_TOPICS)[number];
export type CommunityDocument = {
  type: "doc";
  content: CommunityNode[];
};

type CommunityNode = {
  type: string;
  text?: string;
  attrs?: { level?: number; language?: string };
  marks?: { type: string }[];
  content?: CommunityNode[];
};

const allowedNodeTypes = new Set([
  "doc",
  "paragraph",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "codeBlock",
  "hardBreak",
  "text",
]);
const allowedMarkTypes = new Set(["bold", "italic", "code"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readNode(value: unknown, fragments: string[]): CommunityNode | null {
  if (
    !isRecord(value) ||
    typeof value.type !== "string" ||
    !allowedNodeTypes.has(value.type)
  )
    return null;
  const node: CommunityNode = { type: value.type };

  if (value.type === "text") {
    if (typeof value.text !== "string" || value.text.length > 12_000)
      return null;
    node.text = value.text;
    fragments.push(value.text);
  }

  if (value.type === "heading") {
    const level = isRecord(value.attrs) ? value.attrs.level : undefined;
    if (level !== 2 && level !== 3) return null;
    node.attrs = { level };
  }

  if (value.type === "codeBlock") {
    const language = isRecord(value.attrs) ? value.attrs.language : undefined;
    if (
      typeof language !== "string" ||
      !CODE_LANGUAGES.includes(language as (typeof CODE_LANGUAGES)[number])
    )
      return null;
    node.attrs = { language };
  }

  if (value.marks !== undefined) {
    if (
      !Array.isArray(value.marks) ||
      value.marks.some(
        (mark) =>
          !isRecord(mark) ||
          typeof mark.type !== "string" ||
          !allowedMarkTypes.has(mark.type),
      )
    )
      return null;
    node.marks = value.marks.map((mark) => ({ type: mark.type as string }));
  }

  if (value.content !== undefined) {
    if (!Array.isArray(value.content)) return null;
    const content = value.content.map((child) => readNode(child, fragments));
    if (content.some((child) => child === null)) return null;
    node.content = content as CommunityNode[];
  }

  return node;
}

export function parseCommunityDocument(value: FormDataEntryValue | null) {
  if (typeof value !== "string") throw new Error("Nội dung không hợp lệ.");
  let source: unknown;
  try {
    source = JSON.parse(value);
  } catch {
    throw new Error("Không thể đọc nội dung soạn thảo.");
  }

  const fragments: string[] = [];
  const document = readNode(source, fragments);
  if (!document || document.type !== "doc" || !document.content?.length) {
    throw new Error("Nội dung không hợp lệ.");
  }

  const text = fragments.join(" ").replace(/\s+/g, " ").trim();
  if (text.length < 12) throw new Error("Nội dung cần có ít nhất 12 ký tự.");
  if (text.length > 12_000)
    throw new Error("Nội dung vượt quá giới hạn 12.000 ký tự.");
  return { document: document as CommunityDocument, text };
}

export function isCommunityTopic(value: string): value is CommunityTopic {
  return COMMUNITY_TOPICS.includes(value as CommunityTopic);
}

export function createCommunitySlug(title: string) {
  const readablePart =
    title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/gi, "d")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "cau-hoi";
  return `${readablePart}-${crypto.randomUUID().slice(0, 8)}`;
}
