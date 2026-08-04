import "server-only";

const WINDOW_MS = 60_000;
const recentRequests = new Map<string, number>();

export function canRecordView(key: string) {
  const now = Date.now();
  const lastRequestAt = recentRequests.get(key);
  if (lastRequestAt && now - lastRequestAt < WINDOW_MS) return false;
  recentRequests.set(key, now);

  if (recentRequests.size > 10_000) {
    for (const [requestKey, timestamp] of recentRequests) {
      if (now - timestamp > WINDOW_MS) recentRequests.delete(requestKey);
    }
  }

  return true;
}
