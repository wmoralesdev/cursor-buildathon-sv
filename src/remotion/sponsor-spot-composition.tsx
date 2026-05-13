import "../index.css";

import { AbsoluteFill } from "remotion";

import { SponsorSpotExportContent } from "../components/sponsor-spot-export-content";
import { SponsorSpotExportShell } from "../components/sponsor-spot-export-shell";
import {
  DESIGN_DIMENSIONS,
  EXPORT_DIMENSIONS,
} from "../components/welcome-card-canvas-spec";
import type { SponsorSpotKey } from "../components/sponsor-spot-logo";
import type { AspectFormat } from "../pages/buildathon-welcome-types";

export type SponsorSpotCompositionProps = {
  sponsorKey: SponsorSpotKey;
  aspectFormat: AspectFormat;
  exportWidth?: number;
  exportHeight?: number;
};

export function SponsorSpotComposition({
  sponsorKey,
  aspectFormat,
  exportWidth,
  exportHeight,
}: SponsorSpotCompositionProps) {
  const design = DESIGN_DIMENSIONS[aspectFormat];
  const targetW = exportWidth ?? EXPORT_DIMENSIONS[aspectFormat].width;
  const targetH = exportHeight ?? EXPORT_DIMENSIONS[aspectFormat].height;
  const scale = targetW / design.width;

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#080808" }}
      data-sponsor-spot-export-surface=""
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
        <SponsorSpotExportShell
          aspectFormat={aspectFormat}
          scale={scale}
          sponsorKey={sponsorKey}
        >
          <SponsorSpotExportContent sponsorKey={sponsorKey} format={aspectFormat} />
        </SponsorSpotExportShell>
      </div>
    </AbsoluteFill>
  );
}
