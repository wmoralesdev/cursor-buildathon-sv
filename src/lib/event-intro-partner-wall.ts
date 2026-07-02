import { WELCOME_CARD_SPONSOR_MARK_KEYS } from "../components/welcome-sponsor-marks";
import {
  buildWelcomePostSponsorRowIndices,
  buildWelcomeStorySponsorDisplayIndices,
} from "./welcome-post-sponsor-wall";

const GAMESQUAD_INDEX = WELCOME_CARD_SPONSOR_MARK_KEYS.indexOf("gamesquad");

function sponsorIndex(key: (typeof WELCOME_CARD_SPONSOR_MARK_KEYS)[number]): number {
  const index = WELCOME_CARD_SPONSOR_MARK_KEYS.indexOf(key);
  if (index < 0) {
    throw new Error(`event-intro-partner-wall: missing sponsor key "${key}"`);
  }
  return index;
}

/** Event-intro post: featured pairs on rows 1–2, then standard 4-up rows. */
function buildEventIntroPostRowIndices(markCount: number): number[][] {
  if (markCount !== WELCOME_CARD_SPONSOR_MARK_KEYS.length) {
    return buildWelcomePostSponsorRowIndices(markCount);
  }

  return [
    [sponsorIndex("codex"), sponsorIndex("elevenlabs")],
    [sponsorIndex("n8n"), sponsorIndex("zavu")],
    [
      sponsorIndex("simov"),
      sponsorIndex("abaco"),
      sponsorIndex("021"),
      sponsorIndex("yonjob"),
    ],
    [
      sponsorIndex("nubiwork"),
      sponsorIndex("kreali"),
      sponsorIndex("weris"),
      sponsorIndex("boxful"),
    ],
    [
      sponsorIndex("gamesquad"),
      sponsorIndex("searchyou"),
      sponsorIndex("dma"),
      sponsorIndex("drop"),
    ],
    [
      sponsorIndex("netlify"),
      sponsorIndex("wispr"),
      sponsorIndex("fal"),
      sponsorIndex("exa"),
    ],
    [
      sponsorIndex("svnet"),
      sponsorIndex("firecrawl"),
      sponsorIndex("datamcp"),
      sponsorIndex("rcns"),
      sponsorIndex("cognition"),
    ],
  ];
}

export function isEventIntroFeaturedRow(rowIdx: number): boolean {
  return rowIdx === 0 || rowIdx === 1;
}

/** @deprecated Use {@link isEventIntroFeaturedRow} */
export function isEventIntroPostFeaturedRow(rowIdx: number): boolean {
  return isEventIntroFeaturedRow(rowIdx);
}

export type EventIntroWallCell =
  | { kind: "sponsor"; index: number }
  | { kind: "ufg" };

function insertUfgAfterGamesquad(indices: number[]): EventIntroWallCell[] {
  const cells: EventIntroWallCell[] = [];
  for (const index of indices) {
    cells.push({ kind: "sponsor", index });
    if (index === GAMESQUAD_INDEX) {
      cells.push({ kind: "ufg" });
    }
  }
  return cells;
}

export function buildEventIntroPostWallRows(markCount: number): EventIntroWallCell[][] {
  const rows = buildEventIntroPostRowIndices(markCount);
  return rows.map((row, rowIdx) =>
    rowIdx === rows.length - 1
      ? insertUfgAfterGamesquad(row)
      : row.map((index) => ({ kind: "sponsor" as const, index })),
  );
}

/** Event-intro story: featured pairs, then 2-up rows; UFG follows GameSquad. */
function buildEventIntroStoryRowIndices(markCount: number): number[][] {
  if (markCount !== WELCOME_CARD_SPONSOR_MARK_KEYS.length) {
    const flat = buildWelcomeStorySponsorDisplayIndices(markCount);
    const rows: number[][] = [];
    for (let i = 0; i < flat.length; i += 2) {
      rows.push(flat.slice(i, i + 2));
    }
    return rows;
  }

  return [
    [sponsorIndex("codex"), sponsorIndex("elevenlabs")],
    [sponsorIndex("n8n"), sponsorIndex("zavu")],
    [sponsorIndex("simov"), sponsorIndex("abaco")],
    [sponsorIndex("021"), sponsorIndex("yonjob")],
    [sponsorIndex("nubiwork"), sponsorIndex("kreali")],
    [sponsorIndex("weris"), sponsorIndex("boxful")],
    [sponsorIndex("gamesquad")],
    [sponsorIndex("searchyou"), sponsorIndex("dma")],
    [sponsorIndex("drop")],
    [sponsorIndex("netlify"), sponsorIndex("wispr")],
    [sponsorIndex("fal"), sponsorIndex("exa")],
    [sponsorIndex("svnet"), sponsorIndex("firecrawl")],
    [sponsorIndex("datamcp"), sponsorIndex("rcns"), sponsorIndex("cognition")],
  ];
}

export function buildEventIntroStoryWallRows(markCount: number): EventIntroWallCell[][] {
  const rows = buildEventIntroStoryRowIndices(markCount);
  const gamesquadRowIdx = rows.findIndex((row) => row.includes(GAMESQUAD_INDEX));

  return rows.map((row, rowIdx) =>
    rowIdx === gamesquadRowIdx
      ? insertUfgAfterGamesquad(row)
      : row.map((index) => ({ kind: "sponsor" as const, index })),
  );
}

export function buildEventIntroStoryWallCells(markCount: number): EventIntroWallCell[] {
  return buildEventIntroStoryWallRows(markCount).flat();
}
