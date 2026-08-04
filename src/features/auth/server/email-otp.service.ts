import "server-only";

import { randomInt } from "node:crypto";
import {
  consumeEmailCodeAndUpsertUser,
  replaceEmailLoginCode,
} from "@/features/auth/server/auth.repository";
import { canRequestEmailCode } from "@/features/auth/server/email-otp-rate-limit";
import {
  hashEmailLoginCode,
  isSixDigitCode,
  normalizeEmail,
} from "@/features/auth/server/email-otp-token";
import {
  isSmtpConfigured,
  sendEmailLoginCode,
} from "@/server/mail/smtp-mailer";

const CODE_TTL_MS = 10 * 60 * 1000;

function isAdminEmail(email: string) {
  return Boolean(
    process.env.ADMIN_EMAIL &&
      email === process.env.ADMIN_EMAIL.trim().toLowerCase(),
  );
}

export async function sendEmailLoginCodeRequest(rawEmail: string) {
  const email = normalizeEmail(rawEmail);
  if (!/^\S+@\S+\.\S+$/.test(email))
    return { ok: false, message: "Email không hợp lệ." };
  if (!isSmtpConfigured())
    return {
      ok: false,
      message: "Email đăng nhập chưa được cấu hình SMTP.",
    };
  if (!canRequestEmailCode(email))
    return {
      ok: false,
      message: "Vui lòng đợi một phút trước khi yêu cầu mã mới.",
    };

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await replaceEmailLoginCode({
    identifier: `email-login:${email}`,
    token: hashEmailLoginCode(email, code),
    expires: new Date(Date.now() + CODE_TTL_MS),
  });
  await sendEmailLoginCode(email, code);

  return {
    ok: true,
    message: "Mã xác thực đã được gửi đến email của bạn.",
  };
}

export async function verifyEmailLoginCode(rawEmail: string, code: string) {
  const email = normalizeEmail(rawEmail);
  if (!isSixDigitCode(code)) return null;

  const user = await consumeEmailCodeAndUpsertUser({
    email,
    identifier: `email-login:${email}`,
    token: hashEmailLoginCode(email, code),
    isAdmin: isAdminEmail(email),
  });
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
  };
}
