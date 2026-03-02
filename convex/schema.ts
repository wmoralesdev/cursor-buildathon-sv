import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const memberValidator = v.object({
  name: v.string(),
  email: v.optional(v.string()),
});

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    pictureUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),

  teams: defineTable({
    name: v.string(),
    members: v.array(memberValidator),
    leaderIndex: v.number(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_creator", ["createdBy"]),

  projects: defineTable({
    teamId: v.id("teams"),
    name: v.string(),
    track: v.union(v.literal("ai_consumer"), v.literal("fintech_web3")),
    description: v.string(),
    repoLink: v.optional(v.string()),
    demoLink: v.optional(v.string()),
    pitchSummary: v.string(),
    techStack: v.string(),
    teamRoles: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_team", ["teamId"]),

  social_posts: defineTable({
    teamId: v.id("teams"),
    platform: v.union(v.literal("x"), v.literal("linkedin")),
    url: v.string(),
    createdAt: v.number(),
  }).index("by_team", ["teamId"]),

  project_scores: defineTable({
    projectId: v.id("projects"),
    userId: v.id("users"),
    criterion1: v.number(),
    criterion2: v.number(),
    criterion3: v.number(),
    criterion4: v.number(),
    criterion5: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_project", ["projectId"])
    .index("by_user", ["userId"])
    .index("by_project_and_user", ["projectId", "userId"]),
});
