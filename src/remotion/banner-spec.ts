/** Horizontal banner Remotion compositions (separate studio entry). */

export const BANNER_BG = "#14120b" as const;

export const BANNER_FPS = 30 as const;

/** Quick hold — video carries motion; no extra beats. */
export const BANNER_DURATION_FRAMES = 90 as const;

export const BANNER_DIMENSIONS = {
  width: 1920,
  height: 540,
} as const;

/** ProRes + alpha — final render only (`OffthreadVideo` + `transparent`). */
export const CURSOR_ANIMATED_ASSET = "cursor-animated.mov" as const;

/** H.264 studio preview, alpha baked onto `BANNER_BG` (`pnpm remotion:assets:banner-preview`). */
export const CURSOR_ANIMATED_PREVIEW_ASSET = "cursor-animated-preview.mp4" as const;

/** Native dimensions of `cursor-animated.mov` (used for layout). */
export const CURSOR_ANIMATED_SIZE = {
  width: 2490,
  height: 2725,
} as const;

/** Display scale for banner layout (390px base × 1/3 × 1.2 ≈ 156px tall). */
export const BANNER_VIDEO_DISPLAY_SCALE = (1 / 3) * 1.2;

export const BANNER_TEXT_SCALE = 0.9;

export const BANNER_HEADLINE_FONT_SIZE = Math.round(88 * BANNER_TEXT_SCALE);

export const BANNER_SUBLINE_FONT_SIZE = Math.round(36 * BANNER_TEXT_SCALE);

export type BannerCopyVariant = {
  id: string;
  headline: string;
  subline?: string;
};

export const BANNER_COPY_VARIANTS: BannerCopyVariant[] = [
  { id: "cowork", headline: "Cursor Cowork" },
  { id: "cafe", headline: "Cafe Cursor" },
  { id: "lab", headline: "Cursor Lab" },
  { id: "buildathon", headline: "Cursor Buildathon" },
  { id: "hackathon", headline: "Cursor Hackathon" },
  { id: "meetup", headline: "Cursor Meetup" },
  { id: "workshop", headline: "Cursor Workshop" },
];

export function bannerCompositionId(variantId: string): string {
  return `cowork-banner-${variantId}`;
}
