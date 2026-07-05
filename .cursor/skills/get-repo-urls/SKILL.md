---
name: get-repo-urls
description: >-
  Export all GitHub repo URLs from production Convex (hub_projects + hub_teams)
  to info/get-repo-urls.csv. Use when the user asks for repo URLs, GitHub links,
  or team/project repo exports from prod.
---

# Get Repo URLs

Export team names and project repo URLs from **production only**.

## Output

- CSV: `info/get-repo-urls.csv`
- Script: `node scripts/get-repo-urls.mjs`

Columns: `team_name`, `project_name`, `github_url`, `project_url`, `track`, `sponsors_used`, `description`

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
    const projects = await ctx.db.query("hub_projects").collect();
    const teams = await ctx.db.query("hub_teams").collect();
    const teamById = Object.fromEntries(teams.map((t) => [t._id, t]));

    return projects.map((p) => ({
      teamName: teamById[p.teamId]?.name ?? "Unknown",
      projectName: p.name,
      description: p.description,
      repoUrl: p.repoUrl,
      projectUrl: p.url,
      track: teamById[p.teamId]?.track ?? null,
      sponsorsUsed: p.sponsorsUsed ?? [],
    }));
  },
});
```

Write results to `info/get-repo-urls.csv` with proper CSV escaping.

## CLI fallback

```bash
node scripts/get-repo-urls.mjs
```

## Data source

| Field | Table | Column |
|-------|-------|--------|
| Team name | `hub_teams` | `name` |
| Repo URL | `hub_projects` | `repoUrl` |
| Project info | `hub_projects` | `name`, `description`, `url`, `sponsorsUsed` |

Join via `hub_projects.teamId` → `hub_teams._id`.

## Checklist

- [ ] Prod only (`--prod` or prod deployment selector)
- [ ] Joined `hub_teams` for team names
- [ ] Wrote `info/get-repo-urls.csv`
- [ ] Reported row count to the user
