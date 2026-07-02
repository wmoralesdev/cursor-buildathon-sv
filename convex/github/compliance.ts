import {
  EVENT_START_MS,
  NO_COMMITS_GRACE_HOURS,
} from "../lib/eventDates";

export type ComplianceStatus = "ok" | "review" | "violation" | "unknown";

export type ComplianceInput = {
  repoCreatedAt: string;
  firstCommitAt: string | null;
  commitCountBeforeEvent: number;
  commitCountInEventWindow: number;
  isFork: boolean;
  largeInitialCommit: boolean;
  baselineFirstCommitAt?: string | null;
  baselineCommitCountBeforeEvent?: number | null;
  now?: number;
};

const REVIEW_FLAGS = new Set([
  "repo_created_before_event",
  "fork",
  "large_initial_commit",
  "no_commits_in_window",
  "force_push_detected",
]);

const VIOLATION_FLAGS = new Set(["pre_event_commits"]);

export function evaluateCompliance(input: ComplianceInput): {
  flags: string[];
  status: ComplianceStatus;
} {
  const flags: string[] = [];
  const now = input.now ?? Date.now();
  const eventStartIso = new Date(EVENT_START_MS).toISOString();

  if (Date.parse(input.repoCreatedAt) < EVENT_START_MS) {
    flags.push("repo_created_before_event");
  }

  if (input.commitCountBeforeEvent > 0) {
    flags.push("pre_event_commits");
  }

  if (input.isFork) {
    flags.push("fork");
  }

  if (input.largeInitialCommit) {
    flags.push("large_initial_commit");
  }

  const graceMs = NO_COMMITS_GRACE_HOURS * 60 * 60 * 1000;
  if (
    now >= EVENT_START_MS + graceMs &&
    input.commitCountInEventWindow === 0 &&
    now < Date.parse(eventStartIso) + 48 * 60 * 60 * 1000
  ) {
    flags.push("no_commits_in_window");
  }

  if (
    input.baselineFirstCommitAt &&
    input.firstCommitAt &&
    input.baselineFirstCommitAt !== input.firstCommitAt
  ) {
    flags.push("force_push_detected");
  }

  if (
    input.baselineCommitCountBeforeEvent != null &&
    input.commitCountBeforeEvent < input.baselineCommitCountBeforeEvent
  ) {
    flags.push("force_push_detected");
  }

  let status: ComplianceStatus = "ok";
  if (flags.some((flag) => VIOLATION_FLAGS.has(flag))) {
    status = "violation";
  } else if (flags.some((flag) => REVIEW_FLAGS.has(flag))) {
    status = "review";
  }

  return { flags, status };
}
