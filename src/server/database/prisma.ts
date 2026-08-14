import "server-only";

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured.");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

const cachedClient = globalForPrisma.prisma;
// Prisma delegates are generated from the schema. During Next.js development,
// a cached client can survive a schema regeneration through HMR. Recreate it
// when a newly added model or field is missing instead of serving a runtime error.
function clientHasField(client: PrismaClient, model: string, field: string) {
  const runtimeDataModel = (
    client as unknown as {
      _runtimeDataModel?: {
        models?: Record<string, { fields?: Array<{ name?: string }> }>;
      };
    }
  )._runtimeDataModel;

  return runtimeDataModel?.models?.[model]?.fields?.some(
    (modelField) => modelField.name === field,
  );
}

const hasCurrentSchema =
  !cachedClient ||
  Boolean(
    (cachedClient as unknown as Record<string, unknown>).community_questions &&
      (cachedClient as unknown as Record<string, unknown>).resources &&
      (cachedClient as unknown as Record<string, unknown>).post_likes &&
      (cachedClient as unknown as Record<string, unknown>).post_relations &&
      (cachedClient as unknown as Record<string, unknown>)
        .newsletter_subscribers &&
      clientHasField(cachedClient, "posts", "featured"),
  );

if (cachedClient && process.env.NODE_ENV !== "production" && !hasCurrentSchema) {
  void cachedClient.$disconnect();
}

export const prisma =
  cachedClient && (process.env.NODE_ENV === "production" || hasCurrentSchema)
    ? cachedClient
    : createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
