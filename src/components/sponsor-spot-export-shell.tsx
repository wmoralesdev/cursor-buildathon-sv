import type { CSSProperties, ReactNode } from "react";

import type { AspectFormat } from "../pages/buildathon-welcome-types";
import type { SponsorSpotKey } from "./sponsor-spot-logo";
import { DESIGN_DIMENSIONS } from "./welcome-card-canvas-spec";
import { WelcomeCardExportVideoBackground } from "./welcome-card-export-video-background";

const EXPORT_FRAME_BORDER = "1px solid rgba(255, 75, 0, 0.4)";
const EXPORT_FRAME_SHADOW =
  "0 0 0 1px rgba(255,75,0,0.2), 0 24px 80px -24px rgba(255,75,0,0.35)";

type Props = {
  aspectFormat: AspectFormat;
  scale: number;
  sponsorKey: SponsorSpotKey;
  children: ReactNode;
};

export function SponsorSpotExportShell({
  aspectFormat,
  scale,
  sponsorKey,
  children,
}: Props) {
  const { width, height } = DESIGN_DIMENSIONS[aspectFormat];
  const outerStyle: CSSProperties = {
    containerType: "size",
    width,
    height,
    transform: `scale(${scale})`,
    transformOrigin: "top left",
    border: EXPORT_FRAME_BORDER,
    boxShadow: EXPORT_FRAME_SHADOW,
    backgroundColor: "#14120b",
    position: "relative",
    overflow: "hidden",
    isolation: "isolate",
  };

  return (
    <div style={outerStyle} data-sponsor-spot-key={sponsorKey}>
      <WelcomeCardExportVideoBackground
        aspectFormat={aspectFormat}
        exportScale={scale}
      />
      <div className="pointer-events-none relative z-10 flex h-full min-h-0 w-full flex-col">
        {children}
      </div>
    </div>
  );
}
