import type { Id } from "../_generated/dataModel";
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { requireHubUser, requireTeamMembership } from "../lib/hub_auth";
import { validateSocialPostUrl } from "../lib/social_post_url";

const postValidator = v.object({
  _id: v.id("hub_social_posts"),
  platform: v.union(v.literal("x"), v.literal("linkedin")),
  url: v.string(),
  createdAt: v.number(),
  authorName: v.string(),
  userId: v.id("hub_users"),
});

const postInputValidator = v.object({
  postId: v.optional(v.id("hub_social_posts")),
  url: v.string(),
});

function canModifyPost(
  post: { userId: Id<"hub_users"> },
  userId: Id<"hub_users">,
  captainId: Id<"hub_users">,
): boolean {
  return post.userId === userId || captainId === userId;
}

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
          userId: post.userId,
        };
      }),
    );
  },
});

export const syncPosts = mutation({
  args: {
    posts: v.array(postInputValidator),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireHubUser(ctx);
    const { team } = await requireTeamMembership(ctx, user._id);

    const existingPosts = await ctx.db
      .query("hub_social_posts")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .collect();

    const existingById = new Map(existingPosts.map((post) => [post._id, post]));
    const submittedIds = new Set<Id<"hub_social_posts">>();

    for (const item of args.posts) {
      const trimmed = item.url.trim();
      if (!trimmed) continue;

      const { platform, url } = validateSocialPostUrl(trimmed);

      if (item.postId) {
        submittedIds.add(item.postId);
        const existing = existingById.get(item.postId);
        if (!existing) {
          throw new Error("Post not found");
        }
        if (existing.teamId !== team._id) {
          throw new Error("Post does not belong to your team");
        }
        if (existing.url === url && existing.platform === platform) {
          continue;
        }
        if (!canModifyPost(existing, user._id, team.captainId)) {
          throw new Error("Only the author or captain can edit another member's post");
        }
        await ctx.db.patch(item.postId, { url, platform });
        continue;
      }

      await ctx.db.insert("hub_social_posts", {
        teamId: team._id,
        userId: user._id,
        platform,
        url,
        createdAt: Date.now(),
      });
    }

    for (const post of existingPosts) {
      if (submittedIds.has(post._id)) continue;
      if (!canModifyPost(post, user._id, team.captainId)) {
        throw new Error("Only the author or captain can remove another member's post");
      }
      await ctx.db.delete(post._id);
    }

    return null;
  },
});

export const addPost = mutation({
  args: {
    url: v.string(),
  },
  returns: v.id("hub_social_posts"),
  handler: async (ctx, args) => {
    const user = await requireHubUser(ctx);
    const { team } = await requireTeamMembership(ctx, user._id);
    const { platform, url } = validateSocialPostUrl(args.url);

    return await ctx.db.insert("hub_social_posts", {
      teamId: team._id,
      userId: user._id,
      platform,
      url,
      createdAt: Date.now(),
    });
  },
});

export const removePost = mutation({
  args: { postId: v.id("hub_social_posts") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireHubUser(ctx);
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    const { team } = await requireTeamMembership(ctx, user._id);
    if (post.teamId !== team._id) {
      throw new Error("Post does not belong to your team");
    }
    if (!canModifyPost(post, user._id, team.captainId)) {
      throw new Error("Only the author or captain can remove this post");
    }

    await ctx.db.delete(args.postId);
    return null;
  },
});
