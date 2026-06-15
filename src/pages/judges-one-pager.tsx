import type { ReactElement } from "react";
import { useMemo } from "react";

import { OnePagerDeadlineBodyText } from "../components/one-pager-deadline-body-text";
import { OnePagerPartnerLogosRow } from "../components/one-pager-partner-logos-row";
import { OnePagerShell } from "../components/one-pager-shell";
import { OnePagerSheetFrame } from "../components/one-pager-sheet-frame";
import { CursorLockup, OnePagerCashLightLogoAssetsProvider } from "../components/sponsor-logos";
import { useTranslation } from "../context/language-context";
import { AILABS_URL, EVENT_VENUE_FULL, JUDGE_MAILTO } from "../constants";
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

const RUBRIC_ITEM_SUFFIXES = ["rubric.i0", "rubric.i1", "rubric.i2", "rubric.i3", "rubric.i4"] as const;

export function JudgesOnePagerPage() {
  const { t } = useTranslation();

  const tj = useMemo(
    () => (suffix: string) => t(`onePager.judges.${suffix}` as TranslationKey),
    [t],
  );

  const siteDisplay =
    typeof import.meta.env.VITE_SITE_URL === "string" && import.meta.env.VITE_SITE_URL.length > 0
      ? import.meta.env.VITE_SITE_URL.replace(/^https?:\/\//, "").replace(/\/+$/, "")
      : tj("fallbackSite");

  return (
    <OnePagerShell
      onePagerId="judges"
      rootDataAttrs={{ "data-onepager-judges": "" }}
      showLanguageToggle
      printLabel={tj("print")}
      previewScaleAria={tj("previewScaleAria")}
      includeLangInPrintParams
    >
      <OnePagerCashLightLogoAssetsProvider>
        {renderJudgesSheet(tj, siteDisplay)}
      </OnePagerCashLightLogoAssetsProvider>
    </OnePagerShell>
  );
}

function renderJudgesSheet(
  tj: (suffix: string) => string,
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
              {tj("eventName")}{" "}
              <span className="font-mono text-[0.54rem] font-semibold tracking-[0.14em] text-fg-3">
                {tj("eventPlace")}
              </span>
            </p>
          </div>
          <div className="one-pager-header-meta shrink-0 text-right font-mono text-[0.65rem] leading-snug text-fg-2">
            <p>
              {tj("headerWhenWhere")}
              {" · "}
              <a href={UFG_URL} className="font-semibold text-fg underline underline-offset-2">
                UFG
              </a>
            </p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between gap-4">
          <h1 className="min-w-0 font-display text-[1.45rem] font-bold uppercase leading-none tracking-tight">
            {tj("heroTitle")}
          </h1>
          <p className="shrink-0 font-mono text-[0.5rem] font-bold uppercase tracking-[0.16em] text-accent">
            {tj("kicker")}
          </p>
        </div>
      </header>

      <section
        className="one-pager-deadline-banner one-pager-avoid-break mb-2.5 overflow-hidden rounded-md bg-accent text-white"
        aria-label={tj("deadlineAria")}
      >
        <div className="one-pager-deadline-banner__inner grid grid-cols-[1fr_auto] items-center gap-x-4 px-3.5 py-2.5">
          <div className="min-w-0">
            <p className="font-mono text-[0.48rem] font-bold uppercase tracking-[0.14em] text-white/80">
              {tj("deadlineKicker")}
            </p>
            <p className="mt-1 text-[7.2pt] leading-relaxed text-white/92">
              <OnePagerDeadlineBodyText text={tj("deadlineBody")} />
            </p>
          </div>
          <p className="one-pager-deadline-banner__date shrink-0 text-right font-display text-[1.55rem] font-bold leading-none tracking-tight">
            {tj("deadlineDate")}
          </p>
        </div>
      </section>

      <section className="one-pager-avoid-break mb-2.5 overflow-hidden rounded-md border border-border bg-bg-raised">
        <div className="one-pager-cols-main grid grid-cols-[1.05fr_0.95fr]">
          <div className="min-w-0 border-r border-border">
            <SectionTitle>{tj("profileTitle")}</SectionTitle>
            <p className="border-b border-border px-2.5 py-1.5 text-[6.9pt] leading-relaxed text-fg-2">
              {tj("profileIntro")}
            </p>
            <ol className="px-2.5 py-1.5 text-[6.9pt]">
              {PROFILE_ITEM_SUFFIXES.map((suffix, i) => (
                <li
                  key={suffix}
                  className="flex items-start gap-2 border-b border-border-faint py-1 last:border-b-0"
                >
                  <span className="one-pager-step-num mt-px shrink-0">{i + 1}</span>
                  <span className="text-fg-2">{tj(suffix)}</span>
                </li>
              ))}
            </ol>
            <div className="border-t border-accent/25 bg-accent/[0.04] px-2.5 py-2">
              <p className="font-mono text-[0.48rem] font-bold uppercase tracking-[0.12em] text-accent">
                {tj("orgPreparesTitle")}
              </p>
              <p className="mt-0.5 text-[6.8pt] leading-relaxed text-fg-2">{tj("orgPreparesBody")}</p>
              <ul className="mt-1 space-y-0.5 text-[6.6pt] leading-snug text-fg-2">
                {[tj("orgPrepares.i0"), tj("orgPrepares.i1"), tj("orgPrepares.i2")].map((item) => (
                  <li key={item} className="flex items-start gap-1">
                    <span
                      className="mt-[0.28em] block size-[3px] shrink-0 rounded-full bg-accent"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="min-w-0">
            <SectionTitle>{tj("participationTitle")}</SectionTitle>
            <div className="grid grid-cols-2 divide-x divide-border">
              <ParticipationColumn
                title={tj("irlTitle")}
                intro={tj("irlIntro")}
                items={[tj("irl.i0"), tj("irl.i1"), tj("irl.i2")]}
              />
              <ParticipationColumn
                title={tj("onlineTitle")}
                intro={tj("onlineIntro")}
                items={[tj("online.i0"), tj("online.i1"), tj("online.i2")]}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-bg px-2.5 py-2">
          <p className="font-mono text-[0.48rem] font-bold uppercase tracking-[0.12em] text-accent">
            {tj("judgingTitle")}
          </p>
          <p className="mt-0.5 text-[6.8pt] leading-relaxed text-fg-2">{tj("judgingIntro")}</p>
          <ul className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[6.6pt] leading-snug text-fg-2">
            {[tj("judging.i0"), tj("judging.i1"), tj("judging.i2"), tj("judging.i3")].map((item) => (
              <li key={item} className="flex items-start gap-1">
                <span
                  className="mt-[0.28em] block size-[3px] shrink-0 rounded-full bg-accent"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border bg-bg-raised px-2.5 py-2">
          <p className="font-mono text-[0.48rem] font-bold uppercase tracking-[0.12em] text-fg">
            {tj("rubricTitle")}
          </p>
          <p className="mt-0.5 text-[6.7pt] leading-relaxed text-fg-3">{tj("rubricIntro")}</p>
          <ol className="mt-1 space-y-1 text-[6.6pt]">
            {RUBRIC_ITEM_SUFFIXES.map((suffix, i) => (
              <li key={suffix} className="flex items-start gap-2 border-b border-border-faint pb-1 last:border-b-0">
                <span className="one-pager-step-num mt-px shrink-0">{i + 1}</span>
                <span className="text-fg-2">
                  <span className="font-semibold text-fg">{tj(`${suffix}.name`)}</span>
                  {" — "}
                  {tj(`${suffix}.question`)}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-3 border-t border-border bg-bg px-2.5 py-1.5">
          <p className="font-mono text-[0.48rem] font-bold uppercase tracking-[0.12em] text-fg-3">
            {tj("eventTitle")}
          </p>
          <p className="text-[6.8pt] leading-snug text-fg-2">
            {tj("eventBody")}{" "}
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
              {tj("footer.organizersLabel")}
            </p>
            <p>
              <a href={AILABS_URL} className="font-semibold text-fg underline">
                Ai /abs
              </a>
              {tj("footer.organizersLine")}
              <a href={UFG_URL} className="text-fg underline">
                UFG
              </a>
              {tj("footer.organizersTail")}
            </p>
          </div>
          <div className="shrink-0 text-right text-fg-3">
            <p>{tj("footer.place1")}</p>
            <p>{tj("footer.place2")}</p>
          </div>
        </div>

        <OnePagerPartnerLogosRow
          label={tj("footer.partnersLabel")}
          ariaLabel={tj("footer.partnersAria")}
        />

        <div className="one-pager-cta-bar rounded px-3.5 py-2">
          <div className="flex min-w-0 items-center justify-between gap-4">
            <div className="min-w-0">
              <a href={JUDGE_MAILTO} className="font-display text-[10.5pt] font-bold tracking-tight">
                hello@wmorales.dev
              </a>
              <p className="mt-0.5 text-[7pt] leading-relaxed">{tj("ctaEmailHint")}</p>
            </div>
            <span className="shrink-0 font-mono text-[0.48rem] font-bold uppercase tracking-wider">
              {tj("ctaSendInfo")}
            </span>
          </div>
        </div>

        <p className="mt-1.5 text-center font-mono text-[0.48rem] leading-relaxed text-fg-3">
          <a href="/" className="text-accent underline underline-offset-2">
            {siteDisplay}
          </a>
          {tj("footerCopyright")}
        </p>
      </footer>
    </OnePagerSheetFrame>
  );
}

function ParticipationColumn({
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
