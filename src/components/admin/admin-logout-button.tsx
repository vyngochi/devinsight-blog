"use client";

import { useState } from "react";
import { LogOut, LoaderCircle } from "lucide-react";
import { signOut } from "next-auth/react";

export function AdminLogoutButton() {
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    if (pending) return;
    setPending(true);

    try {
      await signOut({ redirectTo: "/" });
    } catch {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleLogout}
      className="flex w-full items-center gap-2 rounded-lg bg-[#F1F5F9] px-3 py-2 text-xs font-bold hover:bg-[#FBBF24] disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? (
        <LoaderCircle className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" />
      ) : (
        <LogOut className="h-3.5 w-3.5" />
      )}
      {pending ? "Đang đăng xuất..." : "Đăng xuất"}
    </button>
  );
}
