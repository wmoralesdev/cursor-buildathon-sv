import type { AspectFormat } from "../pages/buildathon-welcome-types";

export const VIDEO_FPS = 30 as const;

/**
 * Total animated duration of the welcome card. Picked so the slowest poster
 * loop (10s sweep) plays at least half a cycle and the 5s bloom/glow/shadow
 * loops complete a full cycle, giving a satisfying export without bloating
 * file size.
 */
export const VIDEO_DURATION_SECONDS = 5 as const;

export const VIDEO_DURATION_FRAMES = VIDEO_DURATION_SECONDS * VIDEO_FPS;

/**
 * Bumped any time the canvas markup, animation timeline, or poster CSS
 * changes in a way that should invalidate cached renders in R2.
 */
export const CANVAS_VERSION = "v1" as const;

/**
 * Design (pre-upscale) pixel dimensions per format. The export composition
 * renders at `EXPORT_DIMENSIONS[format]` and visually scales the design
 * box (via CSS `transform: scale`) so typography stays sharp on phones
 * with high DPR (iPhone 17 Pro Max, Galaxy S25+).
 */
export const DESIGN_DIMENSIONS: Record<AspectFormat, { width: number; height: number }> = {
  post: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
};

export const EXPORT_DIMENSIONS: Record<AspectFormat, { width: number; height: number }> = {
  post: { width: 2160, height: 2160 },
  story: { width: 2160, height: 3840 },
};

export function exportScaleFor(format: AspectFormat): number {
  return EXPORT_DIMENSIONS[format].width / DESIGN_DIMENSIONS[format].width;
}

/**
 * Card intro motion timeline (web preview & Remotion read this same spec).
 * `progressSeconds` is elapsed time since playback start; both consumers
 * derive opacity/translate from it deterministically.
 */
export const INTRO_DURATION_SECONDS = 0.6 as const;

export function introOpacity(progressSeconds: number): number {
  const t = Math.min(1, Math.max(0, progressSeconds / INTRO_DURATION_SECONDS));
  return easeOutCubic(t);
}

export function introTranslateY(progressSeconds: number): number {
  const t = Math.min(1, Math.max(0, progressSeconds / INTRO_DURATION_SECONDS));
  return (1 - easeOutCubic(t)) * 24;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
