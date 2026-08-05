import "server-only";

import { cache } from "react";

import {
  MAX_RESOURCE_FILE_SIZE,
  isResourceTopic,
  normalizeResourceMimeType,
} from "@/features/resources/resource-policy";
import {
  createResource,
  findManagedResources,
  findPublicResourceBySlug,
  findPublicResources,
  findResourceForDeletion,
  incrementResourceDownload,
  deleteResourceById,
} from "@/features/resources/server/resources.repository";
import {
  createResourceAccessUrl,
  createResourceUploadUrl,
  deleteResourceObject,
} from "@/features/resources/server/r2-storage";

function createResourceSlug(title: string) {
  const normalized = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 180);
  return `${normalized || "tai-nguyen"}-${Date.now().toString(36)}`;
}

export function validateResourceUpload(input: {
  fileName: unknown;
  mimeType: unknown;
  fileSize: unknown;
}) {
  if (typeof input.fileName !== "string" || !input.fileName.trim())
    throw new Error("Chưa chọn tệp để tải lên.");
  const fileName = input.fileName.trim().slice(0, 255);
  const mimeType = normalizeResourceMimeType(
    fileName,
    typeof input.mimeType === "string" ? input.mimeType : "",
  );
  if (!mimeType)
    throw new Error("Định dạng tệp chưa được hỗ trợ. Hãy dùng PDF, DOCX, PPTX, XLSX, TXT, CSV hoặc JSON.");

  const fileSize = Number(input.fileSize);
  if (!Number.isInteger(fileSize) || fileSize <= 0 || fileSize > MAX_RESOURCE_FILE_SIZE)
    throw new Error("Dung lượng tệp phải lớn hơn 0 và không vượt quá 50 MB.");
  return { fileName, mimeType, fileSize };
}

export async function requestResourceUpload(input: {
  fileName: unknown;
  mimeType: unknown;
  fileSize: unknown;
}) {
  const file = validateResourceUpload(input);
  return { ...file, ...(await createResourceUploadUrl(file)) };
}

export async function publishResource(input: {
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
  const title = input.title.trim();
  const description = input.description.trim();
  if (!title || title.length > 220) throw new Error("Tiêu đề phải có từ 1 đến 220 ký tự.");
  if (!description || description.length > 2_000)
    throw new Error("Mô tả phải có từ 1 đến 2.000 ký tự.");
  if (!isResourceTopic(input.topic)) throw new Error("Chủ đề tài nguyên không hợp lệ.");
  if (!input.fileKey.startsWith("resources/")) throw new Error("Khóa tệp không hợp lệ.");
  const file = validateResourceUpload({
    fileName: input.fileName,
    mimeType: input.mimeType,
    fileSize: input.fileSize,
  });

  return createResource({
    slug: createResourceSlug(title),
    title,
    description,
    topic: input.topic,
    fileKey: input.fileKey,
    ...file,
    published: input.published,
    uploadedById: input.uploadedById,
  });
}

export const getPublicResources = findPublicResources;
export const getManagedResources = findManagedResources;

export const getPublicResource = cache((slug: string) => findPublicResourceBySlug(slug));

export async function getResourceAccessUrl(slug: string, download: boolean) {
  const resource = await findPublicResourceBySlug(slug);
  if (!resource) return null;
  const url = await createResourceAccessUrl({
    key: resource.file_key,
    fileName: resource.file_name,
    download,
  });
  if (download) await incrementResourceDownload(resource.id);
  return url;
}

export async function removeResource(id: string) {
  const resource = await findResourceForDeletion(id);
  if (!resource) throw new Error("Tài nguyên không còn tồn tại.");

  // Remove the private object first. If R2 rejects the request, retain the
  // database record so an administrator can retry without losing its metadata.
  await deleteResourceObject(resource.file_key);
  await deleteResourceById(resource.id);
  return resource;
}
