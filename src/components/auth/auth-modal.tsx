"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getProviders, getSession, signIn } from "next-auth/react";
import { Check, LoaderCircle, Mail, X } from "lucide-react";
import { useRouter } from "next/navigation";

type AuthModalProps = { open: boolean; onClose: () => void; callbackUrl?: string };

export function AuthModal({ open, onClose, callbackUrl }: AuthModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasGoogle, setHasGoogle] = useState(false);
  const [hasFacebook, setHasFacebook] = useState(false);

  useEffect(() => {
    if (!open) return;
    getProviders().then((providers) => {
      setHasGoogle(Boolean(providers?.google));
      setHasFacebook(Boolean(providers?.facebook));
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open || typeof document === "undefined") return null;

  async function requestCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/email-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json()) as {
        ok: boolean;
        message: string;
      };
      setMessage(result.message);
      if (result.ok) setStep("code");
    } catch {
      setMessage("Không thể gửi mã lúc này. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const result = await signIn("email-code", { email, code, redirect: false });
    setLoading(false);

    if (result?.error) {
      setMessage("Mã không đúng hoặc đã hết hạn. Hãy thử lại.");
      return;
    }

    const session = await getSession();
    router.replace(callbackUrl ?? (session?.user.role === "ADMIN" ? "/admin" : "/"));
    router.refresh();
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid min-h-[100dvh] place-items-center bg-[#1E293B]/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border-2 border-[#1E293B] bg-[#FFFDF5] p-6 shadow-pop-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-[#1E293B] hover:bg-[#F1F5F9]"
          aria-label="Đóng đăng nhập"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="pr-10">
          <p className="font-mono text-xs font-bold text-[#8B5CF6]">
            DEVINSIGHT ACCOUNT
          </p>
          <h2
            id="auth-title"
            className="mt-2 text-3xl font-extrabold text-[#1E293B]"
          >
            Đăng nhập/Đăng ký
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
            Đăng nhập không cần mật khẩu
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => signIn("google", { callbackUrl: callbackUrl ?? "/auth/redirect" })}
            disabled={!hasGoogle}
            className="rounded-xl border-2 border-[#1E293B] bg-white px-3 py-3 text-sm font-bold text-[#1E293B] shadow-pop-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#FBBF24] text-xs">
              G
            </span>
            Google
          </button>
          <button
            onClick={() => signIn("facebook", { callbackUrl: callbackUrl ?? "/auth/redirect" })}
            disabled={!hasFacebook}
            className="rounded-xl border-2 border-[#1E293B] bg-[#1877F2] px-3 py-3 text-sm font-bold text-white shadow-pop-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[11px] font-black text-[#1877F2]">
              f
            </span>
            Facebook
          </button>
        </div>
        {(!hasGoogle || !hasFacebook) && (
          <p className="mt-3 text-xs leading-relaxed text-[#64748B]">
            Nút bị mờ khi provider tương ứng chưa được cấu hình trên server.
          </p>
        )}

        <div className="my-6 flex items-center gap-3 text-xs font-bold text-[#64748B]">
          <span className="h-px flex-1 bg-[#CBD5E1]" />
          HOẶC DÙNG EMAIL
          <span className="h-px flex-1 bg-[#CBD5E1]" />
        </div>

        {step === "email" ? (
          <form onSubmit={requestCode} className="space-y-3">
            <label className="block text-sm font-bold text-[#1E293B]">
              Email
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                required
                placeholder="ban@example.com"
                className="mt-2 w-full rounded-xl border-2 border-[#1E293B] bg-white px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              />
            </label>
            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#1E293B] bg-[#8B5CF6] px-4 py-3 font-bold text-white shadow-pop disabled:opacity-60"
            >
              {loading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              Gửi mã qua email
            </button>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
              DevInsight sẽ gửi mã xác thực 6 số tới email của bạn.
            </p>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="space-y-3">
            <p className="rounded-xl bg-[#F1F5F9] p-3 text-sm text-[#64748B]">
              Nhập mã gồm 6 chữ số đã gửi đến{" "}
              <strong className="text-[#1E293B]">{email}</strong>.
            </p>
            <label className="block text-sm font-bold text-[#1E293B]">
              Mã xác thực
              <input
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                maxLength={6}
                className="mt-2 w-full rounded-xl border-2 border-[#1E293B] bg-white px-4 py-3 text-center font-mono text-xl font-bold tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              />
            </label>
            <button
              disabled={loading || code.length !== 6}
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#1E293B] bg-[#8B5CF6] px-4 py-3 font-bold text-white shadow-pop disabled:opacity-60"
            >
              {loading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Xác nhận và đăng nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setCode("");
                setMessage("");
              }}
              className="w-full text-sm font-bold text-[#8B5CF6] hover:underline"
            >
              Dùng email khác
            </button>
          </form>
        )}
        {message && (
          <p
            className={`mt-4 rounded-lg p-3 text-sm font-medium ${message.includes("đã được gửi") ? "bg-[#34D399]/30 text-[#1E293B]" : "bg-red-50 text-red-800"}`}
          >
            {message}
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
}
