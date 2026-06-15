import type { AspectFormat } from "../pages/buildathon-welcome-types";
import { DESIGN_DIMENSIONS, VIDEO_FPS } from "./welcome-card-canvas-spec";

export type WelcomeBackgroundScale = 2 | 3;

export const WELCOME_BACKGROUND_LOOP_SECONDS = 10 as const;
export const WELCOME_BACKGROUND_LOOP_FRAMES =
  WELCOME_BACKGROUND_LOOP_SECONDS * VIDEO_FPS;

export const WELCOME_BACKGROUND_SCALES = [2, 3] as const;

export function welcomeBackgroundDimensions(
  format: AspectFormat,
  scale: WelcomeBackgroundScale,
): { width: number; height: number } {
  const design = DESIGN_DIMENSIONS[format];
  return {
    width: design.width * scale,
    height: design.height * scale,
  };
}

export function welcomeBackgroundAssetPath(
  format: AspectFormat,
  scale: WelcomeBackgroundScale,
): string {
  return `welcome-bg/${format}-${scale}x.mp4`;
}

/** Pre-rendered loops for `remotion:studio` + `remotion:studio:sponsors` only. */
export function remotionWelcomeBackgroundAssetPath(format: AspectFormat): string {
  return `welcome-bg-remotion/${format}-2x.mp4`;
}

export function welcomeBackgroundScaleForExportScale(
  exportScale: number,
): WelcomeBackgroundScale {
  return exportScale >= 2.5 ? 3 : 2;
}
