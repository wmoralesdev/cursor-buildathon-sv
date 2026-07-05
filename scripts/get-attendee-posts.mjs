#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "info", "get-attendee-posts.csv");

const inlineQuery = `
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
      createdAt: new Date(post.createdAt).toISOString(),
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
  "author_name",
  "author_email",
  "platform",
  "post_url",
  "created_at",
];

const lines = [
  headers.join(","),
  ...rows.map((row) =>
    [
      esc(row.teamName),
      esc(row.projectName),
      esc(row.authorName),
      esc(row.authorEmail),
      esc(row.platform),
      esc(row.postUrl),
      esc(row.createdAt),
    ].join(","),
  ),
];

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${rows.length} rows to ${outPath}`);
