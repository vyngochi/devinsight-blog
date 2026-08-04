import "server-only";

import { prisma } from "@/server/database/prisma";

const publicResourceSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  topic: true,
  file_name: true,
  mime_type: true,
  file_size: true,
  download_count: true,
  published_at: true,
  created_at: true,
} as const;

export async function findPublicResources(input: { query?: string; topic?: string }) {
  const query = input.query?.trim();
  return prisma.resources.findMany({
    where: {
      status: "PUBLISHED",
      ...(input.topic ? { topic: input.topic } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { file_name: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: publicResourceSelect,
    orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
    take: 60,
  });
}

export async function findPublicResourceBySlug(slug: string) {
  return prisma.resources.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { ...publicResourceSelect, file_key: true },
  });
}

export async function findManagedResources() {
  return prisma.resources.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      topic: true,
      file_name: true,
      file_size: true,
      status: true,
      download_count: true,
      created_at: true,
      published_at: true,
      uploaded_by: { select: { name: true, email: true } },
    },
    orderBy: { created_at: "desc" },
    take: 100,
  });
}

export async function createResource(input: {
  slug: string;
  title: string;
  description: string;
  topic: string;
  fileKey: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  published: boolean;
  uploadedById: string;
}) {
  const now = new Date();
  return prisma.resources.create({
    data: {
      slug: input.slug,
      title: input.title,
      description: input.description,
      topic: input.topic,
      file_key: input.fileKey,
      file_name: input.fileName,
      mime_type: input.mimeType,
      file_size: input.fileSize,
      status: input.published ? "PUBLISHED" : "DRAFT",
      published_at: input.published ? now : null,
      uploaded_by_id: input.uploadedById,
    },
    select: { slug: true },
  });
}

export async function incrementResourceDownload(id: string) {
  return prisma.resources.update({
    where: { id },
    data: { download_count: { increment: 1 } },
  });
}

export async function findResourceForDeletion(id: string) {
  return prisma.resources.findUnique({
    where: { id },
    select: { id: true, title: true, file_key: true },
  });
}

export async function deleteResourceById(id: string) {
  return prisma.resources.delete({ where: { id } });
}
