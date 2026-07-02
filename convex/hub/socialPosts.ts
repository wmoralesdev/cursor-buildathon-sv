import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { ensureHubUser, requireHubUser, requireTeamMembership } from "../lib/hubAuth";
import { validateSocialPostUrl } from "../lib/socialPostValidation";

const postValidator = v.object({
  _id: v.id("hub_social_posts"),
  platform: v.union(v.literal("x"), v.literal("linkedin")),
  url: v.string(),
  createdAt: v.number(),
  authorName: v.string(),
});

export const listByTeam = query({
  args: {},
  returns: v.array(postValidator),
  handler: async (ctx) => {
    const user = await requireHubUser(ctx).catch(() => null);
    if (!user) return [];

    const membership = await ctx.db
      .query("hub_team_members")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!membership) return [];

    const posts = await ctx.db
      .query("hub_social_posts")
      .withIndex("by_team", (q) => q.eq("teamId", membership.teamId))
      .collect();

    return await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.userId);
        return {
          _id: post._id,
          platform: post.platform,
          url: post.url,
          createdAt: post.createdAt,
          authorName: author?.name ?? "Unknown",
        };
      }),
    );
  },
});

export const addPost = mutation({
  args: {
    platform: v.union(v.literal("x"), v.literal("linkedin")),
    url: v.string(),
  },
  returns: v.id("hub_social_posts"),
  handler: async (ctx, args) => {
    const user = await ensureHubUser(ctx);
    const { team } = await requireTeamMembership(ctx, user._id);
    const url = validateSocialPostUrl(args.platform, args.url);

    return await ctx.db.insert("hub_social_posts", {
      teamId: team._id,
      userId: user._id,
      platform: args.platform,
      url,
      createdAt: Date.now(),
    });
  },
});

export const removePost = mutation({
  args: { postId: v.id("hub_social_posts") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ensureHubUser(ctx);
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    const { team } = await requireTeamMembership(ctx, user._id);
    if (post.teamId !== team._id) {
      throw new Error("Post does not belong to your team");
    }
    if (post.userId !== user._id && team.captainId !== user._id) {
      throw new Error("Only the author or captain can remove this post");
    }

    await ctx.db.delete(args.postId);
    return null;
  },
});
