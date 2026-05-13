import { Composition } from "remotion";

import "../index.css";

import {
  EXPORT_DIMENSIONS,
  SPONSOR_SPOT_DURATION_FRAMES,
  VIDEO_FPS,
} from "../components/welcome-card-canvas-spec";
import { WELCOME_CARD_SPONSOR_MARK_KEYS } from "../components/welcome-sponsor-marks";
import type { AspectFormat } from "../pages/buildathon-welcome-types";
import {
  SponsorSpotComposition,
  type SponsorSpotCompositionProps,
} from "./sponsor-spot-composition";

const ASPECT_FORMATS: AspectFormat[] = ["post", "story"];

function compositionId(
  sponsorKey: (typeof WELCOME_CARD_SPONSOR_MARK_KEYS)[number],
  aspectFormat: AspectFormat,
): string {
  return `sponsor-spot-${sponsorKey}-${aspectFormat}`;
}

export function SponsorSpotRoot() {
  return (
    <>
      {WELCOME_CARD_SPONSOR_MARK_KEYS.flatMap((sponsorKey) =>
        ASPECT_FORMATS.map((aspectFormat) => {
          const dims = EXPORT_DIMENSIONS[aspectFormat];
          const defaultProps: SponsorSpotCompositionProps = {
            sponsorKey,
            aspectFormat,
          };

          return (
            <Composition
              key={compositionId(sponsorKey, aspectFormat)}
              id={compositionId(sponsorKey, aspectFormat)}
              component={SponsorSpotComposition}
              durationInFrames={SPONSOR_SPOT_DURATION_FRAMES}
              fps={VIDEO_FPS}
              width={dims.width}
              height={dims.height}
              defaultProps={defaultProps}
            />
          );
        }),
      )}
    </>
  );
}
