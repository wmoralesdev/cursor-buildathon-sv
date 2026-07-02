export const VIDEO_MAX_BYTES = 100 * 1024 * 1024;
export const IMAGE_MAX_BYTES = 10 * 1024 * 1024;

export const ALLOWED_VIDEO_MIME_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
]);

export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export type R2UploadScope = "hub" | "submit";

export function getR2PublicBaseUrl(): string {
  const base = process.env.R2_PUBLIC_BASE_URL?.trim().replace(/\/$/, "");
  if (!base) {
    throw new Error("R2_PUBLIC_BASE_URL is not configured");
  }
  return base;
}

export function getPublicUrl(objectKey: string): string {
  return `${getR2PublicBaseUrl()}/${objectKey}`;
}

export function getUploadPrefix(): string {
  const prefix = process.env.R2_UPLOAD_PREFIX?.trim() || "uploads/";
  return prefix.endsWith("/") ? prefix : `${prefix}/`;
}

export function isAllowedObjectKey(objectKey: string, scope: R2UploadScope): boolean {
  const prefix = `${getUploadPrefix()}${scope}/`;
  return objectKey.startsWith(prefix) && !objectKey.includes("..");
}

export function validateUploadRequest(contentType: string, fileSize: number): {
  scope: "video" | "image";
  maxBytes: number;
  allowedMimeTypes: Set<string>;
} {
  const normalizedType = contentType.split(";")[0]?.trim().toLowerCase() ?? "";

  if (ALLOWED_VIDEO_MIME_TYPES.has(normalizedType)) {
    if (fileSize > VIDEO_MAX_BYTES) {
      throw new Error("Video must be 100 MB or smaller");
    }
    return {
      scope: "video",
      maxBytes: VIDEO_MAX_BYTES,
      allowedMimeTypes: ALLOWED_VIDEO_MIME_TYPES,
    };
  }

  if (ALLOWED_IMAGE_MIME_TYPES.has(normalizedType)) {
    if (fileSize > IMAGE_MAX_BYTES) {
      throw new Error("Image must be 10 MB or smaller");
    }
    return {
      scope: "image",
      maxBytes: IMAGE_MAX_BYTES,
      allowedMimeTypes: ALLOWED_IMAGE_MIME_TYPES,
    };
  }

  throw new Error("Unsupported file type");
}

export function buildObjectKey(
  scope: R2UploadScope,
  contentType: string,
  fileName?: string,
): string {
  const extension = extensionForContentType(contentType);
  const safeName = sanitizeFileName(fileName) || "file";
  const id = crypto.randomUUID();
  return `${getUploadPrefix()}${scope}/${id}-${safeName}${extension}`;
}

function sanitizeFileName(fileName: string | undefined): string {
  if (!fileName?.trim()) return "";
  return fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function extensionForContentType(contentType: string): string {
  const normalized = contentType.split(";")[0]?.trim().toLowerCase() ?? "";
  switch (normalized) {
    case "video/mp4":
      return ".mp4";
    case "video/webm":
      return ".webm";
    case "video/quicktime":
      return ".mov";
    case "video/x-msvideo":
      return ".avi";
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return "";
  }
}

export async function verifyR2Object(
  objectKey: string,
  scope: R2UploadScope,
  options: { maxBytes: number; allowedMimeTypes: Set<string> },
): Promise<void> {
  if (!isAllowedObjectKey(objectKey, scope)) {
    throw new Error("Invalid upload key");
  }

  const response = await fetch(getPublicUrl(objectKey), { method: "HEAD" });
  if (!response.ok) {
    throw new Error("Upload not found — please try uploading again");
  }

  const contentLength = Number(response.headers.get("content-length") ?? 0);
  if (contentLength <= 0) {
    throw new Error("Upload verification failed");
  }
  if (contentLength > options.maxBytes) {
    throw new Error("Uploaded file exceeds size limit");
  }

  const contentType = response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
  if (contentType && !options.allowedMimeTypes.has(contentType)) {
    throw new Error("Uploaded file has invalid type");
  }
}

export async function verifyVideoR2Key(objectKey: string, scope: R2UploadScope): Promise<void> {
  await verifyR2Object(objectKey, scope, {
    maxBytes: VIDEO_MAX_BYTES,
    allowedMimeTypes: ALLOWED_VIDEO_MIME_TYPES,
  });
}
