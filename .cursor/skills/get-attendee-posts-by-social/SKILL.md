---
name: get-attendee-posts-by-social
description: >-
  Export attendee social posts from production Convex to a Markdown table at
  info/get-attendee-posts-by-social.md, sorted by social platform then author
  name, with clickable X/LinkedIn links. Use when the user asks for attendee
  posts grouped or sorted by social network.
---

# Get Attendee Posts by Social

Export all social posts made by attendees from **production only** as a Markdown table with clickable links.

## Output

- Markdown: `info/get-attendee-posts-by-social.md`
- Script: `node scripts/get-attendee-posts-by-social.mjs`

Table columns: **Social** (`LinkedIn` or `X`), **Name**, **Link** (`[View post](url)`)

Sorted by social platform, then author name (A–Z).

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
    const users = await ctx.db.query("hub_users").collect();
    const userById = Object.fromEntries(users.map((u) => [u._id, u]));

    return posts.map((post) => ({
      authorName: userById[post.userId]?.name ?? "Unknown",
      platform: post.platform,
      postUrl: post.url,
    }));
  },
});
```

Sort client-side: LinkedIn first, then X, then name A–Z within each platform.

Render as Markdown:

```markdown
| Social | Name | Link |
| --- | --- | --- |
| LinkedIn | author | [View post](https://...) |
| X | author | [View post](https://...) |
```

## CLI fallback

```bash
node scripts/get-attendee-posts-by-social.mjs
```

## Data source

| Field | Table | Column / join |
|-------|-------|---------------|
| Post URL | `hub_social_posts` | `url` |
| Platform | `hub_social_posts` | `platform` |
| Author name | `hub_users` | join via `hub_social_posts.userId` |

For CSV with team/project/email columns, use `get-attendee-posts` instead.

## Checklist

- [ ] Prod only (`--prod` or prod deployment selector)
- [ ] Joined `hub_users` for author names
- [ ] Sorted by social, then name
- [ ] Wrote `info/get-attendee-posts-by-social.md` with clickable links
- [ ] Reported row count to the user
