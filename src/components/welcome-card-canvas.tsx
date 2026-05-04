import type { CSSProperties } from "react";

import type { AspectFormat } from "../pages/buildathon-welcome-types";
import { AcceptedCardContent } from "./accepted-card-content";
import { DarkGrainyPosterBackground } from "./dark-grainy-poster-background";
import {
  DESIGN_DIMENSIONS,
  introOpacity,
  introTranslateY,
} from "./welcome-card-canvas-spec";

type Props = {
  handle: string;
  imageUrl: string | null;
  aspectFormat: AspectFormat;
  /**
   * Elapsed playback time in seconds. Drives the intro motion deterministically
   * for both web preview (RAF/now-based) and Remotion (frame/fps-based) so
   * the export stays a 1:1 match of the live preview.
   */
  progressSeconds: number;
  /**
   * Base scale applied to the design box. The preview passes a fit-to-parent
   * scale; Remotion passes the export upscale (`EXPORT_DIMENSIONS / DESIGN`).
   */
  scale?: number;
};

const PREVIEW_FRAME_BORDER =
  "1px solid rgba(255, 75, 0, 0.4)";
const PREVIEW_FRAME_SHADOW =
  "0 0 0 1px rgba(255,75,0,0.2), 0 24px 80px -24px rgba(255,75,0,0.35)";

export function WelcomeCardCanvas({
  handle,
  imageUrl,
  aspectFormat,
  progressSeconds,
  scale = 1,
}: Props) {
  const { width, height } = DESIGN_DIMENSIONS[aspectFormat];

  const opacity = introOpacity(progressSeconds);
  const translateY = introTranslateY(progressSeconds);

  const innerStyle: CSSProperties = {
    width,
    height,
    transform: `scale(${scale})`,
    transformOrigin: "top left",
    border: PREVIEW_FRAME_BORDER,
    boxShadow: PREVIEW_FRAME_SHADOW,
    opacity,
    translate: `0 ${translateY}px`,
    backgroundColor: "#14120b",
  };

  return (
    <div style={innerStyle} className="relative isolate overflow-hidden">
      <DarkGrainyPosterBackground />
      <AcceptedCardContent
        handle={handle}
        imageUrl={imageUrl}
        format={aspectFormat}
      />
    </div>
  );
}
