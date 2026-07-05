import { internalMutation, query } from "../_generated/server";
import { v } from "convex/values";
import { requireHubRole, requireHubUser } from "../lib/hub_auth";
import { claimPerksForUser } from "../lib/hub_perk_assign";
import {
  getPerkEligibilityForEmail,
  normalizePerkEligibleEmail,
} from "../lib/hub_perk_eligibility";
import {
  PERK_DELIVERY_CONFIG,
  perkConfigKey,
  perkSponsorIdValidator,
  perkVariantValidator,
  type PerkDeliveryMode,
  type PerkScope,
  type PerkSponsorId,
  type PerkStatus,
  type PerkVariant,
} from "../lib/hub_perk_delivery";

const perkStatusValidator = v.union(
  v.literal("ready"),
  v.literal("pending"),
  v.literal("needs_team"),
  v.literal("unavailable"),
  v.literal("locked"),
);

const perkDeliveryModeValidator = v.union(
  v.literal("unique_link"),
  v.literal("unique_code"),
  v.literal("shared_link"),
  v.literal("shared_code"),
  v.literal("discord"),
  v.literal("pending"),
);

const myPerkValidator = v.object({
  entryId: v.string(),
  sponsorId: perkSponsorIdValidator,
  scope: v.union(v.literal("user"), v.literal("team")),
  deliveryMode: perkDeliveryModeValidator,
  variant: perkVariantValidator,
  labelKey: v.string(),
  secret: v.optional(v.string()),
  channelUrl: v.optional(v.string()),
  redeemUrl: v.optional(v.string()),
  status: perkStatusValidator,
});

const myPerksResultValidator = v.object({
  eligible: v.boolean(),
  eligibilityReason: v.union(
    v.literal("standard_ticket"),
    v.literal("not_eligible"),
    v.literal("list_pending"),
  ),
  perks: v.array(myPerkValidator),
});

const inventoryStatValidator = v.object({
  sponsorId: perkSponsorIdValidator,
  kind: v.union(v.literal("link"), v.literal("code")),
  variant: perkVariantValidator,
  available: v.number(),
  assigned: v.number(),
});

function variantLabelKey(
  sponsorId: PerkSponsorId,
  variant: PerkVariant,
): string {
  if (sponsorId === "codex" && variant === "codex_api") {
    return "builder.perks.variant.codex_api";
  }
  if (sponsorId === "codex" && variant === "codex_link") {
    return "builder.perks.variant.codex_link";
  }
  return `builder.perks.sponsor.${sponsorId}`;
}

async function userHasTeam(
  ctx: Parameters<typeof requireHubUser>[0],
  userId: Awaited<ReturnType<typeof requireHubUser>>["_id"],
): Promise<boolean> {
  const membership = await ctx.db
    .query("hub_team_members")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();
  return membership !== null;
}

async function buildMyPerks(
  ctx: Parameters<typeof requireHubUser>[0],
  userId: Awaited<ReturnType<typeof requireHubUser>>["_id"],
  eligible: boolean,
) {
  const assignedRows = await ctx.db
    .query("hub_perk_inventory")
    .withIndex("by_assigned_user", (q) => q.eq("assignedToUserId", userId))
    .collect();

  const onTeam = await userHasTeam(ctx, userId);
  const perks: Array<{
    entryId: string;
    sponsorId: PerkSponsorId;
    scope: PerkScope;
    deliveryMode: PerkDeliveryMode;
    variant: PerkVariant;
    labelKey: string;
    secret?: string;
    channelUrl?: string;
    redeemUrl?: string;
    status: PerkStatus;
  }> = [];

  for (const config of PERK_DELIVERY_CONFIG) {
    if (config.mode === "skip") {
      continue;
    }

    const scope = config.scope;
    const variant: PerkVariant =
      config.mode === "inventory" ? config.variant : "default";
    const entryId = perkConfigKey(config.sponsorId, variant);
    const labelKey = variantLabelKey(config.sponsorId, variant);
    const redeemUrl = "redeemUrl" in config ? config.redeemUrl : undefined;

    if (config.mode === "inventory") {
      const assigned = assignedRows.find(
        (row) =>
          row.sponsorId === config.sponsorId &&
          row.kind === config.kind &&
          row.variant === config.variant,
      );

      perks.push({
        entryId,
        sponsorId: config.sponsorId,
        scope,
        deliveryMode: config.kind === "link" ? "unique_link" : "unique_code",
        variant,
        labelKey,
        secret: eligible && assigned ? assigned.secret : undefined,
        redeemUrl,
        status: !eligible ? "locked" : assigned ? "ready" : "unavailable",
      });
      continue;
    }

    if (config.mode === "shared_link") {
      perks.push({
        entryId,
        sponsorId: config.sponsorId,
        scope,
        deliveryMode: "shared_link",
        variant,
        labelKey,
        secret: eligible ? config.url : undefined,
        redeemUrl,
        status: eligible ? "ready" : "locked",
      });
      continue;
    }

    if (config.mode === "shared_code") {
      if (!eligible) {
        perks.push({
          entryId,
          sponsorId: config.sponsorId,
          scope,
          deliveryMode: "shared_code",
          variant,
          labelKey,
          redeemUrl,
          status: "locked",
        });
        continue;
      }

      let status: PerkStatus = "ready";
      if (scope === "team" && !onTeam) {
        status = "needs_team";
      } else if (config.pending || !config.code) {
        status = "pending";
      }

      perks.push({
        entryId,
        sponsorId: config.sponsorId,
        scope,
        deliveryMode: status === "pending" ? "pending" : "shared_code",
        variant,
        labelKey,
        secret: status === "ready" ? config.code : undefined,
        redeemUrl,
        status,
      });
      continue;
    }

    if (config.mode === "discord") {
      if (!eligible) {
        perks.push({
          entryId,
          sponsorId: config.sponsorId,
          scope,
          deliveryMode: "discord",
          variant,
          labelKey,
          redeemUrl,
          status: "locked",
        });
        continue;
      }

      const hasUrl = config.channelUrl.trim().length > 0;
      perks.push({
        entryId,
        sponsorId: config.sponsorId,
        scope,
        deliveryMode: "discord",
        variant,
        labelKey,
        channelUrl: hasUrl ? config.channelUrl : undefined,
        redeemUrl,
        status: hasUrl ? "ready" : "pending",
      });
    }
  }

  return perks;
}

export const getMyPerks = query({
  args: {},
  returns: myPerksResultValidator,
  handler: async (ctx) => {
    const user = await requireHubUser(ctx);
    const { eligible, reason } = await getPerkEligibilityForEmail(ctx, user.email);
    const perks = await buildMyPerks(ctx, user._id, eligible);
    return {
      eligible,
      eligibilityReason: reason,
      perks,
    };
  },
});

export const getInventoryStats = query({
  args: {},
  returns: v.array(inventoryStatValidator),
  handler: async (ctx) => {
    await requireHubRole(ctx, "logistics");

    const rows = await ctx.db.query("hub_perk_inventory").collect();
    const counts = new Map<
      string,
      { sponsorId: PerkSponsorId; kind: "link" | "code"; variant: PerkVariant; available: number; assigned: number }
    >();

    for (const row of rows) {
      const key = `${row.sponsorId}:${row.kind}:${row.variant}`;
      const existing = counts.get(key) ?? {
        sponsorId: row.sponsorId,
        kind: row.kind,
        variant: row.variant,
        available: 0,
        assigned: 0,
      };
      if (row.status === "available") {
        existing.available += 1;
      } else {
        existing.assigned += 1;
      }
      counts.set(key, existing);
    }

    return Array.from(counts.values()).sort((a, b) =>
      `${a.sponsorId}:${a.variant}`.localeCompare(`${b.sponsorId}:${b.variant}`),
    );
  },
});

const seedRowValidator = v.object({
  sponsorId: perkSponsorIdValidator,
  kind: v.union(v.literal("link"), v.literal("code")),
  variant: v.optional(perkVariantValidator),
  secret: v.string(),
});

export const seedPerkInventory = internalMutation({
  args: {
    batchId: v.optional(v.string()),
    rows: v.array(seedRowValidator),
  },
  returns: v.object({
    inserted: v.number(),
    skipped: v.number(),
  }),
  handler: async (ctx, args) => {
    const now = Date.now();
    let inserted = 0;
    let skipped = 0;

    const existing = await ctx.db.query("hub_perk_inventory").collect();
    const existingKeys = new Set(
      existing.map((row) => `${row.sponsorId}:${row.kind}:${row.variant}:${row.secret}`),
    );

    for (const row of args.rows) {
      const secret = row.secret.trim();
      if (!secret) {
        skipped += 1;
        continue;
      }

      const variant = row.variant ?? "default";
      const key = `${row.sponsorId}:${row.kind}:${variant}:${secret}`;
      if (existingKeys.has(key)) {
        skipped += 1;
        continue;
      }

      await ctx.db.insert("hub_perk_inventory", {
        sponsorId: row.sponsorId,
        kind: row.kind,
        variant,
        secret,
        status: "available",
        batchId: args.batchId,
        createdAt: now,
      });
      existingKeys.add(key);
      inserted += 1;
    }

    return { inserted, skipped };
  },
});

/** Re-run inventory claims for eligible users who registered before seeding. */
export const backfillPerkClaims = internalMutation({
  args: {},
  returns: v.object({ usersProcessed: v.number(), claimsAttempted: v.number() }),
  handler: async (ctx) => {
    const users = await ctx.db.query("hub_users").collect();
    let claimsAttempted = 0;
    for (const user of users) {
      const eligible = await getPerkEligibilityForEmail(ctx, user.email);
      if (!eligible.eligible) {
        continue;
      }
      claimsAttempted += 1;
      await claimPerksForUser(ctx, user._id);
    }
    return { usersProcessed: users.length, claimsAttempted };
  },
});

/** Claim inventory perks for one hub user by email (ops/backfill). */
export const claimPerksForUserByEmail = internalMutation({
  args: { email: v.string() },
  returns: v.object({
    userId: v.union(v.id("hub_users"), v.null()),
    perkCount: v.number(),
  }),
  handler: async (ctx, args) => {
    const email = normalizePerkEligibleEmail(args.email);
    const user = await ctx.db
      .query("hub_users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!user) {
      return { userId: null, perkCount: 0 };
    }

    await claimPerksForUser(ctx, user._id);

    const assigned = await ctx.db
      .query("hub_perk_inventory")
      .withIndex("by_assigned_user", (q) => q.eq("assignedToUserId", user._id))
      .collect();

    return { userId: user._id, perkCount: assigned.length };
  },
});

export const seedPerkEligibleEmails = internalMutation({
  args: {
    batchId: v.optional(v.string()),
    emails: v.array(v.string()),
  },
  returns: v.object({
    inserted: v.number(),
    skipped: v.number(),
  }),
  handler: async (ctx, args) => {
    const now = Date.now();
    let inserted = 0;
    let skipped = 0;

    const existing = await ctx.db.query("hub_perk_eligible_emails").collect();
    const existingEmails = new Set(existing.map((row) => row.email));

    for (const rawEmail of args.emails) {
      const email = normalizePerkEligibleEmail(rawEmail);
      if (!email || !email.includes("@")) {
        skipped += 1;
        continue;
      }
      if (existingEmails.has(email)) {
        skipped += 1;
        continue;
      }

      await ctx.db.insert("hub_perk_eligible_emails", {
        email,
        batchId: args.batchId,
        createdAt: now,
      });
      existingEmails.add(email);
      inserted += 1;
    }

    return { inserted, skipped };
  },
});

export const getEligibleEmailStats = query({
  args: {},
  returns: v.object({
    total: v.number(),
    batches: v.array(
      v.object({
        batchId: v.string(),
        count: v.number(),
      }),
    ),
  }),
  handler: async (ctx) => {
    await requireHubRole(ctx, "logistics");

    const rows = await ctx.db.query("hub_perk_eligible_emails").collect();
    const batchCounts = new Map<string, number>();

    for (const row of rows) {
      const batchId = row.batchId ?? "default";
      batchCounts.set(batchId, (batchCounts.get(batchId) ?? 0) + 1);
    }

    return {
      total: rows.length,
      batches: Array.from(batchCounts.entries())
        .map(([batchId, count]) => ({ batchId, count }))
        .sort((a, b) => a.batchId.localeCompare(b.batchId)),
    };
  },
});
