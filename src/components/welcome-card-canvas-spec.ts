import type { AspectFormat } from "../pages/buildathon-welcome-types";

export const VIDEO_FPS = 30 as const;

export const DEFAULT_CARD_DURATION_SECONDS = 4.5 as const;

export const GLITCH_TRANSITION_SECONDS = 0.45 as const;

export const SPONSOR_SLATE_DURATION_SECONDS = 2.9 as const;

export const FINAL_CARD_HOLD_SECONDS = 0.9 as const;

export const EXPORT_VIDEO_DURATION_SECONDS =
  DEFAULT_CARD_DURATION_SECONDS +
  GLITCH_TRANSITION_SECONDS +
  SPONSOR_SLATE_DURATION_SECONDS +
  GLITCH_TRANSITION_SECONDS +
  FINAL_CARD_HOLD_SECONDS;

export const EXPORT_VIDEO_DURATION_FRAMES = Math.round(
  EXPORT_VIDEO_DURATION_SECONDS * VIDEO_FPS,
);

/** Sponsor spot Remotion clips duration (8.0s @ 30fps). */
export const SPONSOR_SPOT_DURATION_FRAMES = 240;

/**
 * Sponsor spot beat timeline in frames (assuming 30fps / 8.0s = 240 frames).
 * Used to drive the Terminal (TUI) reveal narrative.
 *
 * Beats:
 *   typeCommand - Typing effect for user prompt (starts immediately)
 *   terminalLogs- Fake build logs appearing
 *   heroBurst   - Sponsor logo bursts forward in mono inside the terminal
 *   colorBloom  - Grayscale -> brand color, glow ramp
 *   hold        - Full-color hold with ambient drift
 *   exit        - Fades out terminal contents to loop seamlessly back to frame 0
 */
export const SPONSOR_SPOT_TIMELINE = {
  typeCommand: { startFrame: 0, endFrame: 60 },
  terminalLogs: { startFrame: 65, endFrame: 105 },
  heroBurst: { startFrame: 110, endFrame: 130 },
  colorBloom: { startFrame: 130, endFrame: 150 },
  hold: { startFrame: 150, endFrame: 225 },
  exit: { startFrame: 225, endFrame: 240 },
} as const;

export const SEQUENCE_TIMELINE = {
  defaultEnd: DEFAULT_CARD_DURATION_SECONDS,
  glitchOutEnd: DEFAULT_CARD_DURATION_SECONDS + GLITCH_TRANSITION_SECONDS,
  sponsorHoldEnd:
    DEFAULT_CARD_DURATION_SECONDS +
    GLITCH_TRANSITION_SECONDS +
    SPONSOR_SLATE_DURATION_SECONDS,
  glitchBackEnd:
    DEFAULT_CARD_DURATION_SECONDS +
    GLITCH_TRANSITION_SECONDS +
    SPONSOR_SLATE_DURATION_SECONDS +
    GLITCH_TRANSITION_SECONDS,
  totalEnd: EXPORT_VIDEO_DURATION_SECONDS,
} as const;

export const SPONSOR_SLATE_HOLD_PREVIEW_SECONDS =
  SEQUENCE_TIMELINE.glitchOutEnd + SPONSOR_SLATE_DURATION_SECONDS * 0.5;

/** @deprecated Use DEFAULT_CARD_DURATION_SECONDS (preview) or EXPORT_VIDEO_DURATION_SECONDS (export). */
export const VIDEO_DURATION_SECONDS = DEFAULT_CARD_DURATION_SECONDS;

/** @deprecated Use EXPORT_VIDEO_DURATION_FRAMES for Remotion compositions. */
export const VIDEO_DURATION_FRAMES = EXPORT_VIDEO_DURATION_FRAMES;

export const CANVAS_VERSION = "v23" as const;

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
