import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { sponsorTrackValidator } from "./lib/sponsorTracks";
import { competitionTrackValidator } from "./lib/competitionTracks";
import { hubRoleValidator } from "./lib/hubRoles";
import { hubSponsorIdValidator } from "./lib/hubSponsorIds";

const memberValidator = v.object({
  name: v.string(),
  email: v.optional(v.string()),
});

const submissionMemberValidator = v.object({
  name: v.string(),
  xProfile: v.string(),
  linkedInProfile: v.string(),
});

const eventTeamMemberValidator = v.object({
  sessionId: v.string(),
  name: v.string(),
  xProfile: v.string(),
  linkedInProfile: v.string(),
  isLeader: v.boolean(),
  joinedAt: v.number(),
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

  event_teams: defineTable({
    name: v.string(),
    inviteCode: v.string(),
    leaderSessionId: v.string(),
    members: v.array(eventTeamMemberValidator),
    sponsorTrack: v.optional(sponsorTrackValidator),
    competitionTrack: v.optional(competitionTrackValidator),
    submittedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_invite_code", ["inviteCode"])
    .index("by_leader_session", ["leaderSessionId"]),

  project_submissions: defineTable({
    teamName: v.string(),
    members: v.array(submissionMemberValidator),
    repoUrl: v.string(),
    description: v.string(),
    videoR2Key: v.string(),
    eventSocialPostUrl: v.string(),
    competitionTrack: v.optional(competitionTrackValidator),
    eventTeamId: v.optional(v.id("event_teams")),
    submittedAt: v.number(),
  })
    .index("by_submitted_at", ["submittedAt"])
    .index("by_event_team", ["eventTeamId"]),

  announcements: defineTable({
    message: v.string(),
    priority: v.union(v.literal("info"), v.literal("urgent")),
    locale: v.optional(v.union(v.literal("en"), v.literal("es"))),
    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
  }).index("by_created_at", ["createdAt"]),

  hub_users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    role: v.optional(hubRoleValidator),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  hub_role_assignments: defineTable({
    email: v.string(),
    role: hubRoleValidator,
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  hub_teams: defineTable({
    name: v.string(),
    inviteCode: v.string(),
    track: v.optional(competitionTrackValidator),
    captainId: v.id("hub_users"),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_invite_code", ["inviteCode"])
    .index("by_captain", ["captainId"]),

  hub_team_members: defineTable({
    teamId: v.id("hub_teams"),
    userId: v.id("hub_users"),
    joinedAt: v.number(),
  })
    .index("by_team", ["teamId"])
    .index("by_user", ["userId"]),

  hub_progress: defineTable({
    teamId: v.id("hub_teams"),
    stepId: v.string(),
    completedAt: v.number(),
    completedBy: v.id("hub_users"),
  }).index("by_team", ["teamId"]),

  hub_checkpoints: defineTable({
    teamId: v.id("hub_teams"),
    checkpointId: v.string(),
    note: v.string(),
    submittedAt: v.number(),
    submittedBy: v.id("hub_users"),
  })
    .index("by_team", ["teamId"])
    .index("by_team_and_checkpoint", ["teamId", "checkpointId"]),

  hub_projects: defineTable({
    teamId: v.id("hub_teams"),
    name: v.string(),
    description: v.string(),
    url: v.string(),
    repoUrl: v.string(),
    sponsorsUsed: v.array(hubSponsorIdValidator),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_team", ["teamId"]),

  hub_deliverables: defineTable({
    teamId: v.id("hub_teams"),
    slidesUrl: v.optional(v.string()),
    videoR2Key: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    testUsers: v.optional(v.string()),
    submittedAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  }).index("by_team", ["teamId"]),

  hub_sponsor_feedback: defineTable({
    userId: v.id("hub_users"),
    teamId: v.id("hub_teams"),
    sponsorId: hubSponsorIdValidator,
    feedback: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_team", ["teamId"])
    .index("by_user_team_sponsor", ["userId", "teamId", "sponsorId"]),

  hub_social_posts: defineTable({
    teamId: v.id("hub_teams"),
    userId: v.id("hub_users"),
    platform: v.union(v.literal("x"), v.literal("linkedin")),
    url: v.string(),
    createdAt: v.number(),
  }).index("by_team", ["teamId"]),

  hub_mentors: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_email", ["email"]),

  hub_booths: defineTable({
    name: v.string(),
    location: v.string(),
    active: v.boolean(),
    sortOrder: v.number(),
    createdAt: v.number(),
  }),

  hub_booth_slots: defineTable({
    boothId: v.id("hub_booths"),
    startsAt: v.number(),
    endsAt: v.number(),
  }).index("by_booth", ["boothId"]),

  hub_booth_reservations: defineTable({
    slotId: v.id("hub_booth_slots"),
    teamId: v.id("hub_teams"),
    reservedBy: v.id("hub_users"),
    createdAt: v.number(),
  })
    .index("by_slot", ["slotId"])
    .index("by_team", ["teamId"]),

  hub_scores: defineTable({
    teamId: v.id("hub_teams"),
    juryUserId: v.id("hub_users"),
    criterion1: v.number(),
    criterion2: v.number(),
    criterion3: v.number(),
    criterion4: v.number(),
    criterion5: v.number(),
    comment: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_team", ["teamId"])
    .index("by_jury_and_team", ["juryUserId", "teamId"]),
});
