import "server-only";

import {
  createUniquePostView,
  fetchDashboardMetrics,
} from "@/features/analytics/server/analytics.repository";
import { syncPostFromContent } from "@/features/content/server/post-sync.service";

function dateOnly(date = new Date()) {
  return new Date(`${date.toISOString().slice(0, 10)}T00:00:00.000Z`);
}

export async function recordPostView(slug: string, visitorHash: string) {
  const post = await syncPostFromContent(slug);
  if (!post) return { counted: false, reason: "not_found" as const };

  const counted = await createUniquePostView(post.id, visitorHash, dateOnly());
  return counted
    ? { counted: true, reason: "recorded" as const }
    : { counted: false, reason: "already_counted" as const };
}

export async function getDashboardMetrics() {
  const startOfToday = dateOnly();
  const startOfSevenDays = new Date(startOfToday);
  startOfSevenDays.setUTCDate(startOfSevenDays.getUTCDate() - 6);
  const startOfThirtyDays = new Date(startOfToday);
  startOfThirtyDays.setUTCDate(startOfThirtyDays.getUTCDate() - 29);

  const metrics = await fetchDashboardMetrics(
    startOfToday,
    startOfSevenDays,
    startOfThirtyDays,
  );

  return {
    ...metrics,
    dailyReaders: metrics.dailyReaders.map((day) => ({
      date: day.viewed_on.toISOString().slice(0, 10),
      readers: day._count._all,
    })),
  };
}
