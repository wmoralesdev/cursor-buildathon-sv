import type { ReactElement } from "react";
import { useMemo } from "react";

import { OnePagerShell } from "../components/one-pager-shell";
import { OnePagerSheetFrame } from "../components/one-pager-sheet-frame";
import { CursorLockup, OnePagerCashLightLogoAssetsProvider } from "../components/sponsor-logos";
import { useTranslation } from "../context/language-context";
import { AILABS_URL, EVENT_VENUE_FULL } from "../constants";
import type { TranslationKey } from "../i18n/translations";
import "../styles/one-pager-print.css";
import "../styles/mentor-one-pager.css";

const UFG_URL = "https://ufg.edu.sv/";

const WHAT_ITEM_SUFFIXES = ["what.i0", "what.i1", "what.i2", "what.i3"] as const;
const HOW_ITEM_SUFFIXES = ["how.i0", "how.i1", "how.i2"] as const;
const CAN_ITEM_SUFFIXES = ["can.i0", "can.i1", "can.i2"] as const;
const CANNOT_ITEM_SUFFIXES = ["cannot.i0", "cannot.i1", "cannot.i2"] as const;
const PROMOTION_ITEM_SUFFIXES = ["promotion.i0", "promotion.i1", "promotion.i2"] as const;
const TIPS_ITEM_SUFFIXES = ["tips.i0", "tips.i1", "tips.i2"] as const;

export function SobrecupoOnePagerPage() {
  const { t } = useTranslation();

  const ts = useMemo(
    () => (suffix: string) => t(`onePager.sobrecupo.${suffix}` as TranslationKey),
    [t],
  );

  const siteDisplay =
    typeof import.meta.env.VITE_SITE_URL === "string" && import.meta.env.VITE_SITE_URL.length > 0
      ? import.meta.env.VITE_SITE_URL.replace(/^https?:\/\//, "").replace(/\/+$/, "")
      : ts("fallbackSite");

  return (
    <OnePagerShell
      onePagerId="sobrecupo"
      rootDataAttrs={{ "data-onepager-sobrecupo": "" }}
      showLanguageToggle
      printLabel={ts("print")}
      previewScaleAria={ts("previewScaleAria")}
      includeLangInPrintParams
    >
      <OnePagerCashLightLogoAssetsProvider>
        {renderSobrecupoSheet(ts, siteDisplay)}
      </OnePagerCashLightLogoAssetsProvider>
    </OnePagerShell>
  );
}

function renderSobrecupoSheet(
  ts: (suffix: string) => string,
  siteDisplay: string,
): ReactElement {
  return (
    <OnePagerSheetFrame sheetClassName="one-pager-sheet-fit text-[9pt] leading-snug">
      <header className="one-pager-avoid-break mb-2.5">
        <div className="one-pager-header-meta-bar flex items-center justify-between gap-4 border-b border-border pb-2">
          <div className="flex min-w-0 items-center gap-3">
            <CursorLockup alt="Cursor" className="h-[1.15rem] w-auto shrink-0" />
            <span className="h-4 w-px shrink-0 bg-border" aria-hidden />
            <p className="min-w-0 truncate font-display text-[0.85rem] font-bold uppercase leading-none tracking-tight">
              {ts("eventName")}{" "}
              <span className="font-mono text-[0.54rem] font-semibold tracking-[0.14em] text-fg-3">
                {ts("eventPlace")}
              </span>
            </p>
          </div>
          <div className="one-pager-header-meta shrink-0 text-right font-mono text-[0.65rem] leading-snug text-fg-2">
            <p>
              {ts("headerWhenWhere")}
              {" · "}
              <a href={UFG_URL} className="font-semibold text-fg underline underline-offset-2">
                UFG
              </a>
            </p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between gap-4">
          <h1 className="min-w-0 font-display text-[1.45rem] font-bold uppercase leading-none tracking-tight">
            {ts("heroTitle")}
          </h1>
          <p className="shrink-0 font-mono text-[0.5rem] font-bold uppercase tracking-[0.16em] text-accent">
            {ts("kicker")}
          </p>
        </div>
      </header>

      <section
        className="one-pager-deadline-banner one-pager-avoid-break mb-2.5 overflow-hidden rounded-md bg-accent text-white"
        aria-label={ts("summaryAria")}
      >
        <div className="one-pager-deadline-banner__inner grid grid-cols-[1fr_auto] items-center gap-x-4 px-3.5 py-2.5">
          <div className="min-w-0">
            <p className="font-mono text-[0.48rem] font-bold uppercase tracking-[0.14em] text-white/80">
              {ts("summaryKicker")}
            </p>
            <p className="mt-1 text-[7.2pt] leading-relaxed text-white/92">{ts("summaryBody")}</p>
          </div>
          <p className="one-pager-deadline-banner__date shrink-0 text-right font-display text-[1.55rem] font-bold leading-none tracking-tight">
            {ts("summaryHighlight")}
          </p>
        </div>
      </section>

      <section className="one-pager-avoid-break mb-2.5 overflow-hidden rounded-md border border-border bg-bg-raised">
        <div className="one-pager-cols-main grid grid-cols-[1.05fr_0.95fr]">
          <div className="min-w-0 border-r border-border">
            <SectionTitle>{ts("whatTitle")}</SectionTitle>
            <p className="border-b border-border px-2.5 py-1.5 text-[6.9pt] leading-relaxed text-fg-2">
              {ts("whatIntro")}
            </p>
            <ul className="px-2.5 py-1.5 text-[6.9pt]">
              {WHAT_ITEM_SUFFIXES.map((suffix) => (
                <li
                  key={suffix}
                  className="flex items-start gap-2 border-b border-border-faint py-1 last:border-b-0"
                >
                  <span
                    className="mt-[0.28em] block size-[3px] shrink-0 rounded-full bg-accent"
                    aria-hidden
                  />
                  <span className="text-fg-2">{ts(suffix)}</span>
                </li>
              ))}
            </ul>

            <SectionTitle>{ts("howTitle")}</SectionTitle>
            <p className="border-b border-border px-2.5 py-1.5 text-[6.9pt] leading-relaxed text-fg-2">
              {ts("howIntro")}
            </p>
            <ol className="px-2.5 py-1.5 text-[6.9pt]">
              {HOW_ITEM_SUFFIXES.map((suffix, i) => (
                <li
                  key={suffix}
                  className="flex items-start gap-2 border-b border-border-faint py-1 last:border-b-0"
                >
                  <span className="one-pager-step-num mt-px shrink-0">{i + 1}</span>
                  <span className="text-fg-2">{ts(suffix)}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="min-w-0">
            <SectionTitle>{ts("canTitle")}</SectionTitle>
            <p className="border-b border-border px-2.5 py-1.5 text-[6.8pt] leading-relaxed text-fg-2">
              {ts("canIntro")}
            </p>
            <ul className="px-2.5 py-1.5 text-[6.9pt]">
              {CAN_ITEM_SUFFIXES.map((suffix) => (
                <li
                  key={suffix}
                  className="flex items-start gap-2 border-b border-border-faint py-1 last:border-b-0"
                >
                  <span
                    className="mt-[0.28em] block size-[3px] shrink-0 rounded-full bg-accent"
                    aria-hidden
                  />
                  <span className="text-fg-2">{ts(suffix)}</span>
                </li>
              ))}
            </ul>

            <SectionTitle>{ts("cannotTitle")}</SectionTitle>
            <p className="border-b border-border px-2.5 py-1.5 text-[6.8pt] leading-relaxed text-fg-2">
              {ts("cannotIntro")}
            </p>
            <ul className="px-2.5 py-1.5 text-[6.9pt]">
              {CANNOT_ITEM_SUFFIXES.map((suffix) => (
                <li
                  key={suffix}
                  className="flex items-start gap-2 border-b border-border-faint py-1 last:border-b-0"
                >
                  <span
                    className="mt-[0.28em] block size-[3px] shrink-0 rounded-full bg-fg-3"
                    aria-hidden
                  />
                  <span className="text-fg-2">{ts(suffix)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="one-pager-avoid-break border-t border-accent/25 bg-accent/[0.04] px-2.5 py-2"
          aria-label={ts("promotionAria")}
        >
          <p className="font-mono text-[0.48rem] font-bold uppercase tracking-[0.12em] text-accent">
            {ts("promotionTitle")}
          </p>
          <p className="mt-0.5 text-[6.8pt] leading-relaxed text-fg-2">{ts("promotionIntro")}</p>
          <ul className="mt-1 space-y-0.5 text-[6.6pt] leading-snug text-fg-2">
            {PROMOTION_ITEM_SUFFIXES.map((suffix) => (
              <li key={suffix} className="flex items-start gap-1">
                <span
                  className="mt-[0.28em] block size-[3px] shrink-0 rounded-full bg-accent"
                  aria-hidden
                />
                <span>{ts(suffix)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-accent/25 bg-accent/[0.04] px-2.5 py-2">
          <p className="font-mono text-[0.48rem] font-bold uppercase tracking-[0.12em] text-accent">
            {ts("sharingTitle")}
          </p>
          <p className="mt-0.5 text-[6.8pt] leading-relaxed text-fg-2">{ts("sharingBody")}</p>
        </div>

        <div className="border-t border-border bg-bg px-2.5 py-2">
          <p className="font-mono text-[0.48rem] font-bold uppercase tracking-[0.12em] text-fg">
            {ts("tipsTitle")}
          </p>
          <ul className="mt-1 space-y-0.5 text-[6.6pt] leading-snug text-fg-2">
            {TIPS_ITEM_SUFFIXES.map((suffix) => (
              <li key={suffix} className="flex items-start gap-1">
                <span
                  className="mt-[0.28em] block size-[3px] shrink-0 rounded-full bg-accent"
                  aria-hidden
                />
                <span>{ts(suffix)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-3 border-t border-border bg-bg px-2.5 py-1.5">
          <p className="font-mono text-[0.48rem] font-bold uppercase tracking-[0.12em] text-fg-3">
            {ts("eventTitle")}
          </p>
          <p className="text-[6.8pt] leading-snug text-fg-2">
            {ts("eventBody")}{" "}
            <span className="font-mono text-[0.46rem] font-semibold uppercase tracking-wider text-fg-3">
              · {EVENT_VENUE_FULL}
            </span>
          </p>
        </div>
      </section>

      <footer className="one-pager-footer-block mt-2">
        <div className="grid min-w-0 grid-cols-[1fr_auto] items-start gap-4 border-t border-border pt-1.5 text-[7pt] leading-relaxed text-fg-2">
          <div className="min-w-0">
            <p className="mb-0.5 font-mono text-[0.48rem] font-bold uppercase tracking-wider text-fg">
              {ts("footer.organizersLabel")}
            </p>
            <p>
              <a href={AILABS_URL} className="font-semibold text-fg underline">
                Ai /abs
              </a>
              {ts("footer.organizersLine")}
              <a href={UFG_URL} className="text-fg underline">
                UFG
              </a>
              {ts("footer.organizersTail")}
            </p>
          </div>
          <div className="shrink-0 text-right text-fg-3">
            <p>{ts("footer.place1")}</p>
            <p>{ts("footer.place2")}</p>
          </div>
        </div>

        <p className="mt-1.5 text-center font-mono text-[0.48rem] leading-relaxed text-fg-3">
          <a href="/" className="text-accent underline underline-offset-2">
            {siteDisplay}
          </a>
          {ts("footerCopyright")}
        </p>
      </footer>
    </OnePagerSheetFrame>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="border-b border-border bg-bg px-2.5 py-1.5 font-mono text-[0.55rem] font-bold uppercase tracking-[0.12em] text-fg">
      {children}
    </h2>
  );
}
