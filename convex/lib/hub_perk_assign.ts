import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { isPerkEligibleByEmail } from "./hub_perk_eligibility";
import {
  getInventoryDeliveries,
  type PerkSponsorId,
  type PerkVariant,
} from "./hub_perk_delivery";

export async function claimPerksForUser(
  ctx: MutationCtx,
  userId: Id<"hub_users">,
): Promise<void> {
  const user = await ctx.db.get(userId);
  if (!user) {
    return;
  }

  const eligible = await isPerkEligibleByEmail(ctx, user.email);
  if (!eligible) {
    return;
  }
  const inventoryDeliveries = getInventoryDeliveries();
  const alreadyAssigned = await ctx.db
    .query("hub_perk_inventory")
    .withIndex("by_assigned_user", (q) => q.eq("assignedToUserId", userId))
    .collect();

  for (const delivery of inventoryDeliveries) {
    const hasVariant = alreadyAssigned.some(
      (row) =>
        row.sponsorId === delivery.sponsorId &&
        row.variant === delivery.variant &&
        row.kind === delivery.kind,
    );

    if (hasVariant) {
      continue;
    }

    await claimInventoryItem(ctx, {
      userId,
      sponsorId: delivery.sponsorId,
      kind: delivery.kind,
      variant: delivery.variant,
    });
  }
}

async function claimInventoryItem(
  ctx: MutationCtx,
  args: {
    userId: Id<"hub_users">;
    sponsorId: PerkSponsorId;
    kind: "link" | "code";
    variant: PerkVariant;
  },
): Promise<void> {
  const available = await ctx.db
    .query("hub_perk_inventory")
    .withIndex("by_sponsor_kind_variant_status", (q) =>
      q
        .eq("sponsorId", args.sponsorId)
        .eq("kind", args.kind)
        .eq("variant", args.variant)
        .eq("status", "available"),
    )
    .first();

  if (!available) {
    console.error("Perk inventory exhausted", {
      sponsorId: args.sponsorId,
      kind: args.kind,
      variant: args.variant,
      userId: args.userId,
    });
    return;
  }

  await ctx.db.patch(available._id, {
    status: "assigned",
    assignedToUserId: args.userId,
    assignedAt: Date.now(),
  });
}
