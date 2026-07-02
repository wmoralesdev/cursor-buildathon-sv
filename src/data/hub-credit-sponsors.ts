import { HUB_CREDIT_SPONSOR_IDS } from "../../convex/lib/hubSponsorIds";
import { sponsors, type Sponsor } from "./sponsors";

const sponsorById = new Map(sponsors.map((s) => [s.id, s]));

/** Sponsors selectable in the hub — tech partners that grant builder credits. */
export const hubCreditSponsors: Sponsor[] = HUB_CREDIT_SPONSOR_IDS.map((id) => {
  const sponsor = sponsorById.get(id);
  if (!sponsor) {
    throw new Error(`sponsors.ts missing credit partner: ${id}`);
  }
  return sponsor;
});
