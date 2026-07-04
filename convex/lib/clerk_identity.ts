import type { UserIdentity } from "convex/server";

const EMAIL_CLAIM_KEYS = [
  "email",
  "primary_email_address",
  "email_address",
  "primaryEmailAddress",
] as const;

/** Resolve email from Convex identity (requires Clerk Sessions → Claims mapping). */
export function emailFromClerkIdentity(identity: UserIdentity): string | null {
  const direct = identity.email?.trim().toLowerCase();
  if (direct) return direct;

  const record = identity as UserIdentity & Record<string, unknown>;
  for (const key of EMAIL_CLAIM_KEYS) {
    const value = record[key];
    if (typeof value === "string" && value.includes("@")) {
      return value.trim().toLowerCase();
    }
  }

  return null;
}

export const CLERK_EMAIL_CLAIM_SETUP_HINT =
  "Add an email claim in Clerk Dashboard → Configure → Sessions → Customize session token → Claims: " +
  'email = {{user.primary_email_address.email_address}}. Then sign out and sign back in.';
