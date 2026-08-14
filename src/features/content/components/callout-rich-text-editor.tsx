"use client";

import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/core";
import { Bold, Code2, Italic, Link2, List, ListOrdered, Strikethrough } from "lucide-react";

function inlineMarkdown(text: string, marks: JSONContent["marks"] = []) {
  return (marks ?? []).reduce((value, mark) => {
    if (mark.type === "bold") return `**${value}**`;
    if (mark.type === "italic") return `*${value}*`;
    if (mark.type === "strike") return `~~${value}~~`;
    if (mark.type === "code") return `\`${value}\``;
    if (mark.type === "link") return `[${value}](${String(mark.attrs?.href ?? "")})`;
    return value;
  }, text.replaceAll("\\", "\\\\"));
}

function inlineContentMarkdown(nodes: JSONContent[] = []): string {
  return nodes.map((node) => {
    if (node.type === "text") return inlineMarkdown(node.text ?? "", node.marks);
    if (node.type === "hardBreak") return "  \n";
    return inlineContentMarkdown(node.content);
  }).join("");
}

function contentMarkdown(nodes: JSONContent[] = []): string {
  return nodes.map((node) => {
    if (node.type === "paragraph") return inlineContentMarkdown(node.content);
    if (node.type === "bulletList") return (node.content ?? []).map((item) => `- ${contentMarkdown(item.content).replace(/\n/g, "\n  ")}`).join("\n");
    if (node.type === "orderedList") return (node.content ?? []).map((item, index) => `${index + 1}. ${contentMarkdown(item.content).replace(/\n/g, "\n   ")}`).join("\n");
    if (node.type === "listItem") return contentMarkdown(node.content);
    return inlineContentMarkdown([node]);
  }).join("\n\n");
}

function markdownToHtml(markdown: string) {
  const escape = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const inline = (value: string) => escape(value)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/~~([^~]+)~~/g, "<s>$1</s>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  const blocks = markdown.trim().split(/\n{2,}/).filter(Boolean);
  return blocks.map((block) => {
    const lines = block.split("\n");
    if (lines.every((line) => /^-\s+/.test(line))) return `<ul>${lines.map((line) => `<li>${inline(line.replace(/^-\s+/, ""))}</li>`).join("")}</ul>`;
    if (lines.every((line) => /^\d+\.\s+/.test(line))) return `<ol>${lines.map((line) => `<li>${inline(line.replace(/^\d+\.\s+/, ""))}</li>`).join("")}</ol>`;
    return `<p>${lines.map(inline).join("<br>")}</p>`;
  }).join("");
}

function ToolButton({ label, active, onClick, children }: { label: string; active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-label={label} title={label} onClick={onClick} className={`grid h-8 w-8 place-items-center rounded-md border ${active ? "border-[#7C3AED] bg-[#EDE9FE] text-[#6D28D9]" : "border-transparent text-[#475569] hover:border-[#CBD5E1] hover:bg-white"}`}>{children}</button>;
}

export function CalloutRichTextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit.configure({ heading: false, blockquote: false, codeBlock: false, horizontalRule: false })],
    content: markdownToHtml(value),
    editorProps: { attributes: { class: "min-h-32 px-3 py-3 text-sm leading-6 text-[#334155] outline-none [&_a]:font-bold [&_a]:text-[#6D28D9] [&_a]:underline [&_code]:rounded [&_code]:bg-[#E2E8F0] [&_code]:px-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6" } },
    onUpdate: ({ editor: currentEditor }) => onChange(contentMarkdown(currentEditor.getJSON().content).trim()),
  });
  const state = useEditorState({ editor, selector: ({ editor: currentEditor }) => ({ bold: currentEditor?.isActive("bold"), italic: currentEditor?.isActive("italic"), strike: currentEditor?.isActive("strike"), code: currentEditor?.isActive("code"), link: currentEditor?.isActive("link"), bulletList: currentEditor?.isActive("bulletList"), orderedList: currentEditor?.isActive("orderedList") }) });
  if (!editor) return <div className="min-h-32 rounded-lg border-2 border-[#CBD5E1] bg-white" />;
  const setLink = () => {
    const current = String(editor.getAttributes("link").href ?? "");
    const href = window.prompt("Nhập link (https://...)", current);
    if (href === null) return;
    if (!href.trim()) editor.chain().focus().unsetLink().run();
    else if (/^https?:\/\//i.test(href)) editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  };
  return <div className="overflow-hidden rounded-lg border-2 border-[#CBD5E1] bg-white focus-within:border-[#7C3AED]">
    <div className="flex flex-wrap gap-0.5 border-b border-[#CBD5E1] bg-[#F8FAFC] p-1.5">
      <ToolButton label="In đậm" active={state?.bold} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></ToolButton>
      <ToolButton label="In nghiêng" active={state?.italic} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></ToolButton>
      <ToolButton label="Gạch ngang" active={state?.strike} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="h-4 w-4" /></ToolButton>
      <ToolButton label="Code trong dòng" active={state?.code} onClick={() => editor.chain().focus().toggleCode().run()}><Code2 className="h-4 w-4" /></ToolButton>
      <ToolButton label="Chèn link" active={state?.link} onClick={setLink}><Link2 className="h-4 w-4" /></ToolButton>
      <span className="mx-1 h-8 border-l border-[#CBD5E1]" />
      <ToolButton label="Danh sách" active={state?.bulletList} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></ToolButton>
      <ToolButton label="Danh sách có thứ tự" active={state?.orderedList} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></ToolButton>
    </div>
    <EditorContent editor={editor} />
  </div>;
}

export function CalloutRichTextPreview({ value, variant = "callout" }: { value: string; variant?: "callout" | "article" }) {
  const editor = useEditor(
    {
      immediatelyRender: false,
      editable: false,
      extensions: [
        StarterKit.configure({
          heading: false,
          blockquote: false,
          codeBlock: false,
          horizontalRule: false,
        }),
      ],
      content: markdownToHtml(value),
      editorProps: {
        attributes: {
          class: variant === "article"
            ? "text-[15px] leading-8 text-[#334155] [&_a]:font-bold [&_a]:text-[#8B5CF6] [&_a]:underline [&_a]:decoration-2 [&_a]:underline-offset-2 [&_code]:rounded [&_code]:bg-[#F1F5F9] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_ol]:list-decimal [&_ol]:space-y-3 [&_ol]:pl-6 [&_p]:m-0 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
            : "space-y-3 text-sm leading-7 [&_a]:font-bold [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded [&_code]:bg-black/10 [&_code]:px-1 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_p]:m-0 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6",
        },
      },
    },
    [value, variant],
  );

  return editor ? <EditorContent editor={editor} /> : null;
}
