import "server-only";

const requests = new Map<string, number>();

const windows = {
  question: 60_000,
  answer: 15_000,
  report: 30_000,
} as const;

export function canWriteCommunityContent(userId: string, action: keyof typeof windows) {
  const key = `${action}:${userId}`;
  const now = Date.now();
  const lastRequest = requests.get(key);
  if (lastRequest && now - lastRequest < windows[action]) return false;
  requests.set(key, now);

  if (requests.size > 10_000) {
    const oldestAllowed = now - Math.max(...Object.values(windows));
    for (const [requestKey, timestamp] of requests) {
      if (timestamp < oldestAllowed) requests.delete(requestKey);
    }
  }
  return true;
}
