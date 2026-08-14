"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { AuthModal } from "@/components/auth/auth-modal";

export function CommunityAuthRequired() {
  const [authOpen, setAuthOpen] = useState(true);

  return (
    <>
      <div
        className="rounded-xl border border-[#FCD34D] bg-[#FFFBEB] p-4"
        role="alert"
      >
        <h2 className="font-extrabold text-[#78350F]">
          Bạn cần đăng nhập để đặt câu hỏi
        </h2>
        <p className="mt-1 text-sm leading-6 text-[#92400E]">
          Đăng nhập hoặc tạo tài khoản để đăng câu hỏi và theo dõi phản hồi từ
          cộng đồng.
        </p>
        <button
          type="button"
          onClick={() => setAuthOpen(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#6D28D9] active:translate-y-px"
        >
          <LogIn className="h-4 w-4" />
          Mở form đăng nhập
        </button>
      </div>
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        callbackUrl="/community/ask"
      />
    </>
  );
}
