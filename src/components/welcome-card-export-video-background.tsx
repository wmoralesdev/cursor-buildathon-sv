import type { CSSProperties } from "react";
import { Video } from "@remotion/media";
import { Loop, staticFile } from "remotion";

import type { AspectFormat } from "../pages/buildathon-welcome-types";
import {
  WELCOME_BACKGROUND_LOOP_FRAMES,
  welcomeBackgroundAssetPath,
  welcomeBackgroundScaleForExportScale,
} from "./welcome-background-video-spec";

type Props = {
  aspectFormat: AspectFormat;
  exportScale: number;
};

export function WelcomeCardExportVideoBackground({
  aspectFormat,
  exportScale,
}: Props) {
  const assetScale = welcomeBackgroundScaleForExportScale(exportScale);
  const src = staticFile(welcomeBackgroundAssetPath(aspectFormat, assetScale));

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      <Loop durationInFrames={WELCOME_BACKGROUND_LOOP_FRAMES}>
        <Video
          src={src}
          muted
          style={BACKGROUND_VIDEO_STYLE}
        />
      </Loop>
    </div>
  );
}

const BACKGROUND_VIDEO_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
};
