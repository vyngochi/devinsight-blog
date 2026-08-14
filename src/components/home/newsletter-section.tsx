"use client";

import { useActionState } from "react";
import { CheckCircle2, Mail, Send } from "lucide-react";
import { Button, Badge } from "@/components/ui/button";
import { StickerCard } from "@/components/ui/sticker-card";
import { subscribeNewsletterAction, type NewsletterActionState } from "@/features/newsletter/server/newsletter.actions";

const initialState: NewsletterActionState = { status: "idle" };

export function NewsletterSection() {
  const [state, formAction, pending] = useActionState(subscribeNewsletterAction, initialState);
  return (
    <section className="w-full border-t-2 border-[#1E293B] bg-[#F472B6]/10 py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <StickerCard shadowColor="pink" hoverWiggle={false} bg="bg-white" className="flex flex-col items-center gap-6 border-4 p-8 text-center sm:p-12">
          <Badge color="pink" className="font-mono">NHẬN BẢN TIN DEVINSIGHT</Badge>
          <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-[#1E293B] sm:text-4xl">Đăng ký nhận bản tin mới nhất từ DevInsight</h2>
          <p className="max-w-xl leading-relaxed text-[#64748B]">Nhận bài hướng dẫn mới, tài nguyên chọn lọc và điểm tin công nghệ. Bạn có thể dừng nhận bất cứ lúc nào.</p>
          {state.status === "success" ? (
            <div role="status" className="flex items-center gap-3 rounded-xl border-2 border-[#1E293B] bg-[#34D399] p-4 font-bold text-[#1E293B]"><CheckCircle2 className="h-5 w-5" />{state.message}</div>
          ) : (
            <form action={formAction} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <label className="relative flex-1"><span className="sr-only">Email</span><Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]" /><input type="email" name="email" required maxLength={255} disabled={pending} autoComplete="email" placeholder="emailcuaban@example.com" className="w-full rounded-full border-2 border-[#1E293B] bg-white py-3.5 pl-12 pr-4 text-sm font-medium text-[#1E293B] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] disabled:opacity-60" /></label>
              <Button type="submit" disabled={pending} icon={<Send className="h-4 w-4" />}>{pending ? "Đang lưu..." : "Đăng ký"}</Button>
            </form>
          )}
          {state.status === "error" ? <p role="alert" className="text-sm font-bold text-[#BE123C]">{state.message}</p> : null}
        </StickerCard>
      </div>
    </section>
  );
}
