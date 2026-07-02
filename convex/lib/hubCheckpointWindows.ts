import {
  commitAuthorName,
  toRecentCommits,
  type GitHubCommitListItem,
} from "../github/client";
import { EVENT_START_MS } from "./eventDates";

export type CheckpointWindow = {
  checkpointId: string;
  startMs: number;
  endMs: number;
};

export type CheckpointSummary = {
  checkpointId: string;
  commitCount: number;
  commits: { sha: string; message: string; author: string; date: string }[];
  contributors: string[];
};

/** Checkpoint end times in America/El_Salvador — keep in sync with src/data/hub-progress-steps.ts */
const HUB_CHECKPOINT_ENDS: { checkpointId: string; endIso: string }[] = [
  { checkpointId: "cp_12pm", endIso: "2026-07-04T12:00:00-06:00" },
  { checkpointId: "cp_3pm", endIso: "2026-07-04T15:00:00-06:00" },
  { checkpointId: "cp_9pm", endIso: "2026-07-04T21:00:00-06:00" },
  { checkpointId: "cp_12am", endIso: "2026-07-05T00:00:00-06:00" },
  { checkpointId: "cp_4am", endIso: "2026-07-05T04:00:00-06:00" },
  { checkpointId: "cp_6am", endIso: "2026-07-05T06:00:00-06:00" },
];

export function getCheckpointWindows(): CheckpointWindow[] {
  let startMs = EVENT_START_MS;
  return HUB_CHECKPOINT_ENDS.map(({ checkpointId, endIso }) => {
    const endMs = Date.parse(endIso);
    const window = { checkpointId, startMs, endMs };
    startMs = endMs;
    return window;
  });
}

export function summarizeCommitsByCheckpoint(
  commitsInEventWindow: GitHubCommitListItem[],
): CheckpointSummary[] {
  const windows = getCheckpointWindows();

  return windows.map(({ checkpointId, startMs, endMs }) => {
    const inWindow = commitsInEventWindow.filter((item) => {
      const commitMs = Date.parse(item.commit.author.date);
      return commitMs >= startMs && commitMs < endMs;
    });

    const contributors = [...new Set(inWindow.map(commitAuthorName))].sort();

    return {
      checkpointId,
      commitCount: inWindow.length,
      commits: toRecentCommits(inWindow, 5),
      contributors,
    };
  });
}
