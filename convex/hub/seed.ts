import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

const DEFAULT_MENTORS = [
  {
    name: "Walter Morales",
    role: "Regional Lead at Cursor",
    company: "Cursor",
    remote: true,
    bookingUrl: "",
    email: "walter@cursor.com",
    sortOrder: 0,
  },
  {
    name: "Mentor Placeholder",
    role: "Product mentor",
    company: "Partner",
    remote: true,
    bookingUrl: "",
    email: "mentor@example.com",
    sortOrder: 1,
  },
] as const;

export const seedHubDefaults = internalMutation({
  args: {
    roleAssignments: v.optional(
      v.array(
        v.object({
          email: v.string(),
          role: v.union(
            v.literal("logistics"),
            v.literal("mentor"),
            v.literal("jury"),
          ),
        }),
      ),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existingMentors = await ctx.db.query("hub_mentors").collect();
    if (existingMentors.length === 0) {
      const now = Date.now();
      for (const mentor of DEFAULT_MENTORS) {
        await ctx.db.insert("hub_mentors", {
          name: mentor.name,
          role: mentor.role,
          company: mentor.company,
          remote: mentor.remote,
          bookingUrl: mentor.bookingUrl || undefined,
          email: mentor.email,
          active: true,
          sortOrder: mentor.sortOrder,
          createdAt: now,
        });
      }
    }

    if (args.roleAssignments) {
      for (const assignment of args.roleAssignments) {
        const email = assignment.email.trim().toLowerCase();
        const existing = await ctx.db
          .query("hub_role_assignments")
          .withIndex("by_email", (q) => q.eq("email", email))
          .unique();
        if (!existing) {
          await ctx.db.insert("hub_role_assignments", {
            email,
            role: assignment.role,
            createdAt: Date.now(),
          });
        }
      }
    }

    return null;
  },
});
