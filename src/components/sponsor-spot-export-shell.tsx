import type { CSSProperties, ReactNode } from "react";

import type { AspectFormat } from "../pages/buildathon-welcome-types";
import type { SponsorSpotKey } from "./sponsor-spot-logo";
import { DESIGN_DIMENSIONS } from "./welcome-card-canvas-spec";
import { WelcomeCardExportVideoBackground } from "./welcome-card-export-video-background";

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
    backgroundColor: "#14120b",
    position: "relative",
    overflow: "hidden",
    isolation: "isolate",
  };

  return (
    <div style={outerStyle} data-sponsor-spot-key={sponsorKey}>
      <WelcomeCardExportVideoBackground aspectFormat={aspectFormat} />
      <div className="pointer-events-none relative z-10 flex h-full min-h-0 w-full flex-col">
        {children}
      </div>
    </div>
  );
}
