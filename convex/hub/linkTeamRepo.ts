import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import { parseGitHubRepoUrl } from "../github/parseRepoUrl";
import { canLinkOrChangeRepo } from "../lib/eventDates";

export function canonicalTeamRepoUrl(
  team: Pick<Doc<"hub_teams">, "repoOwner" | "repoName">,
): string | null {
  if (!team.repoOwner || !team.repoName) return null;
  return `https://github.com/${team.repoOwner}/${team.repoName}`;
}

type LinkRepoResult = {
  canonicalUrl: string;
  shouldSync: boolean;
  isBaseline: boolean;
};

export async function prepareTeamRepoLink(
  ctx: MutationCtx,
  args: {
    team: Doc<"hub_teams">;
    captainId: Id<"hub_users">;
    actorId: Id<"hub_users">;
    repoUrlInput: string;
    currentProjectRepoUrl?: string | null;
    blockChangesAfterFinalSubmit?: boolean;
  },
): Promise<LinkRepoResult> {
  const parsed = parseGitHubRepoUrl(args.repoUrlInput);
  const now = Date.now();

  const hasExistingRepo = Boolean(args.team.repoOwner && args.team.repoName);
  const isChangingRepo =
    hasExistingRepo &&
    (args.team.repoOwner !== parsed.owner || args.team.repoName !== parsed.repo);

  if (isChangingRepo) {
    if (args.actorId !== args.captainId) {
      throw new Error("Only the team captain can change the repository URL");
    }
    if (args.blockChangesAfterFinalSubmit) {
      throw new Error("Cannot change repository after final submission");
    }
    if (!canLinkOrChangeRepo()) {
      throw new Error("The repository linking window has closed");
    }
  } else if (!hasExistingRepo && args.actorId !== args.captainId) {
    throw new Error("Only the team captain can link the repository");
  }

  const isNewRepo = !hasExistingRepo;
  const shouldSync = isNewRepo || isChangingRepo;

  if (shouldSync) {
    const historyEntry =
      isChangingRepo && args.currentProjectRepoUrl && args.team.repoOwner && args.team.repoName
        ? {
            url: args.currentProjectRepoUrl,
            owner: args.team.repoOwner,
            repo: args.team.repoName,
            changedAt: now,
          }
        : null;

    await ctx.db.patch(args.team._id, {
      repoOwner: parsed.owner,
      repoName: parsed.repo,
      repoLinkedAt: args.team.repoLinkedAt ?? now,
      repoComplianceStatus: "unknown",
      repoComplianceFlags: [],
      ...(isChangingRepo
        ? {
            repoUrlChangeCount: (args.team.repoUrlChangeCount ?? 0) + 1,
            repoUrlHistory: [...(args.team.repoUrlHistory ?? []), historyEntry!],
            repoBaselineFirstCommitAt: undefined,
            repoBaselineCommitCountBeforeEvent: undefined,
          }
        : {}),
    });
  }

  return {
    canonicalUrl: parsed.canonicalUrl,
    shouldSync,
    isBaseline: shouldSync,
  };
}

export async function scheduleTeamRepoSync(
  ctx: MutationCtx,
  teamId: Id<"hub_teams">,
  isBaseline: boolean,
) {
  await ctx.scheduler.runAfter(0, internal.hub.repoSync.syncTeamRepo, {
    hubTeamId: teamId,
    isBaseline,
  });
}
