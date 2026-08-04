export const MAX_POST_IMAGE_SIZE = 10 * 1024 * 1024;

const imageMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const extensionMimeTypes: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

export function normalizePostImageMimeType(fileName: string, mimeType: string) {
  const normalized = mimeType.trim().toLowerCase();
  if (imageMimeTypes.has(normalized)) return normalized;

  const extension = fileName.split(".").pop()?.toLowerCase();
  if ((!normalized || normalized === "application/octet-stream") && extension)
    return extensionMimeTypes[extension] ?? null;
  return null;
}

export function validatePostImageUpload(input: {
  fileName: unknown;
  mimeType: unknown;
  fileSize: unknown;
}) {
  if (typeof input.fileName !== "string" || !input.fileName.trim())
    throw new Error("Hãy chọn một hình ảnh trước khi tải lên.");

  const fileName = input.fileName.trim().slice(0, 255);
  const mimeType = normalizePostImageMimeType(
    fileName,
    typeof input.mimeType === "string" ? input.mimeType : "",
  );
  if (!mimeType)
    throw new Error("Chỉ hỗ trợ ảnh JPG, PNG, WebP, GIF hoặc AVIF.");

  const fileSize = Number(input.fileSize);
  if (!Number.isInteger(fileSize) || fileSize <= 0 || fileSize > MAX_POST_IMAGE_SIZE)
    throw new Error("Hình ảnh phải lớn hơn 0 và không vượt quá 10 MB.");

  return { fileName, mimeType, fileSize };
}
