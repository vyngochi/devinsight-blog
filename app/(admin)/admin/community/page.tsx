import Link from "next/link";
import { Flag, ShieldCheck } from "lucide-react";
import { moderateCommunityReportAction } from "@/features/community/server/community.actions";
import { getCommunityReports } from "@/features/community/server/community.service";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { canUseAuthorPermission } from "@/features/admin/server/author-permissions";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default async function AdminCommunityPage() {
  const session = await auth();
  if (!session?.user || !(await canUseAuthorPermission(session.user, "moderateCommunity"))) notFound();
  const reports = await getCommunityReports();
  return <div className="space-y-6">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="font-mono text-xs font-bold text-[#8B5CF6]">CỘNG ĐỒNG</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight">Hàng đợi kiểm duyệt</h1><p className="mt-2 max-w-2xl text-sm text-[#64748B]">Nội dung được công khai ngay. Quản trị viên xử lý các báo cáo tại đây và có thể ẩn nội dung vi phạm.</p></div><Link href="/community" className="inline-flex items-center justify-center rounded-full border-2 border-[#1E293B] bg-white px-4 py-2 text-sm font-bold shadow-pop-sm hover:bg-[#FBBF24]">Mở Cộng đồng</Link></section>
    {reports.length ? <section className="space-y-4">{reports.map((report) => {
      const isQuestion = Boolean(report.question);
      const targetTitle = report.question?.title ?? report.answer?.question.title ?? "Nội dung đã xóa";
      const targetHref = report.question ? `/community/${report.question.slug}` : report.answer ? `/community/${report.answer.question.slug}` : "/community";
      const author = report.question?.author ?? report.answer?.author;
      return <article key={report.id} className="rounded-2xl border-2 border-[#1E293B] bg-white p-5 shadow-pop-sm"><div className="flex flex-col justify-between gap-4 lg:flex-row"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-md border border-[#1E293B] bg-[#FFF1F2] px-2 py-1 text-xs font-extrabold text-[#BE123C]"><Flag className="mr-1 inline h-3.5 w-3.5" />{report.reason}</span><span className="text-xs font-semibold text-[#64748B]">{formatDate(report.created_at)}</span></div><p className="mt-3 text-xs font-bold text-[#64748B]">{isQuestion ? "Câu hỏi" : "Phản hồi"}</p><Link href={targetHref} className="mt-1 block text-lg font-extrabold text-[#1E293B] hover:text-[#7C3AED]">{targetTitle}</Link>{report.answer ? <p className="mt-2 line-clamp-2 text-sm text-[#64748B]">{report.answer.content_text}</p> : null}<p className="mt-3 text-sm text-[#475569]">Tác giả: <strong>{author?.name || author?.email}</strong></p><p className="mt-1 text-sm text-[#475569]">Người báo cáo: <strong>{report.reporter.name || report.reporter.email}</strong></p>{report.detail ? <p className="mt-3 rounded-lg bg-[#F8FAFC] p-3 text-sm text-[#475569]">Ghi chú: {report.detail}</p> : null}</div><div className="flex shrink-0 flex-wrap gap-2 lg:flex-col lg:items-stretch"><form action={moderateCommunityReportAction}><input type="hidden" name="reportId" value={report.id} /><input type="hidden" name="action" value="review" /><button className="w-full rounded-lg border-2 border-[#1E293B] bg-white px-3 py-2 text-sm font-bold hover:bg-[#F1F5F9]">Đã xem</button></form><form action={moderateCommunityReportAction}><input type="hidden" name="reportId" value={report.id} /><input type="hidden" name="action" value="hide" /><button className="w-full rounded-lg border-2 border-[#1E293B] bg-[#F472B6] px-3 py-2 text-sm font-bold text-white hover:bg-[#E11D48]">Ẩn nội dung</button></form><form action={moderateCommunityReportAction}><input type="hidden" name="reportId" value={report.id} /><input type="hidden" name="action" value="dismiss" /><button className="w-full rounded-lg border-2 border-[#1E293B] bg-[#FBBF24] px-3 py-2 text-sm font-bold text-[#1E293B] hover:bg-[#F59E0B]">Bỏ qua</button></form></div></div></article>;
    })}</section> : <section className="rounded-2xl border-2 border-[#1E293B] bg-white p-8 text-center shadow-pop-sm"><ShieldCheck className="mx-auto h-10 w-10 text-[#34D399]" /><h2 className="mt-4 text-xl font-extrabold">Không có báo cáo đang chờ</h2><p className="mt-2 text-sm text-[#64748B]">Các báo cáo mới từ Cộng đồng sẽ xuất hiện tại đây.</p></section>}
  </div>;
}
