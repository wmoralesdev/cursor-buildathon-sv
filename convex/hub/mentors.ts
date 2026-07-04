import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { requireHubRole } from "../lib/hub_auth";
import { toHubMentorPublic } from "../lib/hub_projections";

const mentorValidator = v.object({
  _id: v.id("hub_mentors"),
  name: v.string(),
  role: v.string(),
  company: v.optional(v.string()),
  avatarUrl: v.optional(v.string()),
  bio: v.optional(v.string()),
  remote: v.boolean(),
  bookingUrl: v.optional(v.string()),
  email: v.optional(v.string()),
  active: v.boolean(),
  sortOrder: v.number(),
});

export const listMentors = query({
  args: { remoteOnly: v.optional(v.boolean()) },
  returns: v.array(mentorValidator),
  handler: async (ctx, args) => {
    const mentors = await ctx.db.query("hub_mentors").collect();
    return mentors
      .filter((mentor) => mentor.active)
      .filter((mentor) => (args.remoteOnly ? mentor.remote : true))
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(toHubMentorPublic);
  },
});

export const upsertMentor = mutation({
  args: {
    mentorId: v.optional(v.id("hub_mentors")),
    name: v.string(),
    role: v.string(),
    company: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    remote: v.boolean(),
    bookingUrl: v.optional(v.string()),
    email: v.optional(v.string()),
    active: v.boolean(),
    sortOrder: v.number(),
  },
  returns: v.id("hub_mentors"),
  handler: async (ctx, args) => {
    await requireHubRole(ctx, "logistics");
    const now = Date.now();

    if (args.mentorId) {
      await ctx.db.patch(args.mentorId, {
        name: args.name.trim(),
        role: args.role.trim(),
        company: args.company?.trim() || undefined,
        avatarUrl: args.avatarUrl?.trim() || undefined,
        bio: args.bio?.trim() || undefined,
        remote: args.remote,
        bookingUrl: args.bookingUrl?.trim() || undefined,
        email: args.email?.trim().toLowerCase() || undefined,
        active: args.active,
        sortOrder: args.sortOrder,
        updatedAt: now,
      });
      return args.mentorId;
    }

    return await ctx.db.insert("hub_mentors", {
      name: args.name.trim(),
      role: args.role.trim(),
      company: args.company?.trim() || undefined,
      avatarUrl: args.avatarUrl?.trim() || undefined,
      bio: args.bio?.trim() || undefined,
      remote: args.remote,
      bookingUrl: args.bookingUrl?.trim() || undefined,
      email: args.email?.trim().toLowerCase() || undefined,
      active: args.active,
      sortOrder: args.sortOrder,
      createdAt: now,
    });
  },
});
