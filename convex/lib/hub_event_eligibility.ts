import type { QueryCtx, MutationCtx } from "../_generated/server";

export function normalizeEventEligibleEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function isEventEligibleByEmail(
  ctx: QueryCtx | MutationCtx,
  email: string,
): Promise<boolean> {
  const normalized = normalizeEventEligibleEmail(email);
  const row = await ctx.db
    .query("hub_event_eligible_emails")
    .withIndex("by_email", (q) => q.eq("email", normalized))
    .unique();
  return row !== null;
}

export async function isHubStaffByEmail(
  ctx: QueryCtx | MutationCtx,
  email: string,
): Promise<boolean> {
  const normalized = normalizeEventEligibleEmail(email);
  const assignment = await ctx.db
    .query("hub_role_assignments")
    .withIndex("by_email", (q) => q.eq("email", normalized))
    .unique();
  return assignment !== null;
}

export type EventEligibilityReason = "registered" | "not_eligible" | "staff";

export async function getEventEligibilityForEmail(
  ctx: QueryCtx | MutationCtx,
  email: string,
): Promise<{ eligible: boolean; reason: EventEligibilityReason }> {
  if (await isHubStaffByEmail(ctx, email)) {
    return { eligible: true, reason: "staff" };
  }

  const eligible = await isEventEligibleByEmail(ctx, email);
  return {
    eligible,
    reason: eligible ? "registered" : "not_eligible",
  };
}
