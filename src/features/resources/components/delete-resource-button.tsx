"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteResourceAction } from "@/features/resources/server/resources.actions";

type DeleteResourceButtonProps = {
  resourceId: string;
  title: string;
};

export function DeleteResourceButton({ resourceId, title }: DeleteResourceButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (!window.confirm(`Xóa "${title}"? Tệp trên Cloudflare R2 và dữ liệu trên hệ thống sẽ bị xóa vĩnh viễn.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteResourceAction(resourceId);
      if (result.error) setError(result.error);
    });
  }

  return <div className="min-w-28"><button type="button" disabled={isPending} onClick={handleDelete} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#1E293B] bg-[#FFF1F2] px-3 py-2 text-xs font-extrabold text-[#BE123C] hover:bg-[#FFE4E6] disabled:cursor-not-allowed disabled:opacity-60"><Trash2 className="h-3.5 w-3.5" />{isPending ? "Đang xóa" : "Xóa"}</button>{error ? <p role="alert" className="mt-1 max-w-40 text-xs font-semibold text-[#BE123C]">{error}</p> : null}</div>;
}
