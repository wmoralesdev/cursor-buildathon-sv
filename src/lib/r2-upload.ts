export interface R2UploadTarget {
  uploadUrl: string;
  objectKey: string;
  publicUrl: string;
}

export interface R2UploadRequest {
  scope: "hub" | "submit";
  contentType: string;
  fileSize: number;
  fileName?: string;
}

export async function uploadToR2(
  file: File,
  scope: "hub" | "submit",
  getUploadUrl: (request: R2UploadRequest) => Promise<R2UploadTarget>,
  onProgress?: (percent: number) => void,
): Promise<R2UploadTarget> {
  onProgress?.(5);

  const target = await getUploadUrl({
    scope,
    contentType: file.type || "application/octet-stream",
    fileSize: file.size,
    fileName: file.name,
  });

  onProgress?.(15);

  const response = await fetch(target.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Upload failed — please try again");
  }

  onProgress?.(100);
  return target;
}

export async function uploadVideoToR2(
  file: File,
  scope: "hub" | "submit",
  getUploadUrl: (request: R2UploadRequest) => Promise<R2UploadTarget>,
  onProgress?: (percent: number) => void,
): Promise<R2UploadTarget> {
  return uploadToR2(
    file,
    scope,
    (request) =>
      getUploadUrl({
        ...request,
        contentType: file.type || "video/mp4",
      }),
    onProgress,
  );
}
