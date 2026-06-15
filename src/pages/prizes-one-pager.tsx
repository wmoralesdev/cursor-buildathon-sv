import type { ReactElement, ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { OnePagerShell } from "../components/one-pager-shell";
import { OnePagerSheetFrame } from "../components/one-pager-sheet-frame";
import {
  CodexLogo,
  CursorLockup,
  ElevenLabsLogo,
  N8nLogo,
  OnePagerCashLightLogoAssetsProvider,
  ZavuLogo,
} from "../components/sponsor-logos";
import { useTranslation } from "../context/language-context";
import type { Language, TranslationKey } from "../i18n/translations";
import { formatApproxDollarDisplay } from "../lib/prize-amount-display";
import "../styles/one-pager-print.css";
import "../styles/prizes-square.css";

const SITE_DISPLAY = "build.cursorelsalvador.com";

/** Sum of PARTICIPANT_PERKS values: 60+70+22+60+75+20+38+20 */
const CREDITS_TOTAL = "$365";
/** Solo-team baseline: cash $1,000 + Codex 10K×3 + n8n 720 + EL Scale 990 + EL Pro 297 + Cursor credits 500 */
const PRIZES_TOTAL = "$33K+";

type PerkLogo = "cursor" | "codex" | "elevenlabs" | "n8n" | "zavu" | null;

type ParticipantPerkId =
  | "cursor"
  | "codex"
  | "elevenlabs"
  | "n8n"
  | "zavu"
  | "firecrawl"
  | "datamcp"
  | "devin";

interface ParticipantPerkDef {
  id: ParticipantPerkId;
  logo: PerkLogo;
  sponsor: string;
  value: string;
}

const PARTICIPANT_PERK_DEFS: ParticipantPerkDef[] = [
  { id: "cursor", logo: "cursor", sponsor: "Cursor", value: "$60" },
  { id: "codex", logo: "codex", sponsor: "Codex", value: "$70" },
  { id: "elevenlabs", logo: "elevenlabs", sponsor: "ElevenLabs", value: "$22" },
  { id: "n8n", logo: "n8n", sponsor: "n8n", value: "$60" },
  { id: "zavu", logo: "zavu", sponsor: "Zavu", value: "$75" },
  { id: "firecrawl", logo: null, sponsor: "Firecrawl", value: "~$20" },
  { id: "datamcp", logo: null, sponsor: "DataMCP", value: "$38" },
  { id: "devin", logo: null, sponsor: "Devin", value: "$20" },
];

type TrackId = "codex" | "elevenlabs" | "n8n";

interface TrackPrizeDef {
  id: TrackId;
  logo: PerkLogo;
  sponsor: string;
  value: string;
}

const TRACK_PRIZE_DEFS: TrackPrizeDef[] = [
  { id: "codex", logo: "codex", sponsor: "Codex", value: "$10K / member" },
  { id: "elevenlabs", logo: "elevenlabs", sponsor: "ElevenLabs", value: "$990 / member" },
  { id: "n8n", logo: "n8n", sponsor: "n8n", value: "$720 / member" },
];

interface OverallCreditLine {
  labelKey: TranslationKey;
  value: string;
}

interface OverallPrizeDef {
  placeId: "1st" | "2nd" | "3rd";
  cash: string;
  credits: OverallCreditLine[];
}

/** Example team size for projected overall-winner totals (teams are 2–5). */
const OVERALL_PRIZE_PROJECTION_MEMBERS = 4;

const OVERALL_PRIZE_DEFS: OverallPrizeDef[] = [
  {
    placeId: "1st",
    cash: "$500",
    credits: [
      {
        labelKey: "onePager.prizes.overall.1st.credit.cursor.label",
        value: "$250",
      },
      {
        labelKey: "onePager.prizes.overall.1st.credit.elevenlabs.label",
        value: "$297",
      },
    ],
  },
  {
    placeId: "2nd",
    cash: "$300",
    credits: [
      {
        labelKey: "onePager.prizes.overall.2nd.credit.cursor.label",
        value: "$150",
      },
    ],
  },
  {
    placeId: "3rd",
    cash: "$200",
    credits: [
      {
        labelKey: "onePager.prizes.overall.3rd.credit.cursor.label",
        value: "$100",
      },
    ],
  },
];

function parseDollarAmount(value: string): number {
  const digits = value.replace(/[^\d]/g, "");
  return digits.length > 0 ? Number.parseInt(digits, 10) : 0;
}

function computePerMemberCreditTotal(
  perMemberValue: string,
  memberCount: number = OVERALL_PRIZE_PROJECTION_MEMBERS,
): number {
  return parseDollarAmount(perMemberValue) * memberCount;
}

function computeCombinedPrizeTotal(
  cash: string,
  credits: OverallCreditLine[],
  memberCount: number = OVERALL_PRIZE_PROJECTION_MEMBERS,
): number {
  const cashAmount = parseDollarAmount(cash);
  const creditsTotal = credits.reduce(
    (sum, credit) => sum + parseDollarAmount(credit.value) * memberCount,
    0,
  );
  return cashAmount + creditsTotal;
}

export function PrizesOnePagerPage() {
  const [searchParams] = useSearchParams();
  const { language, t } = useTranslation();

  const tp = useMemo(
    () => (suffix: string) => t(`onePager.prizes.${suffix}` as TranslationKey),
    [t],
  );

  const embedOnly =
    searchParams.get("embed") === "1" || searchParams.get("embed") === "true";
  const sheetOnly =
    embedOnly &&
    (searchParams.get("sheet") === "1" || searchParams.get("sheet") === "true");

  // `@page` cannot be scoped per-route in shared CSS; inject the square page size
  // only on the sheet-only print tab so letter-sized one-pagers stay untouched.
  useEffect(() => {
    if (!sheetOnly) return;
    const style = document.createElement("style");
    style.textContent = "@page { size: 7.5in 7.5in; margin: 0; }";
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, [sheetOnly]);

  return (
    <OnePagerShell
      onePagerId="prizes"
      rootClassName="one-pager-prizes-root"
      showLanguageToggle
      printLabel={tp("print")}
      previewScaleAria={tp("previewScaleAria")}
      includeLangInPrintParams
    >
      {renderPrizesSheet(tp, t, language)}
    </OnePagerShell>
  );
}

function PerkMark({ logo, sponsor }: { logo: PerkLogo; sponsor: string }) {
  const cls = "h-3 w-auto max-w-[72px] shrink-0 object-contain";
  switch (logo) {
    case "cursor":
      return <CursorLockup alt={sponsor} className={cls} />;
    case "codex":
      return <CodexLogo alt={sponsor} className="h-4 w-auto max-w-[84px] shrink-0 object-contain" />;
    case "elevenlabs":
      return <ElevenLabsLogo alt={sponsor} className={cls} />;
    case "n8n":
      return <N8nLogo alt={sponsor} className={cls} />;
    case "zavu":
      return <ZavuLogo alt={sponsor} className={cls} />;
    case null:
      return (
        <span className="font-display text-[8pt] font-bold uppercase leading-none tracking-tight text-fg">
          {sponsor}
        </span>
      );
    default: {
      const _exhaustive: never = logo;
      return _exhaustive;
    }
  }
}

function renderPrizesSheet(
  tp: (suffix: string) => string,
  t: (key: TranslationKey) => string,
  language: Language,
): ReactElement {
  return (
    <OnePagerCashLightLogoAssetsProvider>
      <OnePagerSheetFrame
        sheetClassName="one-pager-sheet-square text-[8.5pt] leading-snug"
        contentClassName="relative flex h-full min-h-0 flex-col"
      >
          <header className="shrink-0">
            <p className="font-mono text-[0.56rem] font-bold uppercase tracking-[0.2em] text-accent">
              {tp("headerKicker")}
            </p>
            <div className="mt-1 flex items-end justify-between gap-4">
              <h1 className="font-display text-[1.6rem] font-bold uppercase leading-[0.95] tracking-tight">
                {tp("heroLine1")}
                <br />
                {tp("heroLine2")}
              </h1>
              <p className="shrink-0 pb-0.5 text-right font-mono text-[0.55rem] leading-snug text-fg-2">
                {tp("bringTeam")}
                <br />
                <span className="font-semibold text-fg">{SITE_DISPLAY}</span>
              </p>
            </div>
          </header>

          <section
            className="mt-2.5 grid shrink-0 grid-cols-2 overflow-hidden rounded-md bg-accent text-white"
            aria-label={tp("totalsAria")}
          >
            <div className="border-r border-white/25 px-3.5 py-2.5">
              <p className="font-display text-[1.7rem] font-bold leading-none tracking-tight">
                {CREDITS_TOTAL}
              </p>
              <p className="mt-1 font-mono text-[0.5rem] font-bold uppercase tracking-[0.14em] text-white/85">
                {tp("creditsLabel")}
              </p>
            </div>
            <div className="px-3.5 py-2.5">
              <p className="font-display text-[1.7rem] font-bold leading-none tracking-tight">
                {PRIZES_TOTAL}
              </p>
              <p className="mt-1 font-mono text-[0.5rem] font-bold uppercase tracking-[0.14em] text-white/85">
                {tp("prizesLabel")}
              </p>
            </div>
          </section>

          <section className="mt-2.5 shrink-0" aria-label={tp("allParticipants")}>
            <SquareSectionTitle badge={`${CREDITS_TOTAL} ${tp("perBuilderBadge")}`}>
              {tp("allParticipants")}
            </SquareSectionTitle>
            <div className="grid grid-cols-2 gap-x-5">
              {PARTICIPANT_PERK_DEFS.map((perk) => (
                <div
                  key={perk.id}
                  className="flex min-w-0 items-center justify-between gap-2 border-b border-border-faint py-[0.32rem]"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <PerkMark logo={perk.logo} sponsor={perk.sponsor} />
                    <span className="min-w-0 truncate text-[6.9pt] leading-tight text-fg-3">
                      {tp(`perk.${perk.id}`)}
                    </span>
                  </div>
                  <span className="shrink-0 font-display text-[8pt] font-bold tabular-nums text-accent">
                    {perk.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-2.5 shrink-0" aria-label={tp("sponsorTracks")}>
            <SquareSectionTitle badge={tp("perMemberBadge")}>{tp("sponsorTracks")}</SquareSectionTitle>
            <div>
              {TRACK_PRIZE_DEFS.map((track, i) => (
                <div
                  key={track.id}
                  className={`grid grid-cols-[5.2rem_minmax(0,1fr)_auto] items-center gap-3 py-[0.42rem] ${i > 0 ? "border-t border-border-faint" : ""}`}
                >
                  <div className="flex items-center">
                    <PerkMark logo={track.logo} sponsor={track.sponsor} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-[8pt] font-bold uppercase leading-tight tracking-tight text-fg">
                      {tp(`track.${track.id}.title`)}
                    </p>
                    <p className="text-[6.8pt] leading-snug text-fg-3">{tp(`track.${track.id}.prize`)}</p>
                  </div>
                  <p className="shrink-0 text-right font-display text-[0.95rem] font-bold leading-none tracking-tight text-accent">
                    {track.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-2.5 min-h-0 flex-1" aria-label={tp("overallWinners")}>
            <SquareSectionTitle badge={tp("cashCreditsBadge")}>{tp("overallWinners")}</SquareSectionTitle>
            <div className="grid h-[calc(100%-1.45rem)] grid-cols-[1.25fr_1fr_1fr] gap-2">
              {OVERALL_PRIZE_DEFS.map((prize, i) => {
                const isFirst = i === 0;
                const combinedTotal = formatApproxDollarDisplay(
                  computeCombinedPrizeTotal(prize.cash, prize.credits),
                  language,
                  { compact: true },
                );
                const lineValueClass = `shrink-0 font-display text-[7.5pt] font-bold tabular-nums leading-none ${
                  isFirst ? "text-white" : "text-accent"
                }`;
                const lineLabelClass = `min-w-0 text-[6.4pt] leading-snug ${
                  isFirst ? "text-white/95" : "text-fg-2"
                }`;
                const bulletClass = `mt-[0.32em] block size-1 shrink-0 rounded-full ${
                  isFirst ? "bg-white/80" : "bg-accent"
                }`;

                return (
                  <div
                    key={prize.placeId}
                    className={`overall-prize-card flex min-w-0 flex-col justify-between rounded-md px-3 py-2.5 ${
                      isFirst
                        ? "bg-accent text-white"
                        : "border border-border bg-bg-raised"
                    }`}
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <p
                          className={`font-mono text-[0.5rem] font-bold uppercase tracking-[0.16em] ${isFirst ? "text-white/80" : "text-fg-3"}`}
                        >
                          {tp(`place.${prize.placeId}`)}
                        </p>
                        <p
                          className={`font-display text-[1.3rem] font-bold leading-none tracking-tight ${isFirst ? "text-white" : "text-accent"}`}
                        >
                          {combinedTotal}
                        </p>
                      </div>
                      <p
                        className={`mt-0.5 text-right text-[6.4pt] font-medium ${isFirst ? "text-white/85" : "text-fg-3"}`}
                      >
                        {tp("overall.combinedLabel")}
                      </p>
                    </div>
                    <ul
                      className={`overall-prize-lines mt-1.5 space-y-[0.28rem] ${isFirst ? "text-white/95" : "text-fg-2"}`}
                    >
                      <li className="overall-prize-line flex items-start justify-between gap-2">
                        <span className={`flex min-w-0 items-start gap-1.5 ${lineLabelClass}`}>
                          <span className={bulletClass} aria-hidden />
                          <span>{tp("overall.cashLabel")}</span>
                        </span>
                        <span className={lineValueClass}>{prize.cash}</span>
                      </li>
                      {prize.credits.map((credit) => {
                        const projectedTotal = formatApproxDollarDisplay(
                          computePerMemberCreditTotal(credit.value),
                          language,
                        );
                        return (
                          <li
                            key={credit.labelKey}
                            className="overall-prize-line flex items-start justify-between gap-2"
                          >
                            <span className={`flex min-w-0 items-start gap-1.5 ${lineLabelClass}`}>
                              <span className={bulletClass} aria-hidden />
                              <span>{t(credit.labelKey)}</span>
                            </span>
                            <span className="shrink-0 text-right">
                              <span className={lineValueClass}>{projectedTotal}</span>
                              <span
                                className={`mt-0.5 block text-[5.8pt] font-normal tabular-nums leading-none ${
                                  isFirst ? "text-white/75" : "text-fg-3"
                                }`}
                              >
                                {tp("overall.creditMultiplier")
                                  .replace("{count}", String(OVERALL_PRIZE_PROJECTION_MEMBERS))
                                  .replace("{perMember}", credit.value)}
                              </span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
            <p className="mt-1.5 text-[6pt] leading-snug text-fg-3">{tp("overall.projectionFootnote")}</p>
          </section>

          <footer className="mt-2 shrink-0 border-t border-border pt-1.5">
            <div className="flex items-baseline justify-between gap-4 font-mono text-[0.48rem] uppercase tracking-[0.12em] text-fg-3">
              <p>{tp("footerNote")}</p>
              <p className="shrink-0 font-semibold text-accent">{SITE_DISPLAY}</p>
            </div>
          </footer>
      </OnePagerSheetFrame>
    </OnePagerCashLightLogoAssetsProvider>
  );
}

function SquareSectionTitle({ badge, children }: { badge: string; children: ReactNode }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2 border-b border-border pb-0.5">
      <h2 className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.12em] text-fg">
        {children}
      </h2>
      <span className="font-mono text-[0.46rem] font-semibold uppercase tracking-[0.14em] text-accent">
        {badge}
      </span>
    </div>
  );
}
