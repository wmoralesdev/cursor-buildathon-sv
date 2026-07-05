---
name: get-project-rosters
description: >-
  Export project names, sponsors used, and team members from production Convex
  to info/get-project-rosters.csv. Use when the user asks for project rosters,
  sponsor usage by team, or team member lists from prod.
---

# Get Project Rosters

Export project names, sponsors, and team members from **production only**.

## Output

- CSV: `info/get-project-rosters.csv`
- Script: `node scripts/get-project-rosters.mjs`

Columns: `team_name`, `project_name`, `sponsors_used`, `member_count`, `team_members`

`team_members` is formatted as `Name <email>; Name <email>`.

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
    const memberships = await ctx.db.query("hub_team_members").collect();
    const users = await ctx.db.query("hub_users").collect();

    const teamById = Object.fromEntries(teams.map((t) => [t._id, t]));
    const userById = Object.fromEntries(users.map((u) => [u._id, u]));
    const membersByTeam = new Map();

    for (const membership of memberships) {
      const user = userById[membership.userId];
      if (!user) continue;
      const list = membersByTeam.get(membership.teamId) ?? [];
      list.push({ name: user.name, email: user.email });
      membersByTeam.set(membership.teamId, list);
    }

    return projects.map((p) => {
      const team = teamById[p.teamId];
      const teamMembers = membersByTeam.get(p.teamId) ?? [];
      return {
        teamName: team?.name ?? "Unknown",
        projectName: p.name,
        sponsorsUsed: p.sponsorsUsed ?? [],
        teamMembers,
      };
    });
  },
});
```

Write results to `info/get-project-rosters.csv` with proper CSV escaping.

## CLI fallback

```bash
node scripts/get-project-rosters.mjs
```

## Data source

| Field | Table | Column / join |
|-------|-------|---------------|
| Team name | `hub_teams` | `name` |
| Project name | `hub_projects` | `name` |
| Sponsors used | `hub_projects` | `sponsorsUsed` |
| Team members | `hub_team_members` | join `hub_users` via `userId` for `name`, `email` |

Join path: `hub_projects.teamId` → `hub_teams._id` and `hub_team_members.teamId`.

## Checklist

- [ ] Prod only (`--prod` or prod deployment selector)
- [ ] Joined `hub_teams`, `hub_team_members`, and `hub_users`
- [ ] Wrote `info/get-project-rosters.csv`
- [ ] Reported row count to the user
