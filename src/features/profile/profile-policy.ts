export const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const avatarMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const extensionMimeTypes: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export function validateProfileName(value: unknown) {
  if (typeof value !== "string") throw new Error("Tên hiển thị không hợp lệ.");
  const name = value.trim().replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 80)
    throw new Error("Tên hiển thị phải có từ 2 đến 80 ký tự.");
  return name;
}

export function validateAvatarFile(file: File) {
  const normalizedMimeType = file.type.trim().toLowerCase();
  const extension = file.name.split(".").pop()?.toLowerCase();
  const mimeType = avatarMimeTypes.has(normalizedMimeType)
    ? normalizedMimeType
    : extension
      ? extensionMimeTypes[extension]
      : undefined;

  if (!mimeType)
    throw new Error("Avatar chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.");
  if (file.size <= 0 || file.size > MAX_AVATAR_SIZE)
    throw new Error("Avatar phải có dung lượng lớn hơn 0 và không vượt quá 5 MB.");

  return { fileName: file.name.slice(0, 255), mimeType };
}
