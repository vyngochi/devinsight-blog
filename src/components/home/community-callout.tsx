import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CommunityCallout() {
  return (
    <section className="w-full bg-[#FBBF24] py-8 sm:py-10 border-b-2 border-[#1E293B]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white rounded-2xl border-4 border-[#1E293B] shadow-pop-sm p-6 sm:p-8">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">
              Bạn có câu hỏi?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#64748B] max-w-2xl">
              Hãy đặt câu hỏi và nhận sự trợ giúp từ cộng đồng DevInsight ngay
              hôm nay.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <Link href="/community/ask" className="block">
              <Button
                variant="primary"
                size="lg"
                className="w-full shadow-pop-sm hover:shadow-pop-md transition-all text-base sm:text-lg px-8 py-6 h-auto"
                icon={
                  <MessageSquarePlus className="w-5 h-5" strokeWidth={2.5} />
                }
              >
                Đặt câu hỏi ngay
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
