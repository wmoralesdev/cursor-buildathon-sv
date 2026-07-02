import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Active organizer announcements for the builder hub banner.
 *
 * Day-of updates (room changes, deadline shifts) are seeded/edited from the
 * Convex dashboard — no admin UI is required for v1. Pass the viewer's locale
 * to keep locale-targeted messages relevant; untargeted messages show to all.
 */
export const listActiveAnnouncements = query({
  args: {
    now: v.number(),
    locale: v.optional(v.union(v.literal("en"), v.literal("es"))),
  },
  handler: async (ctx, args) => {
    const recent = await ctx.db
      .query("announcements")
      .withIndex("by_created_at")
      .order("desc")
      .take(20);

    return recent
      .filter((a) => (a.expiresAt ?? Infinity) > args.now)
      .filter((a) => !a.locale || !args.locale || a.locale === args.locale)
      .sort((a, b) => {
        if (a.priority !== b.priority) return a.priority === "urgent" ? -1 : 1;
        return b.createdAt - a.createdAt;
      })
      .map((a) => ({
        id: a._id,
        message: a.message,
        priority: a.priority,
      }));
  },
});
