/**
 * Credits one-pager data: every product partner that contributes tools, API
 * credits, or licenses to each builder at the event.
 *
 * `value` is the per-builder USD value unless `perTeam` is set (Fal is granted
 * per team, not per builder). `isNew` flags partners that joined for this
 * edition so the sheet can mark them with a "new" indicator.
 *
 * Order: Codex · n8n · Zavu first (partner rail convention), remaining founding
 * partners, then the recently joined wave.
 */

export type CreditPartnerId =
  | "codex"
  | "n8n"
  | "zavu"
  | "cursor"
  | "elevenlabs"
  | "firecrawl"
  | "datamcp"
  | "exa"
  | "fal"
  | "netlify"
  | "wispr"
  | "cognition";

export interface CreditPartner {
  id: CreditPartnerId;
  /** Per-builder USD value (per-team when `perTeam` is true). */
  value: number;
  /** Shown in UI instead of `$${value}` when value is split or approximate. */
  displayValue?: string;
  /** Granted once per team rather than per builder. */
  perTeam?: boolean;
  /** Joined for this edition — surfaced with a "new" indicator. */
  isNew?: boolean;
  /** Omitted from builder perk pack totals and redeem UI (e.g. netlify). */
  excludeFromBuilderPack?: boolean;
}

export const CREDIT_PARTNERS: readonly CreditPartner[] = [
  { id: "codex", value: 150, displayValue: "$100 + $50" },
  { id: "n8n", value: 60 },
  { id: "zavu", value: 75 },
  { id: "cursor", value: 50 },
  { id: "elevenlabs", value: 22 },
  { id: "firecrawl", value: 20 },
  { id: "cognition", value: 40 },
  { id: "datamcp", value: 40, isNew: true },
  { id: "exa", value: 50, isNew: true },
  { id: "fal", value: 100, perTeam: true, isNew: true },
  { id: "netlify", value: 20, isNew: true, excludeFromBuilderPack: true },
  { id: "wispr", value: 50, isNew: true },
] as const;

export function formatCreditPartnerValue(partner: CreditPartner): string {
  return partner.displayValue ?? `$${partner.value}`;
}

/** Per-builder perks in the redeem/premios pack (excludes per-team and netlify). */
export const BUILDER_CREDIT_PARTNERS = CREDIT_PARTNERS.filter(
  (partner) => !partner.perTeam && !partner.excludeFromBuilderPack,
);

/** Sum of per-builder perk values shown in Premios and Canjear créditos. */
export const BUILDER_PERK_TOTAL = BUILDER_CREDIT_PARTNERS.reduce(
  (sum, partner) => sum + partner.value,
  0,
);

/** Registered builders on-site — used for event-wide credit totals. */
export const CREDIT_BUILDER_COUNT = 200;

/** Per-builder perk pack × builder headcount (excludes per-team Fal and netlify). */
export const CREDIT_EVENT_TOTAL = BUILDER_PERK_TOTAL * CREDIT_BUILDER_COUNT;

export const CREDIT_PER_TEAM_TOTAL = CREDIT_PARTNERS.filter(
  (partner) => partner.perTeam,
).reduce((sum, partner) => sum + partner.value, 0);

export const NEW_PARTNER_COUNT = CREDIT_PARTNERS.filter(
  (partner) => partner.isNew,
).length;
