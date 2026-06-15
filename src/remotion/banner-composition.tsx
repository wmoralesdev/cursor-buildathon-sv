import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  useRemotionEnvironment,
} from "remotion";

import { BannerCopy } from "./banner-copy";
import { BannerFontFaces } from "./banner-font-faces";
import {
  BANNER_BG,
  BANNER_VIDEO_DISPLAY_SCALE,
  CURSOR_ANIMATED_ASSET,
  CURSOR_ANIMATED_PREVIEW_ASSET,
  CURSOR_ANIMATED_SIZE,
} from "./banner-spec";

export type BannerCompositionProps = {
  headline: string;
  subline?: string;
};

const ROW_STYLE: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 72,
  width: "100%",
  height: "100%",
  padding: "0 96px",
  boxSizing: "border-box",
};

const VIDEO_BASE_HEIGHT = 390;

const VIDEO_DISPLAY_HEIGHT = Math.round(
  VIDEO_BASE_HEIGHT * BANNER_VIDEO_DISPLAY_SCALE,
);

const VIDEO_DISPLAY_WIDTH = Math.round(
  (VIDEO_DISPLAY_HEIGHT * CURSOR_ANIMATED_SIZE.width) /
    CURSOR_ANIMATED_SIZE.height,
);

const VIDEO_WRAP_STYLE: CSSProperties = {
  flexShrink: 0,
  width: VIDEO_DISPLAY_WIDTH,
  height: VIDEO_DISPLAY_HEIGHT,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const VIDEO_STYLE: CSSProperties = {
  width: VIDEO_DISPLAY_WIDTH,
  height: VIDEO_DISPLAY_HEIGHT,
  objectFit: "contain",
};

export function BannerComposition({ headline, subline }: BannerCompositionProps) {
  const { isRendering } = useRemotionEnvironment();
  const videoSrc = staticFile(
    isRendering ? CURSOR_ANIMATED_ASSET : CURSOR_ANIMATED_PREVIEW_ASSET,
  );

  return (
    <AbsoluteFill style={{ backgroundColor: BANNER_BG }}>
      <BannerFontFaces />
      <div style={ROW_STYLE}>
        <div style={VIDEO_WRAP_STYLE}>
          <OffthreadVideo
            src={videoSrc}
            transparent={isRendering}
            muted
            style={VIDEO_STYLE}
          />
        </div>
        <BannerCopy headline={headline} subline={subline} />
      </div>
    </AbsoluteFill>
  );
}
