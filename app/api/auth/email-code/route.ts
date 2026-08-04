import { NextRequest, NextResponse } from "next/server";
import { sendEmailLoginCodeRequest } from "@/features/auth/server/email-otp.service";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host)
    return NextResponse.json(
      { ok: false, message: "Invalid origin" },
      { status: 403 },
    );
  let body: { email?: string };
  try {
    body = (await request.json()) as { email?: string };
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body" },
      { status: 400 },
    );
  }
  const result = await sendEmailLoginCodeRequest(body.email ?? "");
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
