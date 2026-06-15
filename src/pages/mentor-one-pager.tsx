import type { ReactElement } from "react";
import { useMemo } from "react";

import { OnePagerPartnerLogosRow } from "../components/one-pager-partner-logos-row";
import { OnePagerShell } from "../components/one-pager-shell";
import { OnePagerSheetFrame } from "../components/one-pager-sheet-frame";
import { CursorLockup, OnePagerCashLightLogoAssetsProvider } from "../components/sponsor-logos";
import { useTranslation } from "../context/language-context";
import { AILABS_URL, EVENT_VENUE_FULL, MENTOR_MAILTO } from "../constants";
import type { TranslationKey } from "../i18n/translations";
import "../styles/one-pager-print.css";
import "../styles/mentor-one-pager.css";

const UFG_URL = "https://ufg.edu.sv/";

const PROFILE_ITEM_SUFFIXES = [
  "profile.i0",
  "profile.i1",
  "profile.i2",
  "profile.i3",
  "profile.i4",
] as const;

export function MentorOnePagerPage() {
  const { t } = useTranslation();

  const tm = useMemo(
    () => (suffix: string) => t(`onePager.mentors.${suffix}` as TranslationKey),
    [t],
  );

  const siteDisplay =
    typeof import.meta.env.VITE_SITE_URL === "string" && import.meta.env.VITE_SITE_URL.length > 0
      ? import.meta.env.VITE_SITE_URL.replace(/^https?:\/\//, "").replace(/\/+$/, "")
      : tm("fallbackSite");

  return (
    <OnePagerShell
      onePagerId="mentors"
      rootDataAttrs={{ "data-onepager-mentors": "" }}
      showLanguageToggle
      printLabel={tm("print")}
      previewScaleAria={tm("previewScaleAria")}
      includeLangInPrintParams
    >
      <OnePagerCashLightLogoAssetsProvider>
        {renderMentorSheet(tm, siteDisplay)}
      </OnePagerCashLightLogoAssetsProvider>
    </OnePagerShell>
  );
}

function renderMentorSheet(
  tm: (suffix: string) => string,
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
                {tm("eventName")}{" "}
                <span className="font-mono text-[0.54rem] font-semibold tracking-[0.14em] text-fg-3">
                  {tm("eventPlace")}
                </span>
              </p>
            </div>
            <div className="one-pager-header-meta shrink-0 text-right font-mono text-[0.65rem] leading-snug text-fg-2">
              <p>
                {tm("headerWhenWhere")}
                {" · "}
                <a href={UFG_URL} className="font-semibold text-fg underline underline-offset-2">
                  UFG
                </a>
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between gap-4">
            <h1 className="min-w-0 font-display text-[1.45rem] font-bold uppercase leading-none tracking-tight">
              {tm("heroTitle")}
            </h1>
            <p className="shrink-0 font-mono text-[0.5rem] font-bold uppercase tracking-[0.16em] text-accent">
              {tm("kicker")}
            </p>
          </div>
        </header>

      <section
        className="one-pager-deadline-banner one-pager-avoid-break mb-2.5 overflow-hidden rounded-md bg-accent text-white"
        aria-label={tm("deadlineAria")}
      >
        <div className="one-pager-deadline-banner__inner grid grid-cols-[1fr_auto] items-center gap-x-4 px-3.5 py-2.5">
          <div className="min-w-0">
            <p className="font-mono text-[0.48rem] font-bold uppercase tracking-[0.14em] text-white/80">
              {tm("deadlineKicker")}
            </p>
            <p className="mt-1 text-[7.2pt] leading-relaxed text-white/92">{tm("deadlineBody")}</p>
          </div>
          <p className="one-pager-deadline-banner__date shrink-0 text-right font-display text-[1.55rem] font-bold leading-none tracking-tight">
            {tm("deadlineDate")}
          </p>
        </div>
      </section>

      <section className="one-pager-avoid-break mb-2.5 overflow-hidden rounded-md border border-border bg-bg-raised">
        <div className="one-pager-cols-main grid grid-cols-[1.05fr_0.95fr]">
          <div className="min-w-0 border-r border-border">
            <SectionTitle>{tm("profileTitle")}</SectionTitle>
            <p className="border-b border-border px-2.5 py-1.5 text-[6.9pt] leading-relaxed text-fg-2">
              {tm("profileIntro")}
            </p>
            <ol className="px-2.5 py-1.5 text-[6.9pt]">
              {PROFILE_ITEM_SUFFIXES.map((suffix, i) => (
                <li
                  key={suffix}
                  className="flex items-start gap-2 border-b border-border-faint py-1 last:border-b-0"
                >
                  <span className="one-pager-step-num mt-px shrink-0">{i + 1}</span>
                  <span className="text-fg-2">{tm(suffix)}</span>
                </li>
              ))}
            </ol>
            <div className="border-t border-accent/25 bg-accent/[0.04] px-2.5 py-2">
              <p className="font-mono text-[0.48rem] font-bold uppercase tracking-[0.12em] text-accent">
                {tm("deliverablesTitle")}
              </p>
              <p className="mt-0.5 text-[6.8pt] leading-relaxed text-fg-2">{tm("deliverablesBody")}</p>
            </div>
          </div>

          <div className="min-w-0">
            <SectionTitle>{tm("availabilityTitle")}</SectionTitle>
            <div className="grid grid-cols-2 divide-x divide-border">
              <AvailabilityColumn
                title={tm("irlTitle")}
                intro={tm("irlIntro")}
                items={[tm("irl.i0"), tm("irl.i1"), tm("irl.i2")]}
              />
              <AvailabilityColumn
                title={tm("remoteTitle")}
                intro={tm("remoteIntro")}
                items={[tm("remote.i0"), tm("remote.i1"), tm("remote.i2")]}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-3 border-t border-border bg-bg px-2.5 py-1.5">
          <p className="font-mono text-[0.48rem] font-bold uppercase tracking-[0.12em] text-fg-3">
            {tm("eventTitle")}
          </p>
          <p className="text-[6.8pt] leading-snug text-fg-2">
            {tm("eventBody")}{" "}
            <span className="font-mono text-[0.46rem] font-semibold uppercase tracking-wider text-fg-3">
              · {EVENT_VENUE_FULL}
            </span>
          </p>
        </div>
      </section>

      <footer className="one-pager-footer-block mt-2">
        <div className="mb-1.5 grid min-w-0 grid-cols-[1fr_auto] items-start gap-4 border-t border-border pt-1.5 text-[7pt] leading-relaxed text-fg-2">
          <div className="min-w-0">
            <p className="mb-0.5 font-mono text-[0.48rem] font-bold uppercase tracking-wider text-fg">
              {tm("footer.organizersLabel")}
            </p>
            <p>
              <a href={AILABS_URL} className="font-semibold text-fg underline">
                Ai /abs
              </a>
              {tm("footer.organizersLine")}
              <a href={UFG_URL} className="text-fg underline">
                UFG
              </a>
              {tm("footer.organizersTail")}
            </p>
          </div>
          <div className="shrink-0 text-right text-fg-3">
            <p>{tm("footer.place1")}</p>
            <p>{tm("footer.place2")}</p>
          </div>
        </div>

        <OnePagerPartnerLogosRow
          label={tm("footer.partnersLabel")}
          ariaLabel={tm("footer.partnersAria")}
        />

        <div className="one-pager-cta-bar rounded px-3.5 py-2">
          <div className="flex min-w-0 items-center justify-between gap-4">
            <div className="min-w-0">
              <a href={MENTOR_MAILTO} className="font-display text-[10.5pt] font-bold tracking-tight">
                hello@wmorales.dev
              </a>
              <p className="mt-0.5 text-[7pt] leading-relaxed">{tm("ctaEmailHint")}</p>
            </div>
            <span className="shrink-0 font-mono text-[0.48rem] font-bold uppercase tracking-wider">
              {tm("ctaSendInfo")}
            </span>
          </div>
        </div>

        <p className="mt-1.5 text-center font-mono text-[0.48rem] leading-relaxed text-fg-3">
          <a href="/" className="text-accent underline underline-offset-2">
            {siteDisplay}
          </a>
          {tm("footerCopyright")}
        </p>
      </footer>
    </OnePagerSheetFrame>
  );
}

function AvailabilityColumn({
  title,
  intro,
  items,
}: {
  title: string;
  intro: string;
  items: string[];
}) {
  return (
    <div className="min-w-0 px-2 py-1.5">
      <h3 className="font-mono text-[0.5rem] font-bold uppercase tracking-[0.1em] text-accent">
        {title}
      </h3>
      <p className="mt-0.5 text-[6.6pt] leading-snug text-fg-3">{intro}</p>
      <ul className="mt-1 space-y-0.5 text-[6.6pt] leading-snug text-fg-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-1">
            <span className="mt-[0.28em] block size-[3px] shrink-0 rounded-full bg-accent" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="border-b border-border bg-bg px-2.5 py-1.5 font-mono text-[0.55rem] font-bold uppercase tracking-[0.12em] text-fg">
      {children}
    </h2>
  );
}
