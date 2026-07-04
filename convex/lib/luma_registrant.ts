import { normalizeEventEligibleEmail } from "./hub_event_eligibility";
import { normalizePerkEligibleEmail } from "./hub_perk_eligibility";

export const PERK_ELIGIBLE_TICKET_NAME = "Standard";

export const ALWAYS_STANDARD_EMAILS = [
  "walterrafael26@gmail.com",
  "26irenelopez@gmail.com",
] as const;

export type LumaRegistrantRow = {
  email: string;
  ticketName: string;
};

export function normalizeLumaEmail(email: string): string {
  return normalizeEventEligibleEmail(email);
}

export function isPerkEligibleTicket(ticketName: string): boolean {
  return ticketName.trim() === PERK_ELIGIBLE_TICKET_NAME;
}

/** Dedupe CSV rows by email; inject always-Standard overrides last so they win. */
export function mergeLumaRegistrantRows(csvRows: LumaRegistrantRow[]): LumaRegistrantRow[] {
  const byEmail = new Map<string, LumaRegistrantRow>();

  for (const row of csvRows) {
    const email = normalizeLumaEmail(row.email);
    if (!email || !email.includes("@")) {
      continue;
    }
    byEmail.set(email, {
      email,
      ticketName: row.ticketName.trim(),
    });
  }

  for (const rawEmail of ALWAYS_STANDARD_EMAILS) {
    const email = normalizePerkEligibleEmail(rawEmail);
    byEmail.set(email, {
      email,
      ticketName: PERK_ELIGIBLE_TICKET_NAME,
    });
  }

  return Array.from(byEmail.values());
}

export function countStandardRows(rows: LumaRegistrantRow[]): number {
  return rows.filter((row) => isPerkEligibleTicket(row.ticketName)).length;
}
