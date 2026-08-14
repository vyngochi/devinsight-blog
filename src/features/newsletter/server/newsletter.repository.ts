import type { newsletter_subscriber_status } from "@/generated/prisma/client";
import { prisma } from "@/server/database/prisma";

export function upsertNewsletterSubscriber(email: string) {
  const now = new Date();
  return prisma.newsletter_subscribers.upsert({ where: { email }, create: { email, status: "ACTIVE", source: "home", subscribed_at: now }, update: { status: "ACTIVE", subscribed_at: now, unsubscribed_at: null }, select: { id: true } });
}

export function findNewsletterSubscribers(input: { query?: string; status?: newsletter_subscriber_status }) {
  return prisma.newsletter_subscribers.findMany({ where: { status: input.status, email: input.query ? { contains: input.query, mode: "insensitive" } : undefined }, orderBy: { subscribed_at: "desc" }, take: 200 });
}

export async function countNewsletterSubscribers() {
  const [total, active, unsubscribed] = await prisma.$transaction([prisma.newsletter_subscribers.count(), prisma.newsletter_subscribers.count({ where: { status: "ACTIVE" } }), prisma.newsletter_subscribers.count({ where: { status: "UNSUBSCRIBED" } })]);
  return { total, active, unsubscribed };
}

export function updateNewsletterSubscriberStatus(id: string, status: newsletter_subscriber_status) {
  return prisma.newsletter_subscribers.update({ where: { id }, data: { status, unsubscribed_at: status === "UNSUBSCRIBED" ? new Date() : null }, select: { id: true } });
}

export function deleteNewsletterSubscriber(id: string) {
  return prisma.newsletter_subscribers.delete({ where: { id }, select: { id: true } });
}
