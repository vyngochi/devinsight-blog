"use client";

import { useTransition, useState, useEffect } from "react";
import {
  requestRoleChangeAction,
  confirmRoleChangeAction,
} from "@/features/admin/server/admin.actions";

export function RoleEditor({
  userId,
  initialRole,
  locked,
}: {
  userId: string;
  initialRole: "USER" | "ADMIN";
  locked: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);

  // Sync state if server data changes
  useEffect(() => {
    setSelectedRole(initialRole);
    setStep(1);
    setError(null);
  }, [initialRole]);

  const hasChanged = selectedRole !== initialRole;

  if (step === 2) {
    return (
      <form
        action={(formData) => {
          startTransition(async () => {
            setError(null);
            try {
              await confirmRoleChangeAction(formData);
              // if success, useEffect will reset step to 1 because initialRole changes.
            } catch (err: any) {
              setError(err.message || "Có lỗi xảy ra.");
            }
          });
        }}
        className="flex flex-col gap-2 min-w-0"
      >
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="role" value={selectedRole} />
        <div className="flex flex-col gap-2">
          <input
            type="text"
            name="code"
            maxLength={6}
            placeholder="Mã 6 số"
            disabled={isPending}
            className="w-full rounded-lg border-2 border-[#1E293B] bg-[#FFFDF5] px-2 py-2 text-center text-sm font-bold tracking-[0.2em] outline-none focus:ring-2 focus:ring-[#8B5CF6] disabled:opacity-60"
            required
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg border-2 border-[#1E293B] bg-[#34D399] px-2 py-1.5 text-xs font-bold shadow-pop-sm hover:bg-[#10B981] disabled:opacity-50"
            >
              {isPending ? "..." : "OK"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setError(null);
              }}
              disabled={isPending}
              className="rounded-lg border-2 border-[#1E293B] bg-[#F1F5F9] px-2 py-1.5 text-xs font-bold shadow-pop-sm hover:bg-[#E2E8F0] disabled:opacity-50"
            >
              Hủy
            </button>
          </div>
        </div>
        {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
      </form>
    );
  }

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          setError(null);
          try {
            await requestRoleChangeAction(formData);
            setStep(2);
          } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra.");
          }
        });
      }}
      className="flex flex-col gap-2 min-w-0"
    >
      <div className="flex items-center gap-2">
        <input type="hidden" name="userId" value={userId} />
        <select
          name="role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as "USER" | "ADMIN")}
          disabled={locked || isPending}
          className="min-w-0 flex-1 rounded-lg border-2 border-[#1E293B] bg-[#FFFDF5] px-2 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button
          type="submit"
          disabled={locked || isPending || !hasChanged}
          className="rounded-lg border-2 border-[#1E293B] bg-white px-2 py-2 text-xs font-bold shadow-pop-sm hover:bg-[#FBBF24] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "..." : "Lưu"}
        </button>
      </div>
      {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
    </form>
  );
}
