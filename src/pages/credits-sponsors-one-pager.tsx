import type { ReactElement, ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { OnePagerShell } from "../components/one-pager-shell";
import { OnePagerSheetFrame } from "../components/one-pager-sheet-frame";
import {
  CursorLockup,
  DatamcpLogo,
  OnePagerBrandLogo,
  OnePagerCashLightLogoAssetsProvider,
  ZavuLogo,
} from "../components/sponsor-logos";
import { useTranslation } from "../context/language-context";
import { AILABS_URL } from "../constants";
import type { TranslationKey } from "../i18n/translations";
import {
  BUILDER_PERK_TOTAL,
  CREDIT_PARTNERS,
  CREDIT_EVENT_TOTAL,
  CREDIT_PER_TEAM_TOTAL,
  formatCreditPartnerValue,
  type CreditPartner,
  type CreditPartnerId,
} from "../lib/credits-sponsor-sections";
import "../styles/one-pager-print.css";
import "../styles/prizes-square.css";
import "../styles/credits-square.css";

const SITE_DISPLAY = "build.cursorelsalvador.com";
const UFG_URL = "https://ufg.edu.sv/";

const PARTNER_LABELS: Record<CreditPartnerId, string> = {
  codex: "Codex",
  n8n: "n8n",
  zavu: "Zavu",
  cursor: "Cursor",
  elevenlabs: "ElevenLabs",
  firecrawl: "Firecrawl",
  datamcp: "DataMCP",
  exa: "Exa",
  fal: "Fal",
  netlify: "Netlify",
  wispr: "Wispr Flow",
  cognition: "Cognition",
};

const LOGO_CLASS = "h-[1.04rem] w-auto max-w-[4.6rem] shrink-0 object-contain";

/** Per-logo size overrides where the default cap-height reads too small. */
const LOGO_CLASS_BY_ID: Partial<Record<CreditPartnerId, string>> = {
  codex: "h-[1.625rem] w-auto max-w-[7.19rem] shrink-0 object-contain",
  netlify: "h-[1.22rem] w-auto max-w-[5.4rem] shrink-0 object-contain",
};

function logoClassFor(id: CreditPartnerId): string {
  return LOGO_CLASS_BY_ID[id] ?? LOGO_CLASS;
}

export function CreditsSponsorsOnePagerPage() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const tc = useMemo(
    () => (suffix: string) => t(`onePager.credits.${suffix}` as TranslationKey),
    [t],
  );

  const embedOnly =
    searchParams.get("embed") === "1" || searchParams.get("embed") === "true";
  const sheetOnly =
    embedOnly &&
    (searchParams.get("sheet") === "1" || searchParams.get("sheet") === "true");

  useEffect(() => {
    if (!sheetOnly) return;
    const style = document.createElement("style");
    style.setAttribute("data-onepager-credits-page", "");
    style.textContent = "@page { size: 7.5in 7.5in; margin: 0; }";
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, [sheetOnly]);

  return (
    <OnePagerShell
      onePagerId="credits"
      rootClassName="one-pager-credits-root"
      showLanguageToggle
      printLabel={tc("print")}
      previewScaleAria={tc("previewScaleAria")}
      includeLangInPrintParams
    >
      <OnePagerCashLightLogoAssetsProvider>
        {renderCreditsSponsorsSheet(tc)}
      </OnePagerCashLightLogoAssetsProvider>
    </OnePagerShell>
  );
}

function CreditPartnerMark({ id }: { id: CreditPartnerId }) {
  const alt = PARTNER_LABELS[id];
  const className = logoClassFor(id);

  if (id === "cursor") {
    return <CursorLockup alt={alt} className={className} />;
  }

  if (id === "zavu") {
    return <ZavuLogo alt={alt} className={className} />;
  }

  // DataMCP ships as a colored isotype only — desaturate it and pair it with a
  // wordmark sized to match the neighboring logo lockups.
  if (id === "datamcp") {
    return (
      <span className="flex min-w-0 items-center gap-1.5">
        <DatamcpLogo
          alt={alt}
          className="h-[1.04rem] w-auto shrink-0 object-contain grayscale"
        />
        <span className="font-display text-[8pt] font-semibold leading-none tracking-tight text-fg">
          DataMCP
        </span>
      </span>
    );
  }

  return <OnePagerBrandLogo id={id} alt={alt} className={className} />;
}

function CreditPartnerRow({
  partner,
  perkText,
  newTag,
  newTagAria,
}: {
  partner: CreditPartner;
  perkText: string;
  newTag: string;
  newTagAria: string;
}) {
  const valueDisplay = formatCreditPartnerValue(partner);
  return (
    <div className="one-pager-credit-row flex min-w-0 items-center gap-2.5">
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span className="flex w-[5.3rem] shrink-0 items-center">
          <CreditPartnerMark id={partner.id} />
        </span>
        <span className="min-w-0 truncate text-[7pt] leading-tight text-fg-3">
          {perkText}
        </span>
        {partner.isNew ? (
          <span className="one-pager-credit-new-tag" aria-label={newTagAria}>
            {newTag}
          </span>
        ) : null}
      </span>
      <span className="shrink-0 text-right">
        <span className="font-display text-[9pt] font-bold tabular-nums leading-none text-accent">
          {valueDisplay}
        </span>
        {partner.perTeam ? (
          <span className="ml-1 font-mono text-[5.6pt] font-semibold uppercase tracking-[0.08em] text-fg-3">
            /team
          </span>
        ) : null}
      </span>
    </div>
  );
}

function renderCreditsSponsorsSheet(tc: (suffix: string) => string): ReactElement {
  const newTag = tc("newTag");
  const newTagAria = tc("newTagAria");

  return (
    <OnePagerSheetFrame
      sheetClassName="one-pager-sheet-square one-pager-credits-square text-[8.5pt] leading-snug"
      contentClassName="relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden"
    >
      <header className="shrink-0">
        <div className="flex items-center justify-between gap-3">
          <CursorLockup alt="Cursor" className="h-[1.05rem] w-auto shrink-0" />
          <p className="shrink-0 text-right font-mono text-[0.5rem] leading-snug text-fg-2">
            {tc("headerWhenWhere")}
            {" · "}
            <a href={UFG_URL} className="font-semibold text-fg underline underline-offset-2">
              UFG
            </a>
          </p>
        </div>
        <p className="mt-1.5 font-mono text-[0.56rem] font-bold uppercase tracking-[0.2em] text-accent">
          {tc("kicker")}
        </p>
        <div className="mt-1 flex items-end justify-between gap-4">
          <h1 className="font-display text-[1.55rem] font-bold uppercase leading-[0.95] tracking-tight">
            {tc("heroTitle")}
          </h1>
          <p className="max-w-[15rem] shrink-0 pb-0.5 text-right text-[6.6pt] leading-snug text-fg-2">
            {tc("intro")}
          </p>
        </div>
      </header>

      <section
        className="mt-2.5 grid shrink-0 grid-cols-[1.5fr_1fr_1fr] overflow-hidden rounded-md bg-accent text-white"
        aria-label={tc("statsAria")}
      >
        <div className="border-r border-white/25 px-3.5 py-2.5">
          <p className="font-display text-[1.75rem] font-bold leading-none tracking-tight">
            ${BUILDER_PERK_TOTAL}
          </p>
          <p className="mt-1 font-mono text-[0.46rem] font-bold uppercase tracking-[0.12em] text-white/85">
            {tc("totalLabel")}
          </p>
        </div>
        <div className="border-r border-white/25 px-3 py-2.5">
          <p className="font-display text-[1.75rem] font-bold leading-none tracking-tight">
            {CREDIT_PARTNERS.length}
          </p>
          <p className="mt-1 font-mono text-[0.46rem] font-bold uppercase tracking-[0.12em] text-white/85">
            {tc("partnersCountLabel")}
          </p>
        </div>
        <div className="px-3 py-2.5">
          <p className="font-display text-[1.75rem] font-bold tabular-nums leading-none tracking-tight">
            ${(CREDIT_EVENT_TOTAL / 1000).toFixed(1)}K
          </p>
          <p className="mt-1 font-mono text-[0.46rem] font-bold uppercase tracking-[0.12em] text-white/85">
            {tc("eventTotalLabel")}
          </p>
        </div>
      </section>

      <section
        className="mt-2.5 flex min-h-0 flex-1 flex-col"
        aria-label={tc("partnersSection.aria")}
      >
        <CreditsSectionTitle badge={tc("partnersSection.badge")}>
          {tc("partnersSection.title")}
        </CreditsSectionTitle>
        <div className="one-pager-credits-grid min-h-0 flex-1">
          {CREDIT_PARTNERS.map((partner) => (
            <CreditPartnerRow
              key={partner.id}
              partner={partner}
              perkText={tc(`perk.${partner.id}`)}
              newTag={newTag}
              newTagAria={newTagAria}
            />
          ))}
        </div>
        {CREDIT_PER_TEAM_TOTAL > 0 ? (
          <p className="mt-2 shrink-0 text-[6pt] leading-snug text-fg-3">{tc("perTeamNote")}</p>
        ) : null}
      </section>

      <footer className="mt-2.5 shrink-0 border-t border-border pt-1.5">
        <p className="text-center font-mono text-[0.46rem] leading-relaxed text-fg-3">
          {tc("footer.organizedBy")}{" "}
          <a href={AILABS_URL} className="text-accent underline underline-offset-2">
            Ai /abs
          </a>{" "}
          {tc("footer.organizersTail")}{" "}
          <a href="/" className="text-accent underline underline-offset-2">
            {SITE_DISPLAY}
          </a>
          {tc("footerCopyright")}
        </p>
      </footer>
    </OnePagerSheetFrame>
  );
}

function CreditsSectionTitle({ badge, children }: { badge: string; children: ReactNode }) {
  return (
    <div className="one-pager-credits-section-head mb-2 shrink-0 border-b border-border pb-0.5">
      <h2 className="min-w-0 font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-fg">
        {children}
      </h2>
      <span className="one-pager-credits-section-badge font-mono text-[0.44rem] font-semibold uppercase tracking-[0.14em] text-accent">
        {badge}
      </span>
    </div>
  );
}
