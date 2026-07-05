#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "info", "get-project-rosters.csv");

const inlineQuery = `
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
    sponsorsUsed: (p.sponsorsUsed ?? []).join("; "),
    teamMembers: teamMembers
      .map((m) => \`\${m.name} <\${m.email}>\`)
      .join("; "),
    memberCount: teamMembers.length,
  };
});
`.trim();

const raw = execFileSync(
  "npx",
  ["convex", "run", "--prod", "--inline-query", inlineQuery],
  { cwd: root, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
);

const jsonStart = raw.indexOf("[");
if (jsonStart === -1) {
  throw new Error("Could not parse Convex output:\n" + raw);
}

const rows = JSON.parse(raw.slice(jsonStart));

const esc = (value) => {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const headers = [
  "team_name",
  "project_name",
  "sponsors_used",
  "member_count",
  "team_members",
];

const lines = [
  headers.join(","),
  ...rows.map((row) =>
    [
      esc(row.teamName),
      esc(row.projectName),
      esc(row.sponsorsUsed),
      esc(row.memberCount),
      esc(row.teamMembers),
    ].join(","),
  ),
];

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${rows.length} rows to ${outPath}`);
