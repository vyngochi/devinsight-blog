import "server-only";

const REQUEST_WINDOW_MS = 60_000;
const codeRequests = new Map<string, number>();

export function canRequestEmailCode(email: string) {
  const now = Date.now();
  const lastRequestAt = codeRequests.get(email);
  if (lastRequestAt && now - lastRequestAt < REQUEST_WINDOW_MS) return false;

  codeRequests.set(email, now);
  return true;
}
