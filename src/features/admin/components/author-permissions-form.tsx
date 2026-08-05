"use client";

import { useActionState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { saveAuthorPermissionsAction, type AuthorPermissionsActionState } from "@/features/admin/server/admin.actions";
import type { AuthorPermissions } from "@/features/admin/server/author-permissions";

const initialState: AuthorPermissionsActionState = {};
const options: Array<{ key: keyof AuthorPermissions; title: string; description: string }> = [
  { key: "viewOwnAnalytics", title: "Tổng quan bài viết của mình", description: "Xem lượt đọc, trạng thái và bài viết do chính AUTHOR tạo." },
  { key: "writePosts", title: "Viết bài", description: "Tạo, sửa và xóa các bài viết của chính mình." },
  { key: "writeNews", title: "Viết tin tức", description: "Tạo, sửa và xóa tin tức của chính mình." },
  { key: "moderateCommunity", title: "Kiểm duyệt Cộng đồng", description: "Xử lý các báo cáo nội dung trong Cộng đồng." },
  { key: "manageResources", title: "Tài nguyên", description: "Tải lên, xuất bản và quản lý các tài nguyên của chính mình." },
];

export function AuthorPermissionsForm({ permissions }: { permissions: AuthorPermissions }) {
  const [state, action, pending] = useActionState(saveAuthorPermissionsAction, initialState);
  return (
    <form action={action} className="rounded-2xl border-2 border-[#1E293B] bg-white p-5 shadow-pop-sm">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl border border-[#1E293B] bg-[#EDE9FE] text-[#6D28D9]"><ShieldCheck className="h-5 w-5" /></span>
        <div><h2 className="font-extrabold">Quyền mặc định của AUTHOR</h2><p className="mt-1 text-sm text-[#64748B]">Thiết lập này áp dụng tức thời khi AUTHOR thực hiện thao tác trên server.</p></div>
      </div>
      <div className="mt-5 divide-y divide-[#E2E8F0] border-y border-[#E2E8F0]">
        {options.map((option) => <label key={option.key} className="flex cursor-pointer items-start gap-3 py-3.5"><input type="checkbox" name={option.key} defaultChecked={permissions[option.key]} className="mt-1 h-4 w-4 rounded border-[#94A3B8] text-[#7C3AED] focus:ring-[#7C3AED]" /><span><span className="block text-sm font-extrabold text-[#1E293B]">{option.title}</span><span className="mt-0.5 block text-xs leading-5 text-[#64748B]">{option.description}</span></span></label>)}
      </div>
      {state.error ? <p role="alert" className="mt-4 rounded-lg bg-[#FFF1F2] px-3 py-2 text-sm font-bold text-[#BE123C]">{state.error}</p> : null}
      {state.success ? <p role="status" className="mt-4 flex items-center gap-2 rounded-lg bg-[#ECFDF5] px-3 py-2 text-sm font-bold text-[#047857]"><CheckCircle2 className="h-4 w-4" />{state.success}</p> : null}
      <button disabled={pending} className="mt-5 rounded-lg border-2 border-[#1E293B] bg-[#FBBF24] px-4 py-2 text-sm font-extrabold text-[#1E293B] shadow-pop-sm disabled:opacity-60">{pending ? "Đang lưu..." : "Lưu quyền AUTHOR"}</button>
    </form>
  );
}
