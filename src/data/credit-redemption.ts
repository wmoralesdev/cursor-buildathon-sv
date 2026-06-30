import type { ParticipantPerkId } from "../data/prizes";

export interface CreditRedemptionGuide {
  perkId: ParticipantPerkId;
  stepCount: 3;
}

export const CREDIT_REDEMPTION_GUIDES: CreditRedemptionGuide[] = [
  { perkId: "cursor", stepCount: 3 },
  { perkId: "codex", stepCount: 3 },
  { perkId: "elevenlabs", stepCount: 3 },
  { perkId: "n8n", stepCount: 3 },
  { perkId: "zavu", stepCount: 3 },
  { perkId: "firecrawl", stepCount: 3 },
  { perkId: "datamcp", stepCount: 3 },
  { perkId: "devin", stepCount: 3 },
];
