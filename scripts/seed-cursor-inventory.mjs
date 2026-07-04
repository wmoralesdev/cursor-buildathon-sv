#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { createInterface } from "node:readline";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const csvPath = join(repoRoot, "seed", "cursor.csv");

function parseArgs(argv) {
  let prod = false;
  let yes = false;
  let batchId;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--prod") {
      prod = true;
    } else if (arg === "--yes") {
      yes = true;
    } else if (arg === "--batch-id") {
      batchId = argv[i + 1];
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${arg}`);
      printHelp();
      process.exit(1);
    }
  }

  if (!batchId) {
    const today = new Date().toISOString().slice(0, 10);
    batchId = `cursor-${today}`;
  }

  return { prod, yes, batchId };
}

function printHelp() {
  console.log(`Usage: node scripts/seed-cursor-inventory.mjs [options]

Options:
  --prod           Target production Convex deployment
  --yes            Skip production confirmation prompt
  --batch-id <id>  Batch label for inventory rows (default: cursor-YYYY-MM-DD)
  -h, --help       Show this help

Environment:
  SEED_LUMA_CONFIRM_PROD=1   Skip production confirmation prompt
`);
}

function parseCursorCsv(path) {
  const lines = readFileSync(path, "utf-8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const urls = [];
  for (const line of lines) {
    if (line.toLowerCase() === "url") {
      continue;
    }
    if (!line.startsWith("http")) {
      continue;
    }
    urls.push(line);
  }

  return urls.map((secret) => ({
    sponsorId: "cursor",
    kind: "link",
    variant: "default",
    secret,
  }));
}

async function confirmProd() {
  if (process.env.SEED_LUMA_CONFIRM_PROD === "1") {
    return true;
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await new Promise((resolve) => {
    rl.question("Seed production Convex deployment? [y/N] ", resolve);
  });
  rl.close();

  return answer.trim().toLowerCase() === "y";
}

function runConvex(functionName, args, prod) {
  const convexArgs = ["convex", "run", functionName, JSON.stringify(args)];
  if (prod) {
    convexArgs.push("--prod");
  }

  const result = spawnSync("npx", convexArgs, {
    cwd: repoRoot,
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.status !== 0) {
    if (result.stdout) {
      process.stdout.write(result.stdout);
    }
    if (result.stderr) {
      process.stderr.write(result.stderr);
    }
    throw new Error(`convex run ${functionName} failed with exit code ${result.status ?? "unknown"}`);
  }

  const stdout = result.stdout.trim();
  if (!stdout) {
    return null;
  }

  try {
    return JSON.parse(stdout);
  } catch {
    console.log(stdout);
    return null;
  }
}

async function main() {
  const { prod, yes, batchId } = parseArgs(process.argv.slice(2));

  if (!existsSync(csvPath)) {
    console.error(`Missing CSV: ${csvPath}`);
    console.error("Add Cursor referral URLs to seed/cursor.csv first.");
    process.exit(1);
  }

  if (prod && !yes) {
    const confirmed = await confirmProd();
    if (!confirmed) {
      console.log("Aborted.");
      process.exit(0);
    }
  }

  const rows = parseCursorCsv(csvPath);
  const target = prod ? "production" : "development";

  console.log(`Target: ${target}`);
  console.log(`CSV: ${csvPath} (${rows.length} links)`);
  console.log(`Batch: ${batchId}`);

  const seedResult = runConvex(
    "hub/perks:seedPerkInventory",
    { batchId, rows },
    prod,
  );

  console.log("Cursor inventory seed result:");
  console.log(seedResult);

  const backfillResult = runConvex("hub/perks:backfillPerkClaims", {}, prod);

  console.log("Perk backfill result:");
  console.log(backfillResult);

  console.log("Done.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
