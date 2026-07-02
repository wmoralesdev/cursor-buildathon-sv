import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import { isWithinEventWindow } from "../lib/eventDates";

export const syncAllLinkedRepos = internalAction({
  args: {},
  returns: v.union(
    v.object({ skipped: v.literal(true) }),
    v.object({ synced: v.number() }),
  ),
  handler: async (ctx) => {
    if (!isWithinEventWindow()) {
      return { skipped: true as const };
    }

    const teamIds: Id<"hub_teams">[] = await ctx.runQuery(
      internal.hub.repoSync.listTeamsWithRepos,
      {},
    );
    for (const hubTeamId of teamIds) {
      try {
        await ctx.runAction(internal.hub.repoSync.syncTeamRepo, {
          hubTeamId,
          isBaseline: false,
        });
      } catch {
        /* continue with remaining teams */
      }
    }

    return { synced: teamIds.length };
  },
});
