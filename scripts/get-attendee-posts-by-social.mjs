#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "info", "get-attendee-posts-by-social.md");

const inlineQuery = `
const posts = await ctx.db.query("hub_social_posts").collect();
const users = await ctx.db.query("hub_users").collect();
const userById = Object.fromEntries(users.map((u) => [u._id, u]));
return posts.map((post) => {
  const author = userById[post.userId];
  return {
    authorName: author?.name ?? "Unknown",
    platform: post.platform,
    postUrl: post.url,
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

const platformOrder = { linkedin: 0, x: 1 };

rows.sort((a, b) => {
  const platformDiff =
    (platformOrder[a.platform] ?? 99) - (platformOrder[b.platform] ?? 99);
  if (platformDiff !== 0) return platformDiff;
  return a.authorName.localeCompare(b.authorName, undefined, {
    sensitivity: "base",
  });
});

const escCell = (value) => String(value ?? "").replace(/\|/g, "\\|");

const platformLabel = (platform) => {
  if (platform === "x") return "X";
  if (platform === "linkedin") return "LinkedIn";
  return escCell(platform);
};

const lines = [
  "# Attendee social posts",
  "",
  `Generated from production on ${new Date().toISOString().slice(0, 10)}.`,
  "",
  "Sorted by social platform, then name.",
  "",
  "| Social | Name | Link |",
  "| --- | --- | --- |",
  ...rows.map((row) => {
    const label = platformLabel(row.platform);
    const name = escCell(row.authorName);
    const url = row.postUrl.replace(/\)/g, "%29");
    return `| ${label} | ${name} | [View post](${url}) |`;
  }),
  "",
];

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`Wrote ${rows.length} rows to ${outPath}`);
