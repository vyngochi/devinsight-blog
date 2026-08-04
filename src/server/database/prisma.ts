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
// when a newly added delegate is missing instead of serving a runtime error.
const hasCurrentSchema =
  !cachedClient ||
  Boolean(
    (cachedClient as unknown as Record<string, unknown>).community_questions &&
      (cachedClient as unknown as Record<string, unknown>).resources,
  );

if (cachedClient && process.env.NODE_ENV !== "production" && !hasCurrentSchema) {
  void cachedClient.$disconnect();
}

export const prisma =
  cachedClient && (process.env.NODE_ENV === "production" || hasCurrentSchema)
    ? cachedClient
    : createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
