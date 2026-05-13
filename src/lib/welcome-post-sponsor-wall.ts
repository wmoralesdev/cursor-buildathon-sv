export const WELCOME_POST_SPONSOR_ROW_LENGTHS = [4, 4, 3] as const;

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
