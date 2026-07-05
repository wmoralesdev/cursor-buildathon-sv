#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "info", "get-repo-urls.csv");

const inlineQuery = `
const projects = await ctx.db.query("hub_projects").collect();
const teams = await ctx.db.query("hub_teams").collect();
const teamById = Object.fromEntries(teams.map((t) => [t._id, t]));
const resolveRepoUrls = (project) => {
  if (project.repoUrls && project.repoUrls.length > 0) return project.repoUrls;
  const legacy = (project.repoUrl ?? "").trim();
  return legacy ? [legacy] : [];
};
return projects.map((p) => ({
  teamName: teamById[p.teamId]?.name ?? "Unknown",
  projectName: p.name,
  description: p.description,
  repoUrls: resolveRepoUrls(p),
  projectUrl: p.url,
  track: teamById[p.teamId]?.track ?? "",
  sponsorsUsed: (p.sponsorsUsed ?? []).join("; "),
}));
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
  "github_url",
  "project_url",
  "track",
  "sponsors_used",
  "description",
];

const lines = [
  headers.join(","),
  ...rows.map((row) =>
    [
      esc(row.teamName),
      esc(row.projectName),
      esc((row.repoUrls ?? []).join("; ")),
      esc(row.projectUrl),
      esc(row.track),
      esc(row.sponsorsUsed),
      esc(row.description),
    ].join(","),
  ),
];

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${rows.length} rows to ${outPath}`);
