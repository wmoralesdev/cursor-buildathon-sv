import { PROJECT_SUBMIT_VIDEO_MAX_BYTES } from "../components/project-submit-form-fields";
import type { R2UploadRequest, R2UploadTarget } from "./r2-upload";
import { uploadToR2 } from "./r2-upload";

export async function uploadProjectVideo(
  file: File,
  getUploadUrl: (request: R2UploadRequest) => Promise<R2UploadTarget>,
  onProgress?: (percent: number) => void,
): Promise<string> {
  if (file.size > PROJECT_SUBMIT_VIDEO_MAX_BYTES) {
    throw new Error("Demo video must be 100 MB or smaller");
  }

  const target = await uploadToR2(
    file,
    "submit",
    getUploadUrl,
    onProgress,
  );

  return target.objectKey;
}

export function formatVideoFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
