"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Mail, Send } from "lucide-react";
import { Button, Badge } from "@/components/ui/button";
import { StickerCard } from "@/components/ui/sticker-card";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim()) setSubscribed(true);
  };
  return (
    <section className="w-full border-t-2 border-[#1E293B] bg-[#F472B6]/10 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <StickerCard
          shadowColor="pink"
          bg="bg-white"
          className="flex flex-col items-center gap-6 border-4 p-8 text-center sm:p-12"
        >
          <Badge color="pink" className="font-mono">
            NHẬN BẢN TIN DEVINSIGHT
          </Badge>
          <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-[#1E293B] sm:text-4xl">
            Mỗi tuần một vài nội dung đáng đọc, gửi thẳng vào hộp thư.
          </h2>
          <p className="max-w-xl leading-relaxed text-[#64748B]">
            Nhận bài hướng dẫn mới, tài nguyên chọn lọc và điểm tin công nghệ.
            Bạn có thể dừng nhận bất cứ lúc nào.
          </p>
          {subscribed ? (
            <div className="flex items-center gap-3 rounded-xl border-2 border-[#1E293B] bg-[#34D399] p-4 font-bold text-[#1E293B]">
              <CheckCircle2 className="w-5 h-5" />
              Cảm ơn bạn đã đăng ký. Hẹn gặp bạn trong bản tin tới.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <label className="relative flex-1">
                <span className="sr-only">Email</span>
                <Mail className="absolute left-4 top-1/2 w-5 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="emailcuaban@example.com"
                  className="w-full rounded-full border-2 border-[#1E293B] bg-white py-3.5 pl-12 pr-4 text-sm font-medium text-[#1E293B] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
              </label>
              <Button type="submit" icon={<Send className="w-4 h-4" />}>
                Đăng ký
              </Button>
            </form>
          )}
        </StickerCard>
      </div>
    </section>
  );
}
