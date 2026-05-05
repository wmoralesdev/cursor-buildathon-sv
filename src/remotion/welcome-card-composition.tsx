import "../index.css";

import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

import type { AspectFormat } from "../pages/buildathon-welcome-types";
import { WelcomeCardExportSequence } from "../components/welcome-card-export-sequence";
import {
  DESIGN_DIMENSIONS,
  EXPORT_DIMENSIONS,
} from "../components/welcome-card-canvas-spec";

export type WelcomeCardCompositionProps = {
  handle: string;
  imageUrl: string | null;
  aspectFormat: AspectFormat;
  isLeadOrganizer?: boolean;
  exportWidth?: number;
  exportHeight?: number;
};

export function WelcomeCardComposition({
  handle,
  imageUrl,
  aspectFormat,
  isLeadOrganizer,
  exportWidth,
  exportHeight,
}: WelcomeCardCompositionProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progressSeconds = frame / fps;

  const design = DESIGN_DIMENSIONS[aspectFormat];
  const targetW = exportWidth ?? EXPORT_DIMENSIONS[aspectFormat].width;
  const targetH = exportHeight ?? EXPORT_DIMENSIONS[aspectFormat].height;
  const scale = targetW / design.width;

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#080808" }}
      data-welcome-export-surface=""
    >
      <div
        style={{
          width: targetW,
          height: targetH,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <WelcomeCardExportSequence
          handle={handle}
          imageUrl={imageUrl}
          aspectFormat={aspectFormat}
          progressSeconds={progressSeconds}
          scale={scale}
          isLeadOrganizer={isLeadOrganizer}
        />
      </div>
    </AbsoluteFill>
  );
}
