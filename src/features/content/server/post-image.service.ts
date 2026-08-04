import "server-only";

import { validatePostImageUpload } from "@/features/content/post-image-policy";
import {
  createPostImageAccessUrl,
  uploadPostImageObject,
} from "@/features/resources/server/r2-storage";

const validKeySegment = /^[A-Za-z0-9._-]+$/;

export async function uploadPostImage(input: {
  fileName: unknown;
  mimeType: unknown;
  fileSize: unknown;
  body: Uint8Array;
}) {
  const image = validatePostImageUpload(input);
  return { ...image, ...(await uploadPostImageObject({ ...image, body: input.body })) };
}

export async function getPostImageAccessUrl(pathSegments: string[]) {
  if (
    pathSegments.length < 2 ||
    pathSegments.some((segment) => !validKeySegment.test(segment))
  )
    return null;

  const key = `post-images/${pathSegments.join("/")}`;
  return createPostImageAccessUrl(key);
}
