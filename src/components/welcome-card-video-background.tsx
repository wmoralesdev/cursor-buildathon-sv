import type { CSSProperties } from "react";

import type { AspectFormat } from "../pages/buildathon-welcome-types";
import { welcomeBackgroundAssetPath } from "./welcome-background-video-spec";

type Props = {
  aspectFormat: AspectFormat;
  className?: string;
};

export function WelcomeCardVideoBackground({
  aspectFormat,
  className = "",
}: Props) {
  const src = `/${welcomeBackgroundAssetPath(aspectFormat, 2)}`;

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden
    >
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        tabIndex={-1}
        style={BACKGROUND_VIDEO_STYLE}
      />
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
