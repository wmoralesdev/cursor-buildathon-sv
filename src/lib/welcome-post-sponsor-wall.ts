import { WELCOME_CARD_SPONSOR_MARK_KEYS } from "../components/welcome-sponsor-marks";

/** GameSquad, SearchYou, and Drop share the final row for breathing room. */
export const WELCOME_POST_SPONSOR_ROW_LENGTHS = [4, 4, 4, 3] as const;

/** Story layout only — swap Drop into GameSquad's slot and vice versa. */
export function buildWelcomeStorySponsorDisplayIndices(markCount: number): number[] {
  const order = Array.from({ length: markCount }, (_, index) => index);
  const gamesquadIdx = WELCOME_CARD_SPONSOR_MARK_KEYS.indexOf("gamesquad");
  const dropIdx = WELCOME_CARD_SPONSOR_MARK_KEYS.indexOf("drop");
  if (gamesquadIdx < 0 || dropIdx < 0 || gamesquadIdx >= markCount || dropIdx >= markCount) {
    return order;
  }
  order[gamesquadIdx] = dropIdx;
  order[dropIdx] = gamesquadIdx;
  return order;
}

export function buildWelcomePostSponsorRowIndices(markCount: number): number[][] {
  const sum = WELCOME_POST_SPONSOR_ROW_LENGTHS.reduce((a, b) => a + b, 0);
  if (sum !== markCount) {
    throw new Error(
      `Post sponsor row lengths sum to ${sum} but ${markCount} marks are registered — update WELCOME_POST_SPONSOR_ROW_LENGTHS or the mark list.`,
    );
  }
  let cursor = 0;
  return WELCOME_POST_SPONSOR_ROW_LENGTHS.map((n) => {
    const row = Array.from({ length: n }, (_, k) => cursor + k);
    cursor += n;
    return row;
  });
}
