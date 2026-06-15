import type { Language } from "../i18n/translations";

function formatExactDollar(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

/** Round lumpy totals to scannable figures for one-pager display only. */
export function roundPrizeDisplayAmount(amount: number): number {
  if (amount <= 0) return 0;
  if (amount % 50 === 0) return amount;

  if (amount >= 1_000) {
    return Math.round(amount / 100) * 100;
  }

  return Math.round(amount / 50) * 50;
}

function approxPrefix(language: Language): string {
  return language === "es" ? "~. " : "~";
}

function formatCompactThousands(amount: number): string | null {
  if (amount < 1_000) return null;
  const thousands = amount / 1_000;
  const roundedTenths = Math.round(thousands * 10) / 10;
  if (Number.isInteger(roundedTenths)) {
    return `$${roundedTenths}K`;
  }
  return `$${roundedTenths.toFixed(1)}K`;
}

export interface ApproxDollarDisplayOptions {
  /** Compact K notation for large headline totals (e.g. ≈$2.7K). */
  compact?: boolean;
}

/** Display-layer formatter: exact when already round, otherwise prefixed approximate. */
export function formatApproxDollarDisplay(
  exactAmount: number,
  language: Language,
  options: ApproxDollarDisplayOptions = {},
): string {
  const rounded = roundPrizeDisplayAmount(exactAmount);

  if (rounded === exactAmount) {
    return formatExactDollar(exactAmount);
  }

  const prefix = approxPrefix(language);

  if (options.compact) {
    const compact = formatCompactThousands(rounded);
    if (compact) {
      return `${prefix}${compact}`;
    }
  }

  return `${prefix}${formatExactDollar(rounded)}`;
}
