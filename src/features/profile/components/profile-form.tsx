"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, LoaderCircle, Save, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { UserAvatar } from "@/components/auth/user-avatar";
import { MAX_AVATAR_SIZE } from "@/features/profile/profile-policy";
import { updateProfileAction, type ProfileFormState } from "@/features/profile/server/profile.actions";

const initialState: ProfileFormState = {};

export function ProfileForm({ profile }: { profile: { name: string | null; email: string; image: string | null } }) {
  const [state, action, pending] = useActionState(updateProfileAction, initialState);
  const { update } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [clientError, setClientError] = useState("");

  useEffect(() => {
    if (!state.success) return;
    void update();
  }, [state.success, update]);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  function chooseAvatar(file: File | undefined) {
    setClientError("");
    if (!file) return;
    if (!(["image/jpeg", "image/png", "image/webp"].includes(file.type)) || file.size > MAX_AVATAR_SIZE) {
      setClientError("Chọn ảnh JPG, PNG hoặc WebP không vượt quá 5 MB.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setRemoveAvatar(false);
  }

  function removeSelectedAvatar() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setRemoveAvatar(true);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <form action={action} className="space-y-7" noValidate>
      <input type="hidden" name="removeAvatar" value={String(removeAvatar)} />
      <fieldset disabled={pending} className="space-y-7 disabled:opacity-70">
        <div>
          <span className="block text-sm font-extrabold text-[#1E293B]">Ảnh đại diện</span>
          <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-center">
            <UserAvatar name={profile.name} email={profile.email} image={removeAvatar ? null : profile.image} preview={preview} size="lg" />
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border-2 border-[#1E293B] bg-[#FBBF24] px-4 py-2.5 text-sm font-extrabold text-[#1E293B] shadow-pop-sm transition-transform active:translate-y-0.5">
                  <Camera className="h-4 w-4" />
                  Chọn ảnh
                  <input ref={inputRef} name="avatar" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => chooseAvatar(event.target.files?.[0])} />
                </label>
                {(profile.image || preview) && !removeAvatar ? (
                  <button type="button" onClick={removeSelectedAvatar} className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1E293B] bg-white px-4 py-2.5 text-sm font-bold text-[#BE123C] active:translate-y-0.5">
                    <Trash2 className="h-4 w-4" />Xóa ảnh
                  </button>
                ) : null}
              </div>
              <p className="text-xs leading-5 text-[#64748B]">JPG, PNG hoặc WebP. Dung lượng tối đa 5 MB.</p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="profile-name" className="block text-sm font-extrabold text-[#1E293B]">Tên hiển thị</label>
          <p id="profile-name-help" className="mt-1 text-xs text-[#64748B]">Tên này xuất hiện bên cạnh câu hỏi và phản hồi của bạn.</p>
          <input id="profile-name" name="name" defaultValue={profile.name ?? ""} minLength={2} maxLength={80} required aria-describedby="profile-name-help" className="mt-3 w-full rounded-xl border-2 border-[#1E293B] bg-white px-4 py-3 text-sm font-semibold text-[#1E293B] outline-none placeholder:text-[#94A3B8] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#DDD6FE]" placeholder="Tên bạn muốn mọi người nhìn thấy" />
        </div>
      </fieldset>

      {clientError || state.error ? <p role="alert" className="rounded-xl border border-[#FDA4AF] bg-[#FFF1F2] px-4 py-3 text-sm font-semibold text-[#BE123C]">{clientError || state.error}</p> : null}
      {state.success ? <p role="status" className="flex items-center gap-2 rounded-xl border border-[#86EFAC] bg-[#F0FDF4] px-4 py-3 text-sm font-semibold text-[#166534]"><CheckCircle2 className="h-4 w-4" />{state.success}</p> : null}

      <button disabled={pending || Boolean(clientError)} className="inline-flex items-center gap-2 rounded-xl border-2 border-[#1E293B] bg-[#8B5CF6] px-5 py-3 text-sm font-extrabold text-white shadow-pop-sm transition-transform active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
        {pending ? <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" /> : <Save className="h-4 w-4" />}
        {pending ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </form>
  );
}
