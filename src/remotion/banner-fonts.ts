import { staticFile } from "remotion";

export const BANNER_FONT_FAMILY = "Cursor Gothic" as const;

const FONT_DIR = "font/cursor gothic";

function fontSrc(file: string): string {
  return staticFile(`${FONT_DIR}/${file}`);
}

/** Scoped to banner Remotion only — files live under `public/font/cursor gothic/`. */
export function bannerFontFaceCss(): string {
  const regular = fontSrc("CursorGothic-Regular.woff2");

  return `
@font-face {
  font-family: "${BANNER_FONT_FAMILY}";
  src: url("${regular}") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: block;
}
`.trim();
}
