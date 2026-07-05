---
name: get-attendee-posts
description: >-
  Export all social posts submitted by attendees from production Convex to
  info/get-attendee-posts.csv. Use when the user asks for attendee posts,
  social posts, X/LinkedIn submissions, or builder perk posts from prod.
---

# Get Attendee Posts

Export all social posts made by attendees from **production only**.

## Output

- CSV: `info/get-attendee-posts.csv`
- Script: `node scripts/get-attendee-posts.mjs`

Columns: `team_name`, `project_name`, `author_name`, `author_email`, `platform`, `post_url`, `created_at`

Sorted newest first.

## Prod deployment

1. Call `status` with `projectDir` set to the repo root.
2. Use the deployment where `"kind": "prod"` (`original-badger-286`).
3. Never use dev unless the user explicitly asks.

## MCP (preferred)

Production reads require:

```bash
npx convex mcp start --cautiously-allow-production-pii
```

Then `runOneoffQuery` on the prod `deploymentSelector`:

```js
import { query } from "convex:/_system/repl/wrappers.js";

export default query({
  handler: async (ctx) => {
    const posts = await ctx.db.query("hub_social_posts").collect();
    const teams = await ctx.db.query("hub_teams").collect();
    const users = await ctx.db.query("hub_users").collect();
    const projects = await ctx.db.query("hub_projects").collect();

    const teamById = Object.fromEntries(teams.map((t) => [t._id, t]));
    const userById = Object.fromEntries(users.map((u) => [u._id, u]));
    const projectByTeam = Object.fromEntries(projects.map((p) => [p.teamId, p]));

    return posts
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((post) => {
        const author = userById[post.userId];
        const team = teamById[post.teamId];
        const project = projectByTeam[post.teamId];
        return {
          teamName: team?.name ?? "Unknown",
          projectName: project?.name ?? "",
          authorName: author?.name ?? "Unknown",
          authorEmail: author?.email ?? "",
          platform: post.platform,
          postUrl: post.url,
          createdAt: post.createdAt,
        };
      });
  },
});
```

Write results to `info/get-attendee-posts.csv` with proper CSV escaping.

## CLI fallback

```bash
node scripts/get-attendee-posts.mjs
```

## Data source

| Field | Table | Column / join |
|-------|-------|---------------|
| Post URL | `hub_social_posts` | `url` |
| Platform | `hub_social_posts` | `platform` (`x` or `linkedin`) |
| Created at | `hub_social_posts` | `createdAt` |
| Author | `hub_users` | join via `hub_social_posts.userId` |
| Team name | `hub_teams` | join via `hub_social_posts.teamId` |
| Project name | `hub_projects` | join via `teamId` |

Legacy `social_posts` is empty in prod; use `hub_social_posts`.

## Checklist

- [ ] Prod only (`--prod` or prod deployment selector)
- [ ] Joined `hub_teams`, `hub_users`, and `hub_projects`
- [ ] Wrote `info/get-attendee-posts.csv`
- [ ] Reported row count to the user
