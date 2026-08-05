"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { deletePostAction, type PostEditorState } from "@/features/content/server/post-editor.actions";

const initialState: PostEditorState = {};

export function AdminPostRowActions({ slug, kind }: { slug: string; kind: "article" | "news" }) {
  const [state, action, pending] = useActionState(deletePostAction, initialState);
  const editHref = kind === "news" ? `/admin/news/${slug}/edit` : `/admin/posts/${slug}/edit`;
  const label = kind === "news" ? "tin tức" : "bài viết";

  return (
    <div className="flex items-center gap-2">
      <Link href={editHref} className="inline-flex items-center gap-1 rounded-md border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs font-bold text-[#334155] hover:border-[#7C3AED] hover:text-[#6D28D9]">
        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />Sửa
      </Link>
      <form action={action} onSubmit={(event) => { if (!window.confirm(`Xóa ${label} này? Thao tác không thể hoàn tác.`)) event.preventDefault(); }}>
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="kind" value={kind} />
        <button type="submit" disabled={pending} className="inline-flex items-center gap-1 rounded-md border border-[#FCA5A5] bg-white px-2.5 py-1.5 text-xs font-bold text-[#BE123C] hover:bg-[#FFF1F2] disabled:opacity-60">
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />{pending ? "Đang xóa" : "Xóa"}
        </button>
      </form>
      {state.error ? <p role="alert" className="max-w-40 text-[11px] font-bold leading-4 text-[#BE123C]">{state.error}</p> : null}
    </div>
  );
}
