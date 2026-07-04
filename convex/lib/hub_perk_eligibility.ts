import type { QueryCtx, MutationCtx } from "../_generated/server";

export function normalizePerkEligibleEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function isPerkEligibleByEmail(
  ctx: QueryCtx | MutationCtx,
  email: string,
): Promise<boolean> {
  const normalized = normalizePerkEligibleEmail(email);
  const row = await ctx.db
    .query("hub_perk_eligible_emails")
    .withIndex("by_email", (q) => q.eq("email", normalized))
    .unique();
  return row !== null;
}

/** True when the standard-ticket allowlist has been seeded. */
export async function isPerkEligibilityListSeeded(
  ctx: QueryCtx | MutationCtx,
): Promise<boolean> {
  const first = await ctx.db.query("hub_perk_eligible_emails").first();
  return first !== null;
}

export type PerkEligibilityReason =
  | "standard_ticket"
  | "not_eligible"
  | "list_pending";

export async function getPerkEligibilityForEmail(
  ctx: QueryCtx | MutationCtx,
  email: string,
): Promise<{ eligible: boolean; reason: PerkEligibilityReason }> {
  const seeded = await isPerkEligibilityListSeeded(ctx);
  if (!seeded) {
    return { eligible: false, reason: "list_pending" };
  }

  const eligible = await isPerkEligibleByEmail(ctx, email);
  return {
    eligible,
    reason: eligible ? "standard_ticket" : "not_eligible",
  };
}
