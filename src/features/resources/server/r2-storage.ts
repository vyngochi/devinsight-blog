import "server-only";

import { randomUUID } from "node:crypto";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
};

function getR2Config(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName)
    return null;
  return { accountId, accessKeyId, secretAccessKey, bucketName };
}

function requireR2Config() {
  const config = getR2Config();
  if (!config)
    throw new Error(
      "Cloudflare R2 chưa được cấu hình. Hãy kiểm tra các biến môi trường R2.",
    );
  return config;
}

function getR2Client(config: R2Config) {
  return new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

function safeFileName(fileName: string) {
  const baseName = fileName
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
  return baseName || "resource";
}

function contentDisposition(fileName: string, download: boolean) {
  return `${download ? "attachment" : "inline"}; filename="${safeFileName(fileName)}"`;
}

export function isR2Configured() {
  return Boolean(getR2Config());
}

export async function createResourceUploadUrl(input: {
  fileName: string;
  mimeType: string;
}) {
  const config = requireR2Config();
  const client = getR2Client(config);
  const key = `resources/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safeFileName(input.fileName)}`;
  const uploadUrl = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      ContentType: input.mimeType,
    }),
    { expiresIn: 10 * 60 },
  );

  return { key, uploadUrl };
}

export async function uploadPostImageObject(input: {
  fileName: string;
  mimeType: string;
  body: Uint8Array;
}) {
  const config = requireR2Config();
  const client = getR2Client(config);
  const key = `post-images/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safeFileName(input.fileName)}`;
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      ContentType: input.mimeType,
      Body: input.body,
    }),
  );
  return { key };
}

export async function createResourceAccessUrl(input: {
  key: string;
  fileName: string;
  download: boolean;
}) {
  const config = requireR2Config();
  const client = getR2Client(config);
  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: config.bucketName,
      Key: input.key,
      ResponseContentDisposition: contentDisposition(
        input.fileName,
        input.download,
      ),
    }),
    { expiresIn: 5 * 60 },
  );
}

export async function createPostImageAccessUrl(key: string) {
  const config = requireR2Config();
  const client = getR2Client(config);
  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      ResponseContentDisposition: "inline",
    }),
    { expiresIn: 5 * 60 },
  );
}

export async function deleteResourceObject(key: string) {
  const config = requireR2Config();
  const client = getR2Client(config);
  await client.send(
    new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    }),
  );
}
