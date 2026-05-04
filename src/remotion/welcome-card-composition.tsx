import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

import type { AspectFormat } from "../pages/buildathon-welcome-types";
import { WelcomeCardCanvas } from "../components/welcome-card-canvas";
import {
  DESIGN_DIMENSIONS,
  exportScaleFor,
} from "../components/welcome-card-canvas-spec";

export type WelcomeCardCompositionProps = {
  handle: string;
  imageUrl: string | null;
  aspectFormat: AspectFormat;
};

export function WelcomeCardComposition({
  handle,
  imageUrl,
  aspectFormat,
}: WelcomeCardCompositionProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progressSeconds = frame / fps;

  const design = DESIGN_DIMENSIONS[aspectFormat];
  const scale = exportScaleFor(aspectFormat);

  return (
    <AbsoluteFill style={{ backgroundColor: "#080808" }}>
      <div
        style={{
          width: design.width * scale,
          height: design.height * scale,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <WelcomeCardCanvas
          handle={handle}
          imageUrl={imageUrl}
          aspectFormat={aspectFormat}
          progressSeconds={progressSeconds}
          scale={scale}
        />
      </div>
    </AbsoluteFill>
  );
}
