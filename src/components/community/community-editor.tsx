"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import {
  Bold,
  Code2,
  Heading2,
  Italic,
  List,
  ListOrdered,
  TextQuote,
} from "lucide-react";
import { CODE_LANGUAGES } from "@/features/community/community-content";

const lowlight = createLowlight(common);
const emptyDocument = JSON.stringify({
  type: "doc",
  content: [{ type: "paragraph" }],
});

type CommunityEditorProps = {
  name: string;
  label: string;
  description?: string;
};

function ToolButton({
  active,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid h-7 w-7 place-items-center rounded-md border text-[#1E293B] ${active ? "border-[#7C3AED] bg-[#EDE9FE] text-[#6D28D9]" : "border-transparent hover:border-[#CBD5E1] hover:bg-white"}`}
    >
      {children}
    </button>
  );
}

export function CommunityEditor({
  name,
  label,
  description,
}: CommunityEditorProps) {
  const [value, setValue] = useState(emptyDocument);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ codeBlock: false, heading: { levels: [2, 3] } }),
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: "plaintext" }),
    ],
    content: { type: "doc", content: [{ type: "paragraph" }] },
    editorProps: {
      attributes: {
        class: "community-editor-content min-h-32 px-3 py-2.5 outline-none",
      },
    },
    onUpdate: ({ editor: currentEditor }) =>
      setValue(JSON.stringify(currentEditor.getJSON())),
  });

  if (!editor) return null;

  const buttonClass =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]";
  return (
    <div>
      <label className="block text-xs font-extrabold text-[#1E293B]">
        {label}
      </label>
      {description ? (
        <p className="mt-1 text-[11px] leading-4 text-[#64748B]">
          {description}
        </p>
      ) : null}
      <div className="mt-1.5 overflow-hidden rounded-lg border border-[#CBD5E1] bg-white">
        <div className="flex flex-wrap items-center gap-0.5 border-b border-[#CBD5E1] bg-[#F1F5F9] p-1.5">
          <ToolButton
            label="In đậm"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </ToolButton>
          <ToolButton
            label="In nghiêng"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </ToolButton>
          <ToolButton
            label="Mã trong dòng"
            active={editor.isActive("code")}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code2 className="h-4 w-4" />
          </ToolButton>
          <span className="mx-1 h-5 border-l border-slate-300" />
          <ToolButton
            label="Tiêu đề"
            active={editor.isActive("heading", { level: 2 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 className="h-4 w-4" />
          </ToolButton>
          <ToolButton
            label="Danh sách"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </ToolButton>
          <ToolButton
            label="Danh sách có thứ tự"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </ToolButton>
          <ToolButton
            label="Khối mã"
            active={editor.isActive("codeBlock")}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleCodeBlock({ language: "plaintext" })
                .run()
            }
          >
            <TextQuote className="h-4 w-4" />
          </ToolButton>
          <select
            aria-label="Ngôn ngữ code block"
            value={
              (editor.getAttributes("codeBlock").language as
                | string
                | undefined) ?? "plaintext"
            }
            onChange={(event) =>
              editor
                .chain()
                .focus()
                .updateAttributes("codeBlock", { language: event.target.value })
                .run()
            }
            className={`ml-1 h-7 rounded-md border border-[#CBD5E1] bg-white px-2 text-[11px] font-bold text-[#1E293B] ${buttonClass}`}
          >
            {CODE_LANGUAGES.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>
        <EditorContent editor={editor} />
      </div>
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
