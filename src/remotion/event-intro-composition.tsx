import "../index.css";

import { AbsoluteFill } from "remotion";

import type { AspectFormat } from "../pages/buildathon-welcome-types";
import {
  DESIGN_DIMENSIONS,
  EXPORT_DIMENSIONS,
} from "../components/welcome-card-canvas-spec";
import { EventIntroSequence } from "../components/event-intro-sequence";

export type EventIntroCompositionProps = {
  aspectFormat: AspectFormat;
  exportWidth?: number;
  exportHeight?: number;
};

export function EventIntroComposition({
  aspectFormat,
  exportWidth,
  exportHeight,
}: EventIntroCompositionProps) {
  const design = DESIGN_DIMENSIONS[aspectFormat];
  const targetW = exportWidth ?? EXPORT_DIMENSIONS[aspectFormat].width;
  const targetH = exportHeight ?? EXPORT_DIMENSIONS[aspectFormat].height;
  const scale = targetW / design.width;

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#080808" }}
      data-event-intro-export-surface=""
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
        <EventIntroSequence
          aspectFormat={aspectFormat}
          scale={scale}
        />
      </div>
    </AbsoluteFill>
  );
}
