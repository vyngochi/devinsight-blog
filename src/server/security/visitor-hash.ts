import "server-only";

import { createHash } from "node:crypto";

export function hashVisitorId(visitorId: string) {
  const secret = process.env.ANALYTICS_HASH_SECRET || process.env.AUTH_SECRET;
  if (!secret) throw new Error("ANALYTICS_HASH_SECRET is not configured.");
  return createHash("sha256").update(`${secret}:${visitorId}`).digest("hex");
}
