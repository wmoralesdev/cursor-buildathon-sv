import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { v } from "convex/values";
import { hubSponsorIdValidator, type HubSponsorId } from "./hubSponsorIds";
import { resolveProjectRepoUrls } from "./hub_project_repo_urls";

export const hubCheckpointSnapshotValidator = v.object({
  projectName: v.string(),
  projectDescription: v.string(),
  /** @deprecated Migrated to repoUrls — kept for older checkpoint snapshots. */
  repoUrl: v.optional(v.string()),
  repoUrls: v.optional(v.array(v.string())),
  projectUrl: v.string(),
  sponsorsUsed: v.array(hubSponsorIdValidator),
  socialPostCount: v.number(),
  deliverablesSubmitted: v.boolean(),
});

export type HubCheckpointSnapshot = {
  projectName: string;
  projectDescription: string;
  repoUrls: string[];
  projectUrl: string;
  sponsorsUsed: HubSponsorId[];
  socialPostCount: number;
  deliverablesSubmitted: boolean;
};

export function resolveCheckpointRepoUrls(
  snapshot: Pick<HubCheckpointSnapshot, "repoUrls"> & { repoUrl?: string },
): string[] {
  if (snapshot.repoUrls && snapshot.repoUrls.length > 0) {
    return snapshot.repoUrls;
  }

  const legacy = snapshot.repoUrl?.trim();
  return legacy ? [legacy] : [];
}

export async function captureCheckpointSnapshot(
  ctx: QueryCtx | MutationCtx,
  teamId: Id<"hub_teams">,
): Promise<HubCheckpointSnapshot> {
  const project = await ctx.db
    .query("hub_projects")
    .withIndex("by_team", (q) => q.eq("teamId", teamId))
    .unique();
  const deliverables = await ctx.db
    .query("hub_deliverables")
    .withIndex("by_team", (q) => q.eq("teamId", teamId))
    .unique();
  const socialPosts = await ctx.db
    .query("hub_social_posts")
    .withIndex("by_team", (q) => q.eq("teamId", teamId))
    .collect();

  return {
    projectName: project?.name ?? "",
    projectDescription: project?.description ?? "",
    repoUrls: resolveProjectRepoUrls(project ?? { repoUrl: undefined, repoUrls: [] }),
    projectUrl: project?.url ?? "",
    sponsorsUsed: project?.sponsorsUsed ?? [],
    socialPostCount: socialPosts.length,
    deliverablesSubmitted: Boolean(deliverables?.submittedAt),
  };
}
