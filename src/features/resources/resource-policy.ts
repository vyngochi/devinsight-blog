export const RESOURCE_TOPICS = [
  "Lập trình cơ bản",
  "Frontend",
  "Backend",
  "Cơ sở dữ liệu",
  "DevOps & Cloud",
  "Công cụ phát triển",
  "Kỹ năng nghề nghiệp",
] as const;

export type ResourceTopic = (typeof RESOURCE_TOPICS)[number];

export const MAX_RESOURCE_FILE_SIZE = 50 * 1024 * 1024;

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
  "application/json",
]);

const extensionMimeTypes: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  txt: "text/plain",
  csv: "text/csv",
  json: "application/json",
};

export function isResourceTopic(value: string): value is ResourceTopic {
  return RESOURCE_TOPICS.includes(value as ResourceTopic);
}

export function normalizeResourceMimeType(fileName: string, mimeType: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  const inferred = extension ? extensionMimeTypes[extension] : undefined;
  const normalized = mimeType.trim().toLowerCase();

  if (allowedMimeTypes.has(normalized)) return normalized;
  if ((!normalized || normalized === "application/octet-stream") && inferred)
    return inferred;
  return null;
}

export function isPreviewSupported(mimeType: string) {
  return mimeType === "application/pdf" || mimeType.startsWith("text/");
}

export function formatResourceFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
}

export function resourceTypeLabel(mimeType: string) {
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType.includes("wordprocessingml")) return "DOCX";
  if (mimeType.includes("presentationml")) return "PPTX";
  if (mimeType.includes("spreadsheetml")) return "XLSX";
  if (mimeType === "text/csv") return "CSV";
  if (mimeType === "application/json") return "JSON";
  return "TXT";
}
