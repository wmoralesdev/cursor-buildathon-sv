import "../index.css";

import { AbsoluteFill } from "remotion";

import type { AspectFormat } from "../pages/buildathon-welcome-types";
import {
  DESIGN_DIMENSIONS,
  EXPORT_DIMENSIONS,
} from "../components/welcome-card-canvas-spec";
import { MentorCalloutSequence } from "../components/mentor-callout-sequence";

export type MentorCalloutCompositionProps = {
  aspectFormat: AspectFormat;
  exportWidth?: number;
  exportHeight?: number;
};

export function MentorCalloutComposition({
  aspectFormat,
  exportWidth,
  exportHeight,
}: MentorCalloutCompositionProps) {
  const design = DESIGN_DIMENSIONS[aspectFormat];
  const targetW = exportWidth ?? EXPORT_DIMENSIONS[aspectFormat].width;
  const targetH = exportHeight ?? EXPORT_DIMENSIONS[aspectFormat].height;
  const scale = targetW / design.width;

  return (
    <AbsoluteFill style={{ backgroundColor: "#080808" }}>
      <div
        style={{
          width: targetW,
          height: targetH,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <MentorCalloutSequence aspectFormat={aspectFormat} scale={scale} />
      </div>
    </AbsoluteFill>
  );
}
