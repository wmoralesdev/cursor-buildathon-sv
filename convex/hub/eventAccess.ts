import { internalMutation, query } from "../_generated/server";
import { v } from "convex/values";
import {
  emailFromClerkIdentity,
} from "../lib/clerk_identity";
import { requireHubRole } from "../lib/hub_auth";
import {
  getEventEligibilityForEmail,
  normalizeEventEligibleEmail,
} from "../lib/hub_event_eligibility";

const eventEligibilityReasonValidator = v.union(
  v.literal("registered"),
  v.literal("not_eligible"),
  v.literal("staff"),
);

const eventAccessValidator = v.object({
  eligible: v.boolean(),
  reason: eventEligibilityReasonValidator,
  email: v.optional(v.string()),
});

export const getEventAccess = query({
  args: {},
  returns: v.union(eventAccessValidator, v.null()),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const email = emailFromClerkIdentity(identity);
    if (!email) {
      return {
        eligible: false,
        reason: "not_eligible" as const,
      };
    }

    const { eligible, reason } = await getEventEligibilityForEmail(ctx, email);
    return {
      eligible,
      reason,
      email,
    };
  },
});

export const seedEventEligibleEmails = internalMutation({
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

    const existing = await ctx.db.query("hub_event_eligible_emails").collect();
    const existingEmails = new Set(existing.map((row) => row.email));

    for (const rawEmail of args.emails) {
      const email = normalizeEventEligibleEmail(rawEmail);
      if (!email || !email.includes("@")) {
        skipped += 1;
        continue;
      }
      if (existingEmails.has(email)) {
        skipped += 1;
        continue;
      }

      await ctx.db.insert("hub_event_eligible_emails", {
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

export const getEventEligibleEmailStats = query({
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

    const rows = await ctx.db.query("hub_event_eligible_emails").collect();
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
