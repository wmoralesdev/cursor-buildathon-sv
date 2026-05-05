import "../index.css";

import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

import type { AspectFormat } from "../pages/buildathon-welcome-types";
import { ExportAnimatedPosterBackground } from "../components/export-animated-poster-background";

export type WelcomeBackgroundLoopCompositionProps = {
  aspectFormat: AspectFormat;
};

export function WelcomeBackgroundLoopComposition({
  aspectFormat,
}: WelcomeBackgroundLoopCompositionProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progressSeconds = frame / fps;
  void aspectFormat;

  return (
    <AbsoluteFill style={{ backgroundColor: "#14120b" }}>
      <ExportAnimatedPosterBackground progressSeconds={progressSeconds} />
    </AbsoluteFill>
  );
}
