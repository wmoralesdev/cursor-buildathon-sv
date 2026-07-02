import { v } from "convex/values";

export type HubProfileOverrides = {
  email?: string;
  name?: string;
  pictureUrl?: string;
};

export const hubProfileArgsValidator = {
  profileEmail: v.optional(v.string()),
  profileName: v.optional(v.string()),
  profilePictureUrl: v.optional(v.string()),
};

export function hubProfileFromArgs(args: {
  profileEmail?: string;
  profileName?: string;
  profilePictureUrl?: string;
}): HubProfileOverrides {
  return {
    email: args.profileEmail?.trim() || undefined,
    name: args.profileName?.trim() || undefined,
    pictureUrl: args.profilePictureUrl?.trim() || undefined,
  };
}
