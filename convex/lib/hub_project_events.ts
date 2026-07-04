import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { v } from "convex/values";
import type { HubSponsorId } from "./hubSponsorIds";

export const hubProjectEventKindValidator = v.union(
  v.literal("project_created"),
  v.literal("title_changed"),
  v.literal("description_changed"),
  v.literal("url_changed"),
  v.literal("repo_changed"),
  v.literal("sponsor_added"),
  v.literal("sponsor_removed"),
  v.literal("deliverables_saved"),
  v.literal("sponsor_feedback_submitted"),
  v.literal("final_submitted"),
);

export type HubProjectEventKind = Doc<"hub_project_events">["kind"];

export type ProjectSnapshot = {
  name: string;
  description: string;
  url: string;
  repoUrl: string;
  sponsorsUsed: HubSponsorId[];
};

export function isProjectDetailsComplete(project: ProjectSnapshot): boolean {
  return (
    project.name.trim() !== "" &&
    project.description.trim() !== "" &&
    project.url.trim() !== "" &&
    project.repoUrl.trim() !== ""
  );
}

export function getMissingProjectDetails(project: ProjectSnapshot): string[] {
  const missing: string[] = [];
  if (!project.name.trim()) missing.push("name");
  if (!project.description.trim()) missing.push("description");
  if (!project.url.trim()) missing.push("url");
  if (!project.repoUrl.trim()) missing.push("repoUrl");
  return missing;
}

export async function logProjectEvent(
  ctx: MutationCtx,
  args: {
    teamId: Id<"hub_teams">;
    actorId: Id<"hub_users">;
    kind: HubProjectEventKind;
    meta?: {
      from?: string;
      to?: string;
      sponsorId?: HubSponsorId;
    };
  },
): Promise<void> {
  await ctx.db.insert("hub_project_events", {
    teamId: args.teamId,
    actorId: args.actorId,
    kind: args.kind,
    meta: args.meta,
    createdAt: Date.now(),
  });
}

export async function diffAndLogProjectChanges(
  ctx: MutationCtx,
  existing: Doc<"hub_projects"> | null,
  next: ProjectSnapshot,
  actorId: Id<"hub_users">,
  teamId: Id<"hub_teams">,
): Promise<void> {
  if (!existing) {
    await logProjectEvent(ctx, {
      teamId,
      actorId,
      kind: "project_created",
      meta: { to: next.name },
    });
    return;
  }

  if (existing.name !== next.name) {
    await logProjectEvent(ctx, {
      teamId,
      actorId,
      kind: "title_changed",
      meta: { from: existing.name, to: next.name },
    });
  }

  if (existing.description !== next.description) {
    await logProjectEvent(ctx, {
      teamId,
      actorId,
      kind: "description_changed",
      meta: { from: existing.description, to: next.description },
    });
  }

  if (existing.url !== next.url) {
    await logProjectEvent(ctx, {
      teamId,
      actorId,
      kind: "url_changed",
      meta: { from: existing.url, to: next.url },
    });
  }

  if (existing.repoUrl !== next.repoUrl) {
    await logProjectEvent(ctx, {
      teamId,
      actorId,
      kind: "repo_changed",
      meta: { from: existing.repoUrl, to: next.repoUrl },
    });
  }

  const prevSponsors = new Set(existing.sponsorsUsed);
  const nextSponsors = new Set(next.sponsorsUsed);

  for (const sponsorId of nextSponsors) {
    if (!prevSponsors.has(sponsorId)) {
      await logProjectEvent(ctx, {
        teamId,
        actorId,
        kind: "sponsor_added",
        meta: { sponsorId },
      });
    }
  }

  for (const sponsorId of prevSponsors) {
    if (!nextSponsors.has(sponsorId)) {
      await logProjectEvent(ctx, {
        teamId,
        actorId,
        kind: "sponsor_removed",
        meta: { sponsorId },
      });
    }
  }
}

export async function isTeamFeedbackComplete(
  ctx: QueryCtx | MutationCtx,
  teamId: Id<"hub_teams">,
  sponsorsUsed: HubSponsorId[],
): Promise<boolean> {
  if (sponsorsUsed.length === 0) {
    return true;
  }

  const members = await ctx.db
    .query("hub_team_members")
    .withIndex("by_team", (q) => q.eq("teamId", teamId))
    .collect();

  for (const member of members) {
    for (const sponsorId of sponsorsUsed) {
      const entry = await ctx.db
        .query("hub_sponsor_feedback")
        .withIndex("by_user_team_sponsor", (q) =>
          q
            .eq("userId", member.userId)
            .eq("teamId", teamId)
            .eq("sponsorId", sponsorId),
        )
        .unique();
      if (!entry?.feedback.trim()) {
        return false;
      }
    }
  }

  return true;
}

export async function assertReadyForFinalSubmit(
  ctx: MutationCtx,
  teamId: Id<"hub_teams">,
  project: Doc<"hub_projects">,
  deliverables: {
    slidesUrl?: string;
    videoR2Key?: string;
    videoUrl?: string;
  },
): Promise<void> {
  const snapshot: ProjectSnapshot = {
    name: project.name,
    description: project.description,
    url: project.url,
    repoUrl: project.repoUrl,
    sponsorsUsed: project.sponsorsUsed,
  };

  if (!isProjectDetailsComplete(snapshot)) {
    const missing = getMissingProjectDetails(snapshot);
    if (missing.includes("description")) {
      throw new Error("Complete project description before submitting");
    }
    if (missing.includes("url")) {
      throw new Error("Add a live project URL before submitting");
    }
    if (missing.includes("repoUrl")) {
      throw new Error("Add a repository URL before submitting");
    }
    throw new Error("Complete all project details before submitting");
  }

  if (!deliverables.slidesUrl) {
    throw new Error("Slides URL is required to submit");
  }
  if (!deliverables.videoR2Key && !deliverables.videoUrl) {
    throw new Error("Video showcase is required to submit");
  }

  const feedbackComplete = await isTeamFeedbackComplete(
    ctx,
    teamId,
    project.sponsorsUsed,
  );
  if (!feedbackComplete) {
    throw new Error("All team members must submit sponsor feedback before final submission");
  }
}
