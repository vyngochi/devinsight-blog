import "server-only";

import { prisma } from "@/server/database/prisma";

type ReplaceEmailCodeInput = {
  identifier: string;
  token: string;
  expires: Date;
};

export async function replaceEmailLoginCode(input: ReplaceEmailCodeInput) {
  await prisma.verificationToken.deleteMany({
    where: { identifier: input.identifier },
  });
  await prisma.verificationToken.create({ data: input });
}

type ConsumeEmailCodeInput = {
  email: string;
  identifier: string;
  token: string;
  isAdmin: boolean;
};

export async function consumeEmailCodeAndUpsertUser(input: ConsumeEmailCodeInput) {
  return prisma.$transaction(async (tx) => {
    const verification = await tx.verificationToken.findFirst({
      where: {
        identifier: input.identifier,
        token: input.token,
        expires: { gt: new Date() },
      },
    });
    if (!verification) return null;

    await tx.verificationToken.delete({ where: { token: verification.token } });
    return tx.user.upsert({
      where: { email: input.email },
      update: {
        emailVerified: new Date(),
        ...(input.isAdmin ? { role: "ADMIN" } : {}),
      },
      create: {
        email: input.email,
        emailVerified: new Date(),
        role: input.isAdmin ? "ADMIN" : "USER",
      },
    });
  });
}

export async function promoteUserToAdmin(email: string) {
  await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });
}
