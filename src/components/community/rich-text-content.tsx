"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import type { JSONContent } from "@tiptap/core";
import { createLowlight, common } from "lowlight";

const lowlight = createLowlight(common);

export function RichTextContent({ content }: { content: JSONContent }) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: [
      StarterKit.configure({ codeBlock: false, heading: { levels: [2, 3] } }),
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: "plaintext" }),
    ],
    content,
    editorProps: {
      attributes: { class: "community-rich-content outline-none" },
    },
  });

  if (!editor) return null;
  return <EditorContent editor={editor} />;
}
