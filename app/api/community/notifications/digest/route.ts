import { timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";
import { deliverCommunityDigests } from "@/features/community/server/community.service";
import { isSmtpConfigured, sendCommunityDigestEmail } from "@/server/mail/smtp-mailer";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const value = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!secret || !value) return false;
  const expected = Buffer.from(secret);
  const received = Buffer.from(value);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSmtpConfigured()) return Response.json({ error: "SMTP is not configured." }, { status: 503 });

  const result = await deliverCommunityDigests(sendCommunityDigestEmail);
  return Response.json(result);
}
