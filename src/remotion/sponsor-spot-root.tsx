import { Composition } from "remotion";

import "../index.css";

import {
  EXPORT_DIMENSIONS,
  SPONSOR_SPOT_DURATION_FRAMES,
  VIDEO_FPS,
} from "../components/welcome-card-canvas-spec";
import { WELCOME_CARD_SPONSOR_MARK_KEYS } from "../components/welcome-sponsor-marks";
import {
  SPONSOR_SPOT_ASPECT_FORMATS,
  sponsorSpotCompositionId,
} from "./sponsor-spot-composition-ids";
import {
  SponsorSpotComposition,
  type SponsorSpotCompositionProps,
} from "./sponsor-spot-composition";

export function SponsorSpotRoot() {
  return (
    <>
      {WELCOME_CARD_SPONSOR_MARK_KEYS.flatMap((sponsorKey) =>
        SPONSOR_SPOT_ASPECT_FORMATS.map((aspectFormat) => {
          const dims = EXPORT_DIMENSIONS[aspectFormat];
          const defaultProps: SponsorSpotCompositionProps = {
            sponsorKey,
            aspectFormat,
          };
          const id = sponsorSpotCompositionId(sponsorKey, aspectFormat);

          return (
            <Composition
              key={id}
              id={id}
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
