import "server-only";

import { validateAvatarFile, validateProfileName } from "@/features/profile/profile-policy";
import { findUserProfileById, updateUserProfile } from "@/features/profile/server/profile.repository";
import { createAvatarAccessUrl, deleteAvatarObject, uploadAvatarObject } from "@/features/resources/server/r2-storage";

const avatarPathPrefix = "/api/profile/avatar/";

function avatarKeyFromPath(path: string | null) {
  if (!path?.startsWith(avatarPathPrefix)) return null;
  const key = decodeURIComponent(path.slice(avatarPathPrefix.length));
  return key.startsWith("avatars/") ? key : null;
}

export { findUserProfileById as getUserProfile };

export async function saveUserProfile(input: {
  userId: string;
  name: unknown;
  avatar?: File;
  removeAvatar: boolean;
}) {
  const current = await findUserProfileById(input.userId);
  if (!current) throw new Error("Không tìm thấy tài khoản của bạn.");

  const name = validateProfileName(input.name);
  let image: string | null | undefined;

  if (input.removeAvatar) {
    image = null;
  } else if (input.avatar && input.avatar.size > 0) {
    const avatar = validateAvatarFile(input.avatar);
    const uploaded = await uploadAvatarObject({
      userId: input.userId,
      ...avatar,
      body: new Uint8Array(await input.avatar.arrayBuffer()),
    });
    image = `${avatarPathPrefix}${uploaded.key.split("/").map(encodeURIComponent).join("/")}`;
  }

  const updated = await updateUserProfile(input.userId, { name, ...(image !== undefined ? { image } : {}) });
  const previousAvatarKey = avatarKeyFromPath(current.image);
  if (previousAvatarKey && current.image !== updated.image) {
    try {
      await deleteAvatarObject(previousAvatarKey);
    } catch {
      // The profile is already updated. A failed cleanup must not roll it back.
    }
  }
  return updated;
}

export async function getAvatarAccessUrl(pathSegments: string[]) {
  if (pathSegments.length !== 3 || pathSegments[0] !== "avatars") return null;
  const [prefix, userId, fileName] = pathSegments;
  if (!/^[0-9a-f-]{36}$/i.test(userId) || !/^[A-Za-z0-9._-]+$/.test(fileName)) return null;
  return createAvatarAccessUrl(`${prefix}/${userId}/${fileName}`);
}
