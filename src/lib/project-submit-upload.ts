import type { Id } from "../../convex/_generated/dataModel";
import { PROJECT_SUBMIT_VIDEO_MAX_BYTES } from "../components/project-submit-form-fields";

export async function uploadProjectVideo(
  file: File,
  generateUploadUrl: () => Promise<string>,
  onProgress?: (percent: number) => void,
): Promise<Id<"_storage">> {
  if (file.size > PROJECT_SUBMIT_VIDEO_MAX_BYTES) {
    throw new Error("Demo video must be 100 MB or smaller");
  }

  onProgress?.(5);
  const uploadUrl = await generateUploadUrl();
  onProgress?.(15);

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Video upload failed — please try again");
  }

  onProgress?.(90);
  const result = (await response.json()) as { storageId?: Id<"_storage"> };
  if (!result.storageId) {
    throw new Error("Video upload failed — please try again");
  }

  onProgress?.(100);
  return result.storageId;
}

export function formatVideoFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
