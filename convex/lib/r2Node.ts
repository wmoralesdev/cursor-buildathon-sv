"use node";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials are not configured");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

function getBucketName(): string {
  const bucket = process.env.R2_BUCKET_NAME?.trim();
  if (!bucket) {
    throw new Error("R2_BUCKET_NAME is not configured");
  }
  return bucket;
}

export async function createPresignedUploadUrl(
  objectKey: string,
  contentType: string,
  fileSize: number,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: getBucketName(),
    Key: objectKey,
    ContentType: contentType,
    ContentLength: fileSize,
  });

  return await getSignedUrl(getR2Client(), command, { expiresIn: 60 * 15 });
}
