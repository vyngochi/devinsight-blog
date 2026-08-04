import "server-only";

import { createHash } from "node:crypto";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isSixDigitCode(code: string) {
  return /^\d{6}$/.test(code);
}

export function hashEmailLoginCode(email: string, code: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not configured.");

  return createHash("sha256")
    .update(`${secret}:${email}:${code}`)
    .digest("hex");
}
