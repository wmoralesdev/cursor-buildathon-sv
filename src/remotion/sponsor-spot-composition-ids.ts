import { WELCOME_CARD_SPONSOR_MARK_KEYS } from "../components/welcome-sponsor-marks";
import type { AspectFormat } from "../pages/buildathon-welcome-types";

export const SPONSOR_SPOT_ASPECT_FORMATS = ["post", "story"] as const satisfies readonly AspectFormat[];

export const SPONSOR_SPOT_REMOTION_ENTRY = "src/remotion/sponsor-spot-index.ts";

export const SPONSOR_SPOT_OUTPUT_DIR = "out/sponsor-spots";

export function sponsorSpotCompositionId(
  sponsorKey: (typeof WELCOME_CARD_SPONSOR_MARK_KEYS)[number],
  aspectFormat: AspectFormat,
): string {
  return `sponsor-spot-${sponsorKey}-${aspectFormat}`;
}

export function allSponsorSpotCompositionIds(): string[] {
  return WELCOME_CARD_SPONSOR_MARK_KEYS.flatMap((sponsorKey) =>
    SPONSOR_SPOT_ASPECT_FORMATS.map((aspectFormat) =>
      sponsorSpotCompositionId(sponsorKey, aspectFormat),
    ),
  );
}
