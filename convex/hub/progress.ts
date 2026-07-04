import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { HUB_CHECKPOINT_IDS, checkpointLabel } from "../lib/hub_checkpoints";
import { captureCheckpointSnapshot } from "../lib/hub_checkpoint_snapshot";
import { requireHubUser, requireTeamMembership } from "../lib/hub_auth";

const CHECKPOINT_NOTE_MAX_LENGTH = 2000;

const progressStepValidator = v.object({
  id: v.string(),
  completed: v.boolean(),
  completedAt: v.optional(v.number()),
  manual: v.boolean(),
});

const checkpointValidator = v.object({
  id: v.string(),
  label: v.string(),
  note: v.optional(v.string()),
  submittedAt: v.optional(v.number()),
});

export const HUB_PROGRESS_STEP_IDS = [
  "team_formed",
  "project_started",
  "social_posted",
  "checkpoint_midday",
  "deliverables_ready",
  "feedback_complete",
  "final_submitted",
] as const;

export { HUB_CHECKPOINT_IDS };

function emptyProgressResponse() {
  return {
    steps: HUB_PROGRESS_STEP_IDS.map((id) => ({
      id,
      completed: false,
      manual: id === "checkpoint_midday",
    })),
    checkpoints: HUB_CHECKPOINT_IDS.map((id) => ({
      id,
      label: checkpointLabel(id),
      note: undefined,
      submittedAt: undefined,
    })),
  };
}

async function deriveAutoSteps(
  ctx: QueryCtx | MutationCtx,
  teamId: Id<"hub_teams">,
) {
  const team = await ctx.db.get(teamId);
  if (!team) return {} as Record<string, boolean>;

  const members = await ctx.db
    .query("hub_team_members")
    .withIndex("by_team", (q) => q.eq("teamId", team._id))
    .collect();

  const project = await ctx.db
    .query("hub_projects")
    .withIndex("by_team", (q) => q.eq("teamId", team._id))
    .unique();

  const socialPosts = await ctx.db
    .query("hub_social_posts")
    .withIndex("by_team", (q) => q.eq("teamId", team._id))
    .collect();

  const deliverables = await ctx.db
    .query("hub_deliverables")
    .withIndex("by_team", (q) => q.eq("teamId", team._id))
    .unique();

  const checkpoints = await ctx.db
    .query("hub_checkpoints")
    .withIndex("by_team", (q) => q.eq("teamId", team._id))
    .collect();

  const hasMiddayCheckpoint = checkpoints.some(
    (cp) => cp.checkpointId === "cp_12pm" || cp.checkpointId === "cp_3pm",
  );

  const sponsorsUsed = project?.sponsorsUsed ?? [];
  let feedbackComplete = sponsorsUsed.length === 0;
  if (!feedbackComplete && members.length > 0) {
    feedbackComplete = true;
    for (const member of members) {
      for (const sponsorId of sponsorsUsed) {
        const entry = await ctx.db
          .query("hub_sponsor_feedback")
          .withIndex("by_user_team_sponsor", (q) =>
            q
              .eq("userId", member.userId)
              .eq("teamId", team._id)
              .eq("sponsorId", sponsorId),
          )
          .unique();
        if (!entry?.feedback.trim()) {
          feedbackComplete = false;
          break;
        }
      }
      if (!feedbackComplete) break;
    }
  }

  const deliverablesReady = Boolean(
    deliverables?.slidesUrl &&
      (deliverables.videoR2Key || deliverables.videoUrl),
  );

  return {
    team_formed: members.length >= 2,
    project_started: Boolean(project?.name?.trim()),
    social_posted: socialPosts.length > 0,
    checkpoint_midday: hasMiddayCheckpoint,
    deliverables_ready: deliverablesReady,
    feedback_complete: feedbackComplete,
    final_submitted: Boolean(deliverables?.submittedAt),
  } satisfies Record<string, boolean>;
}

export const getProgress = query({
  args: {},
  returns: v.object({
    steps: v.array(progressStepValidator),
    checkpoints: v.array(checkpointValidator),
  }),
  handler: async (ctx) => {
    const user = await requireHubUser(ctx).catch(() => null);
    if (!user) {
      return emptyProgressResponse();
    }

    const membership = await ctx.db
      .query("hub_team_members")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!membership) {
      return emptyProgressResponse();
    }

    const team = await ctx.db.get(membership.teamId);
    if (!team) {
      return { steps: [], checkpoints: [] };
    }

    const manualProgress = await ctx.db
      .query("hub_progress")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .collect();

    const autoSteps = await deriveAutoSteps(ctx, team._id);

    const checkpointRows = await ctx.db
      .query("hub_checkpoints")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .collect();

    return {
      steps: HUB_PROGRESS_STEP_IDS.map((id) => {
        const manual = id === "checkpoint_midday";
        const manualRow = manualProgress.find((row) => row.stepId === id);
        const completed = manual
          ? Boolean(manualRow)
          : Boolean(autoSteps[id as keyof typeof autoSteps]);
        return {
          id,
          completed,
          completedAt: manualRow?.completedAt,
          manual,
        };
      }),
      checkpoints: HUB_CHECKPOINT_IDS.map((id) => {
        const row = checkpointRows.find((cp) => cp.checkpointId === id);
        return {
          id,
          label: checkpointLabel(id),
          note: row?.note,
          submittedAt: row?.submittedAt,
        };
      }),
    };
  },
});

export const toggleStep = mutation({
  args: { stepId: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireHubUser(ctx);
    const { team } = await requireTeamMembership(ctx, user._id);

    if (args.stepId !== "checkpoint_midday") {
      throw new Error("Only manual steps can be toggled");
    }

    const existing = await ctx.db
      .query("hub_progress")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .collect();

    const row = existing.find((entry) => entry.stepId === args.stepId);
    if (row) {
      await ctx.db.delete(row._id);
      return null;
    }

    await ctx.db.insert("hub_progress", {
      teamId: team._id,
      stepId: args.stepId,
      completedAt: Date.now(),
      completedBy: user._id,
    });
    return null;
  },
});

export const submitCheckpoint = mutation({
  args: {
    checkpointId: v.string(),
    note: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireHubUser(ctx);
    const { team } = await requireTeamMembership(ctx, user._id);

    if (!HUB_CHECKPOINT_IDS.includes(args.checkpointId as (typeof HUB_CHECKPOINT_IDS)[number])) {
      throw new Error("Invalid checkpoint");
    }

    const note = args.note.trim();
    if (note.length < 3) {
      throw new Error("Checkpoint note must be at least 3 characters");
    }
    if (note.length > CHECKPOINT_NOTE_MAX_LENGTH) {
      throw new Error(`Checkpoint note must be at most ${CHECKPOINT_NOTE_MAX_LENGTH} characters`);
    }

    const snapshot = await captureCheckpointSnapshot(ctx, team._id);

    const existing = await ctx.db
      .query("hub_checkpoints")
      .withIndex("by_team_and_checkpoint", (q) =>
        q.eq("teamId", team._id).eq("checkpointId", args.checkpointId),
      )
      .unique();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        note,
        submittedAt: now,
        submittedBy: user._id,
        snapshot,
      });
      return null;
    }

    await ctx.db.insert("hub_checkpoints", {
      teamId: team._id,
      checkpointId: args.checkpointId,
      note,
      submittedAt: now,
      submittedBy: user._id,
      snapshot,
    });
    return null;
  },
});
