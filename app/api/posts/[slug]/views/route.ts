import { randomUUID } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { recordPostView } from "@/features/analytics/server/analytics.service";
import { canRecordView } from "@/features/analytics/server/view-rate-limit";
import { hashVisitorId } from "@/server/security/visitor-hash";

const VISITOR_COOKIE = "devinsight_visitor";
const botPattern = /bot|crawler|spider|preview|facebookexternalhit|slurp/i;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host)
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (botPattern.test(request.headers.get("user-agent") ?? ""))
    return NextResponse.json({ counted: false });

  const { slug } = await params;
  const existingVisitorId = request.cookies.get(VISITOR_COOKIE)?.value;
  const visitorId = existingVisitorId ?? randomUUID();
  const visitorHash = hashVisitorId(visitorId);
  if (!canRecordView(`${slug}:${visitorHash}`))
    return NextResponse.json({ counted: false, reason: "rate_limited" });
  const result = await recordPostView(slug, visitorHash);
  if (result.counted) revalidateTag("public-post-listing", "max");
  const response = NextResponse.json(result);
  if (!existingVisitorId)
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 180,
      path: "/",
    });
  return response;
}
