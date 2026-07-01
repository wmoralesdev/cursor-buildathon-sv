"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import {
  buildObjectKey,
  getPublicUrl,
  validateUploadRequest,
  type R2UploadScope,
} from "./lib/r2";
import { createPresignedUploadUrl } from "./lib/r2Node";

const uploadScopeValidator = v.union(v.literal("hub"), v.literal("submit"));

const uploadTargetValidator = v.object({
  uploadUrl: v.string(),
  objectKey: v.string(),
  publicUrl: v.string(),
});

export const generateUploadUrl = action({
  args: {
    scope: uploadScopeValidator,
    contentType: v.string(),
    fileSize: v.number(),
    fileName: v.optional(v.string()),
  },
  returns: uploadTargetValidator,
  handler: async (_ctx, args) => {
    if (args.fileSize <= 0) {
      throw new Error("File size must be greater than zero");
    }

    validateUploadRequest(args.contentType, args.fileSize);
    const objectKey = buildObjectKey(
      args.scope as R2UploadScope,
      args.contentType,
      args.fileName,
    );
    const uploadUrl = await createPresignedUploadUrl(
      objectKey,
      args.contentType,
      args.fileSize,
    );

    return {
      uploadUrl,
      objectKey,
      publicUrl: getPublicUrl(objectKey),
    };
  },
});
