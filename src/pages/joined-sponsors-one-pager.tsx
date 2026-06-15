import type { ReactElement, ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import { OnePagerShell } from "../components/one-pager-shell";
import { OnePagerSheetFrame } from "../components/one-pager-sheet-frame";
import { CursorLockup, OnePagerCashLightLogoAssetsProvider } from "../components/sponsor-logos";
import { useTranslation } from "../context/language-context";
import { AILABS_URL } from "../constants";
import type { TranslationKey } from "../i18n/translations";
import "../styles/one-pager-print.css";

const SITE_DISPLAY = "build.cursorelsalvador.com";
const ORGANIZER_EMAIL = "hello@wmorales.dev";
const ORGANIZER_MAILTO =
  "mailto:hello@wmorales.dev?subject=Cursor%20Buildathon%20SV%20-%20Activaci%C3%B3n%20de%20sponsor";
const UFG_URL = "https://ufg.edu.sv/";

const INFO_CARD_IDS = ["date", "venue", "format", "audience"] as const;
const TLDR_ITEM_SUFFIXES = ["i0", "i1", "i2", "i3"] as const;
const ACTION_STEP_IDS = ["01", "02", "03", "04"] as const;
const STAND_ITEM_SUFFIXES = ["i0", "i1", "i2", "i3"] as const;
const TIMELINE_BLOCK_IDS = ["before", "arrival", "during"] as const;
const TIMELINE_ITEM_COUNTS: Record<typeof TIMELINE_BLOCK_IDS[number], number> = {
  before: 3,
  arrival: 3,
  during: 3,
};
const ACTIVATION_ITEM_COUNTS = { opening: 3, content: 3, relations: 3 } as const;
const COVERAGE_ITEM_COUNTS = { brand: 3, talent: 3, post: 2 } as const;

type BentoTileSpan =
  | "opening"
  | "brand"
  | "content"
  | "relations"
  | "post"
  | "talent"
  | "mentors"
  | "email";

export function JoinedSponsorsOnePagerPage() {
  const { t } = useTranslation();

  const tj = useMemo(
    () => (suffix: string) => t(`onePager.joinedSponsors.${suffix}` as TranslationKey),
    [t],
  );

  // Print/PDF: letter sheet carries its own inset — no extra @page margin (matches on-screen sheet).
  useEffect(() => {
    const style = document.createElement("style");
    style.setAttribute("data-onepager-joined-sponsors-page", "");
    style.textContent = "@page { size: letter; margin: 0; }";
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);

  return (
    <OnePagerShell
      onePagerId="sponsors"
      rootDataAttrs={{ "data-onepager-joined-sponsors": "" }}
      showLanguageToggle
      printLabel={tj("print")}
      previewScaleAria={tj("previewScaleAria")}
      includeLangInPrintParams
    >
      <OnePagerCashLightLogoAssetsProvider>
        {renderJoinedSponsorsSheet(tj)}
      </OnePagerCashLightLogoAssetsProvider>
    </OnePagerShell>
  );
}

function renderJoinedSponsorsSheet(tj: (suffix: string) => string): ReactElement {
  const eventDateDisplay = tj("eventDateDisplay");

  return (
    <OnePagerSheetFrame sheetClassName="one-pager-joined-sponsors-sheet text-[7.5pt] leading-snug">
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
                {eventDateDisplay}
                {" · "}
                <a href={UFG_URL} className="font-semibold text-fg underline underline-offset-2">
                  UFG
                </a>
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between gap-4">
            <h1 className="min-w-0 font-display text-[1.32rem] font-bold uppercase leading-none tracking-tight">
              {tj("heroTitle")}
            </h1>
            <p className="shrink-0 font-mono text-[0.5rem] font-bold uppercase tracking-[0.16em] text-accent">
              {tj("kicker")}
            </p>
          </div>
        </header>

      <section
        className="one-pager-avoid-break mb-2.5 overflow-hidden rounded-md border border-border border-l-2 border-l-accent bg-bg-raised px-2.5 py-2"
        aria-label={tj("tldr.aria")}
      >
        <p className="font-mono text-[0.5rem] font-bold uppercase tracking-[0.14em] text-accent">
          {tj("tldr.label")}
        </p>
        <ul className="mt-1 grid gap-0.5">
          {TLDR_ITEM_SUFFIXES.map((suffix) => (
            <li
              key={suffix}
              className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-1.5 text-[6.8pt] leading-snug text-fg-2"
            >
              <span className="one-pager-proof-dot mt-[0.35em]" aria-hidden />
              <span className="min-w-0">{tj(`tldr.${suffix}`)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="one-pager-avoid-break mb-2.5 grid grid-cols-4 overflow-hidden rounded-md border border-border bg-bg-raised">
        {INFO_CARD_IDS.map((id) => (
          <InfoStat
            key={id}
            label={tj(`info.${id}.label`)}
            value={id === "venue" ? tj(`info.${id}.value`) : id === "date" ? eventDateDisplay : tj(`info.${id}.value`)}
            detail={tj(`info.${id}.detail`)}
          />
        ))}
      </section>

      <section className="one-pager-avoid-break mb-2.5 overflow-hidden rounded-md border border-accent/45 bg-[#fff5ef]">
        <div className="grid grid-cols-[0.72fr_1.28fr]">
          <div className="border-r border-accent/25 bg-accent px-3 py-2 text-white">
            <div>
              <p className="font-mono text-[0.5rem] font-bold uppercase tracking-[0.14em] text-white/80">
                {tj("action.kicker")}
              </p>
              <h2 className="mt-1 font-display text-[0.98rem] font-bold uppercase leading-tight tracking-tight">
                {tj("action.title")}
              </h2>
              <p className="mt-1.5 text-[7pt] leading-relaxed text-white/90">{tj("action.body")}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-0">
            {ACTION_STEP_IDS.map((step) => (
              <ActionCard
                key={step}
                step={step}
                title={tj(`action.${step}.title`)}
                body={tj(`action.${step}.body`)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="one-pager-avoid-break mb-2.5 overflow-hidden rounded-md border border-accent/35 bg-[#fff5ef]">
        <div className="border-b border-accent/20 px-2.5 py-1.5">
          <p className="font-mono text-[0.5rem] font-bold uppercase tracking-[0.14em] text-accent">
            {tj("stand.title")}
          </p>
          <p className="mt-0.5 text-[6.7pt] leading-snug text-fg-2">{tj("stand.body")}</p>
        </div>
        <div className="grid grid-cols-4">
          {STAND_ITEM_SUFFIXES.map((suffix) => (
            <StandFact key={suffix} text={tj(`stand.${suffix}`)} />
          ))}
        </div>
      </section>

      <section className="one-pager-avoid-break mb-2.5 rounded-md border border-border bg-bg-raised p-2.5">
        <SectionTitle compact>{tj("timeline.title")}</SectionTitle>
        <div className="grid grid-cols-3 gap-2.5">
          {TIMELINE_BLOCK_IDS.map((id) => (
            <CompactBlock
              key={id}
              stacked
              title={tj(`timeline.${id}.title`)}
              body={tj(`timeline.${id}.body`)}
              items={Array.from({ length: TIMELINE_ITEM_COUNTS[id] }, (_, i) =>
                tj(`timeline.${id}.i${i}`),
              )}
            />
          ))}
        </div>
      </section>

      <section
        className="one-pager-joined-bento mt-0 overflow-hidden rounded-md border border-border bg-bg-raised"
        aria-label={`${tj("activation.title")} · ${tj("coverage.title")}`}
      >
        <div className="one-pager-joined-bento-grid">
          <div className="one-pager-bento-head one-pager-bento-head-activation">
            <SectionTitle compact>{tj("activation.title")}</SectionTitle>
          </div>
          <div className="one-pager-bento-head one-pager-bento-head-coverage">
            <SectionTitle compact>{tj("coverage.title")}</SectionTitle>
          </div>

          <BentoTile span="opening">
            <ActivationCard
              bento
              title={tj("activation.opening.title")}
              body={tj("activation.opening.body")}
              items={Array.from({ length: ACTIVATION_ITEM_COUNTS.opening }, (_, i) =>
                tj(`activation.opening.i${i}`),
              )}
            />
          </BentoTile>

          <BentoTile span="brand">
            <ActivationCard
              bento
              compact
              title={tj("coverage.brand.title")}
              body={tj("coverage.brand.body")}
              items={Array.from({ length: COVERAGE_ITEM_COUNTS.brand }, (_, i) =>
                tj(`coverage.brand.i${i}`),
              )}
            />
          </BentoTile>

          <BentoTile span="content">
            <ActivationCard
              bento
              title={tj("activation.content.title")}
              body={tj("activation.content.body")}
              items={Array.from({ length: ACTIVATION_ITEM_COUNTS.content }, (_, i) =>
                tj(`activation.content.i${i}`),
              )}
            />
          </BentoTile>

          <BentoTile span="relations">
            <ActivationCard
              bento
              title={tj("activation.relations.title")}
              body={tj("activation.relations.body")}
              items={Array.from({ length: ACTIVATION_ITEM_COUNTS.relations }, (_, i) =>
                tj(`activation.relations.i${i}`),
              )}
            />
          </BentoTile>

          <BentoTile span="post">
            <ActivationCard
              bento
              compact
              title={tj("coverage.post.title")}
              body={tj("coverage.post.body")}
              items={Array.from({ length: COVERAGE_ITEM_COUNTS.post }, (_, i) =>
                tj(`coverage.post.i${i}`),
              )}
            />
          </BentoTile>

          <BentoTile span="talent">
            <ActivationCard
              bento
              title={tj("coverage.talent.title")}
              body={tj("coverage.talent.body")}
              items={Array.from({ length: COVERAGE_ITEM_COUNTS.talent }, (_, i) =>
                tj(`coverage.talent.i${i}`),
              )}
            />
          </BentoTile>

          <BentoTile span="mentors">
            <p className="font-mono text-[0.5rem] font-bold uppercase tracking-[0.14em] text-accent">
              {tj("mentorsAside.title")}
            </p>
            <p className="mt-1 text-[6.8pt] leading-snug text-fg-2">
              {tj("mentorsAside.body")}{" "}
              <Link
                to="/onepager-judges"
                className="font-semibold text-accent underline underline-offset-2"
              >
                {tj("mentorsAside.judgeGuideLink")}
              </Link>
            </p>
          </BentoTile>

          <BentoTile span="email" warm>
            <p className="font-mono text-[0.52rem] font-bold uppercase tracking-[0.14em] text-accent">
              {tj("coordinate.title")}
            </p>
            <p className="mt-1 text-[6.9pt] leading-snug text-fg-2">{tj("coordinate.body")}</p>
          </BentoTile>
        </div>
      </section>

      <footer className="one-pager-footer-block mt-2">
        <div className="one-pager-cta-bar rounded px-3 py-1.5">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <a href={ORGANIZER_MAILTO} className="font-display text-[11pt] font-bold tracking-tight">
                {ORGANIZER_EMAIL}
              </a>
              <p className="mt-0.5 text-[7pt] leading-snug">{tj("cta.body")}</p>
            </div>
            <span className="shrink-0 font-mono text-[0.5rem] font-bold uppercase tracking-wider">
              {tj("cta.badge")}
            </span>
          </div>
        </div>

        <p className="mt-1.5 text-center font-mono text-[0.5rem] leading-relaxed text-fg-3">
          {tj("footer.organizedBy")}{" "}
          <a href={AILABS_URL} className="text-accent underline underline-offset-2">
            Ai /abs
          </a>{" "}
          {tj("footer.organizersTail")}{" "}
          <a href="/" className="text-accent underline underline-offset-2">
            {SITE_DISPLAY}
          </a>
        </p>
      </footer>
    </OnePagerSheetFrame>
  );
}

function SectionTitle({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <h2 className={`${compact ? "mb-1" : "mb-1.5"} w-full max-w-full border-b border-border pb-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-[0.12em] text-fg`}>
      {children}
    </h2>
  );
}

function InfoStat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="min-w-0 border-r border-bg-alt px-2 py-2 last:border-r-0">
      <p className="font-mono text-[0.44rem] font-bold uppercase tracking-[0.12em] text-accent">
        {label}
      </p>
      <p className="mt-0.5 font-display text-[0.88rem] font-bold uppercase leading-none tracking-tight text-fg">
        {value}
      </p>
      <p className="mt-1 text-[6.2pt] leading-snug text-fg-3">{detail}</p>
    </div>
  );
}

function ActionCard({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-2 border-b border-r border-accent/20 px-2.5 py-2 [&:nth-child(2n)]:border-r-0 [&:nth-last-child(-n+2)]:border-b-0">
      <span className="mt-px font-mono text-[0.48rem] font-bold uppercase tracking-[0.1em] text-accent">
        {step}
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[0.49rem] font-bold uppercase tracking-[0.1em] text-fg">
          {title}
        </p>
        <p className="mt-0.5 text-[6.7pt] leading-snug text-fg-2">{body}</p>
      </div>
    </div>
  );
}

function StandFact({ text }: { text: string }) {
  return (
    <div className="min-w-0 border-r border-accent/15 px-2 py-1.5 last:border-r-0">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-1.5">
        <span className="one-pager-proof-dot mt-[0.35em]" aria-hidden />
        <p className="text-[6.5pt] leading-snug text-fg-2">{text}</p>
      </div>
    </div>
  );
}

function CompactBlock({
  title,
  body,
  items,
  stacked = false,
}: {
  title: string;
  body: string;
  items: string[];
  stacked?: boolean;
}) {
  if (stacked) {
    return (
      <article className="min-w-0">
        <p className="font-mono text-[0.48rem] font-bold uppercase tracking-[0.12em] text-accent">
          {title}
        </p>
        <p className="mt-0.5 text-[6.4pt] leading-snug text-fg-2">{body}</p>
        <ul className="mt-1 grid gap-0.5 text-[6.2pt] leading-snug text-fg-3">
          {items.map((item) => (
            <li key={item} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-1.5">
              <span className="one-pager-proof-dot mt-[0.32em]" aria-hidden />
              <span className="min-w-0">{item}</span>
            </li>
          ))}
        </ul>
      </article>
    );
  }

  return (
    <article className="min-w-0 border-b border-border pb-2 last:border-b-0 last:pb-0">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2">
        <span className="one-pager-proof-dot mt-[0.42em]" aria-hidden />
        <div className="min-w-0">
          <p className="font-mono text-[0.48rem] font-bold uppercase tracking-[0.12em] text-accent">
            {title}
          </p>
          <p className="mt-0.5 text-[6.6pt] leading-snug text-fg-2">{body}</p>
          <p className="mt-0.5 text-[6.3pt] leading-snug text-fg-3">{items.join(" ")}</p>
        </div>
      </div>
    </article>
  );
}

function BentoTile({
  span,
  featured = false,
  warm = false,
  children,
}: {
  span: BentoTileSpan;
  featured?: boolean;
  warm?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`one-pager-bento-tile one-pager-bento-tile-${span} min-w-0 p-2 ${
        featured ? "one-pager-bento-tile-featured" : warm ? "bg-[#fff5ef]" : ""
      }`}
    >
      {children}
    </div>
  );
}

function ActivationCard({
  title,
  body,
  items,
  compact = false,
  bento = false,
}: {
  title: string;
  body: string;
  items: string[];
  compact?: boolean;
  bento?: boolean;
}) {
  const content = (
    <>
      <p className="font-mono text-[0.5rem] font-bold uppercase tracking-[0.14em] text-accent">
        {title}
      </p>
      <p className="mt-1 text-[6.9pt] leading-relaxed text-fg-2">{body}</p>
      <ul className={`${compact ? "mt-1" : "mt-1.5"} grid gap-0.5 text-[6.6pt] leading-snug text-fg-2`}>
        {items.map((item) => (
          <li key={item} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-1.5">
            <span className="one-pager-proof-dot mt-[0.35em]" aria-hidden />
            <span className="min-w-0">{item}</span>
          </li>
        ))}
      </ul>
    </>
  );

  if (bento) {
    return <article className="min-w-0">{content}</article>;
  }

  return (
    <article className="one-pager-avoid-break min-w-0 rounded-md border border-border bg-bg-raised p-2">
      {content}
    </article>
  );
}
