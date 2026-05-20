import { Printer } from "lucide-react";
import type { CSSProperties, ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import { OnePagerSponsors } from "../components/one-pager-sponsors";
import { OnePagerCashLightLogoAssetsProvider } from "../components/sponsor-logos";
import { useTranslation } from "../context/language-context";
import { AILABS_URL, BOXFUL_SPONSOR_MAILTO, NIU_SPONSOR_MAILTO } from "../constants";
import type { TranslationKey } from "../i18n/translations";
import "../styles/one-pager-print.css";

const UFG_URL = "https://ufg.edu.sv/";

export type LightOnePagerVariant = "niu" | "boxful";

const VARIANT_MAILTO: Record<LightOnePagerVariant, string> = {
  niu: NIU_SPONSOR_MAILTO,
  boxful: BOXFUL_SPONSOR_MAILTO,
};

const ONEPAGER_IMAGE_SRCS = [
  "/onepager/hackathon-cursor-amdp-labs.jpg",
  "/onepager/dsc-2329.jpg",
  "/onepager/dsc-2457.jpg",
] as const;

const SPONSOR_AMOUNT = "$750";

const SPONSOR_BENEFIT_DEFS: { category: string; items: string[] }[] = [
  {
    category: "benefit.talent.category",
    items: ["benefit.talent.i0", "benefit.talent.i1", "benefit.talent.i2"],
  },
  {
    category: "benefit.presence.category",
    items: ["benefit.presence.i0", "benefit.presence.i1", "benefit.presence.i2"],
  },
  {
    category: "benefit.brand.category",
    items: ["benefit.brand.i0", "benefit.brand.i1", "benefit.brand.i2", "benefit.brand.i3"],
  },
  {
    category: "benefit.post.category",
    items: ["benefit.post.i0", "benefit.post.i1", "benefit.post.i2"],
  },
];

const PREMIUM_ADDON_SUFFIXES = ["addon.i0", "addon.i1", "addon.i2"] as const;

const IMG_ALT_SUFFIXES = ["imgAlt1", "imgAlt2", "imgAlt3"] as const;

const LIGHT_PREVIEW_SCALES = [1, 2, 3] as const;
type LightPreviewScale = (typeof LIGHT_PREVIEW_SCALES)[number];

function parseLightEmbedScale(raw: string | null): LightPreviewScale {
  const n = raw == null || raw === "" ? NaN : Number(raw);
  if (n === 2 || n === 3) return n;
  return 1;
}

export function LightOnePagerSheet({ variant }: { variant: LightOnePagerVariant }) {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const { language, setLanguage, t } = useTranslation();
  const [previewScale, setPreviewScale] = useState<LightPreviewScale>(1);
  const embedOnly =
    searchParams.get("embed") === "1" || searchParams.get("embed") === "true";
  const sheetOnly =
    embedOnly &&
    (searchParams.get("sheet") === "1" || searchParams.get("sheet") === "true");
  const embedScale: LightPreviewScale = embedOnly
    ? parseLightEmbedScale(searchParams.get("scale"))
    : 1;
  const shouldAutoPrint =
    embedOnly &&
    (searchParams.get("print") === "1" || searchParams.get("print") === "true");

  const tp = useMemo(() => `onePager.${variant}` as const, [variant]);

  const tv = useMemo(
    () => (suffix: string) => t(`${tp}.${suffix}` as TranslationKey),
    [t, tp],
  );

  const siteDisplay =
    typeof import.meta.env.VITE_SITE_URL === "string" && import.meta.env.VITE_SITE_URL.length > 0
      ? import.meta.env.VITE_SITE_URL.replace(/^https?:\/\//, "").replace(/\/+$/, "")
      : tv("fallbackSite");

  useEffect(() => {
    if (!embedOnly) return;
    const q = searchParams.get("lang");
    if (q === "en" || q === "es") setLanguage(q);
  }, [embedOnly, searchParams, setLanguage]);

  useEffect(() => {
    if (!shouldAutoPrint) return;
    const id = window.setTimeout(() => {
      window.print();
    }, 350);
    return () => window.clearTimeout(id);
  }, [shouldAutoPrint]);

  const openPrintPreviewTab = (): void => {
    const params = new URLSearchParams();
    params.set("embed", "1");
    params.set("sheet", "1");
    params.set("lang", language);
    params.set("scale", String(previewScale));
    params.set("print", "1");
    const url = `${pathname}?${params.toString()}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const sponsorMailto = VARIANT_MAILTO[variant];

  const rootDataAttr =
    variant === "niu" ? ({ "data-onepager-niu": "" } as const) : ({ "data-onepager-boxful": "" } as const);

  return (
    <div
      className={`one-pager-root one-pager-white${embedOnly ? ` one-pager-embed${sheetOnly ? " one-pager-sheet-only-host" : ""}` : " one-pager-cash-preview-root flex min-h-screen min-h-[100dvh] flex-col"}`}
      data-theme="light"
      {...rootDataAttr}
    >
      {!embedOnly && (
        <div className="one-pager-no-print flex flex-wrap items-center justify-center gap-3 border-b border-border bg-bg px-2 py-2">
          <div
            className="flex items-center rounded-full border border-border bg-bg-raised p-0.5 text-[0.65rem] font-mono uppercase tracking-[0.12em] shadow-sm"
            role="group"
            aria-label={t("nav.language")}
          >
            <button
              type="button"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
              className={`rounded-full px-2.5 py-1.5 transition-colors ${
                language === "en" ? "bg-accent/15 text-accent" : "text-fg-4 hover:text-fg-2"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("es")}
              aria-pressed={language === "es"}
              className={`rounded-full px-2.5 py-1.5 transition-colors ${
                language === "es" ? "bg-accent/15 text-accent" : "text-fg-4 hover:text-fg-2"
              }`}
            >
              ES
            </button>
          </div>
          <div
            className="flex items-center rounded-full border border-border bg-bg-raised p-0.5 text-[0.65rem] font-mono uppercase tracking-[0.12em] shadow-sm"
            role="group"
            aria-label={tv("previewScaleAria")}
          >
            {LIGHT_PREVIEW_SCALES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPreviewScale(s)}
                aria-pressed={previewScale === s}
                className={`min-w-[2.35rem] rounded-full px-2 py-1.5 tabular-nums transition-colors ${
                  previewScale === s ? "bg-accent/15 text-accent" : "text-fg-4 hover:text-fg-2"
                }`}
              >
                {s}×
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => openPrintPreviewTab()}
            className="inline-flex items-center gap-2 rounded border border-border bg-bg-raised px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-fg shadow-sm hover:border-accent hover:text-accent"
          >
            <Printer className="size-3.5" aria-hidden />
            {tv("print")}
          </button>
        </div>
      )}

      {embedOnly ? (
        <div
          className={`one-pager-cash-zoom mx-auto w-full max-w-full ${sheetOnly ? "" : "pb-10 pt-4"}`}
          style={
            embedScale !== 1 ? ({ zoom: embedScale } satisfies CSSProperties) : undefined
          }
        >
          {renderLightSheet(tv, siteDisplay, sponsorMailto)}
        </div>
      ) : (
        <div className="one-pager-cash-preview flex min-h-0 flex-1 flex-col overflow-auto">
          <div
            className="one-pager-cash-zoom mx-auto pb-10 pt-4"
            style={{ zoom: previewScale } as CSSProperties}
          >
            {renderLightSheet(tv, siteDisplay, sponsorMailto)}
          </div>
        </div>
      )}
    </div>
  );
}

function renderLightSheet(
  tv: (suffix: string) => string,
  siteDisplay: string,
  sponsorMailto: string,
): ReactElement {
  return (
    <div id="one-pager-sheet" className="one-pager-sheet bg-bg text-[9pt] leading-snug text-fg">
      <div className="one-pager-grid" aria-hidden />

      <div className="relative">
        <div className="mb-2 h-1 w-full bg-accent" />

        <header className="one-pager-avoid-break mb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <h1 className="font-display text-[1.4rem] font-bold uppercase leading-none tracking-tight">
                {tv("heroTitle")}
              </h1>
              <p className="mt-1 font-display text-[0.95rem] font-semibold uppercase tracking-wide text-fg-2">
                {tv("heroSubtitle")}
              </p>
            </div>
            <div className="one-pager-header-meta shrink-0 text-right font-mono text-[0.58rem] leading-snug text-fg-2 sm:text-[0.6rem]">
              <p>{tv("headerWhenWhere")}</p>
              <p className="mt-0.5">
                <a href={UFG_URL} className="font-semibold text-fg underline underline-offset-2">
                  UFG
                </a>
                {tv("ufgUniversity")}
              </p>
            </div>
          </div>
        </header>
      </div>

      <section className="one-pager-avoid-break mb-3 grid min-w-0 grid-cols-[1.35fr_0.75fr] overflow-hidden rounded-md border border-accent/45 bg-[#fff5ef]">
        <div className="min-w-0 border-r border-accent/25 px-3 py-2.5">
          <p className="mb-1 font-mono text-[0.52rem] font-bold uppercase tracking-[0.14em] text-accent">
            {tv("decisionKicker")}
          </p>
          <h2 className="font-display text-[1rem] font-bold uppercase leading-tight tracking-tight text-fg">
            {tv("decisionTitle")}
          </h2>
          <p className="mt-1 text-[7.7pt] leading-relaxed text-fg-2">{tv("decisionBody")}</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5 text-[6.6pt] leading-snug text-fg-2">
            <DecisionMiniCard title={tv("decisionMini1.title")} body={tv("decisionMini1.body")} />
            <DecisionMiniCard title={tv("decisionMini2.title")} body={tv("decisionMini2.body")} />
            <DecisionMiniCard title={tv("decisionMini3.title")} body={tv("decisionMini3.body")} />
          </div>
        </div>
        <div className="flex min-w-0 flex-col justify-between bg-accent px-3 py-2.5 text-white">
          <div>
            <p className="font-mono text-[0.48rem] font-bold uppercase tracking-[0.14em] text-white/80">
              {tv("fastDecisionLabel")}
            </p>
            <p className="mt-1 font-display text-[1.75rem] font-bold leading-none tracking-tight">
              {SPONSOR_AMOUNT}
            </p>
            <p className="mt-1 text-[7pt] font-medium leading-snug text-white/90">
              {tv("fastDecisionBody")}
            </p>
          </div>
          <div className="mt-2 rounded border border-white/30 bg-white/12 px-2 py-1.5">
            <p className="font-mono text-[0.46rem] font-bold uppercase tracking-[0.12em] text-white/75">
              {tv("fundingKicker")}
            </p>
            <p className="mt-0.5 text-[6.8pt] font-semibold leading-tight text-white">
              $1.5K {tv("fundingBody")}
            </p>
          </div>
        </div>
      </section>

      <section
        className="one-pager-stats one-pager-avoid-break mb-3 grid grid-cols-5 overflow-hidden rounded-md border border-border bg-bg-raised text-center"
        aria-label={tv("statsAria")}
      >
        <StatCell value="$1.5K" label={tv("stat1.label")} sub={tv("stat1.sub")} />
        <StatCell value="$750" label={tv("stat2.label")} sub={tv("stat2.sub")} />
        <StatCell value="~200" label={tv("stat3.label")} sub={tv("stat3.sub")} />
        <StatCell value="145" label={tv("stat4.label")} sub={tv("stat4.sub")} />
        <StatCell value="45" label={tv("stat5.label")} sub={tv("stat5.sub")} />
      </section>

      <OnePagerCashLightLogoAssetsProvider>
        <OnePagerSponsors />
      </OnePagerCashLightLogoAssetsProvider>

      <div className="one-pager-cols-main grid grid-cols-[1fr_1fr] gap-4">
        <div className="min-w-0 space-y-3">
          <div className="one-pager-avoid-break min-w-0 rounded border border-border bg-bg-raised">
            <div className="flex items-baseline justify-between border-b border-border px-2.5 py-2">
              <h2 className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.12em] text-fg">
                {tv("packageTitle")}
              </h2>
              <span className="font-display text-[0.85rem] font-bold tabular-nums text-accent">
                {SPONSOR_AMOUNT}{" "}
                <span className="text-[0.5rem] font-semibold text-fg-2">{tv("suggestedBadge")}</span>
              </span>
            </div>

            <div className="border-b border-border bg-white px-2.5 py-2">
              <p className="font-mono text-[0.5rem] font-bold uppercase tracking-[0.12em] text-accent">
                {tv("flexTitle")}
              </p>
              <p className="mt-0.5 text-[7pt] leading-relaxed text-fg-2">{tv("flexBody")}</p>
            </div>

            <div className="space-y-0 text-[6.8pt]">
              {SPONSOR_BENEFIT_DEFS.map((group) => (
                <BenefitCategory key={group.category} group={group} tv={tv} />
              ))}
            </div>

            <div className="border-t border-border px-2.5 py-2">
              <div className="mb-1 flex items-baseline gap-2">
                <p className="font-mono text-[0.48rem] font-bold uppercase tracking-[0.14em] text-fg-3">
                  {tv("premiumTitle")}
                </p>
                <span className="rounded-sm border border-fg-4/30 bg-bg px-1 py-px font-mono text-[0.4rem] font-semibold uppercase tracking-wider text-fg-3">
                  {tv("extraCostBadge")}
                </span>
              </div>
              <ul className="space-y-0.5 text-[6.8pt] text-fg-2">
                {PREMIUM_ADDON_SUFFIXES.map((suffix) => (
                  <li key={suffix} className="flex items-start gap-1.5">
                    <span className="mt-[0.3em] text-[0.5rem] text-fg-4">+</span>
                    <span>{tv(suffix)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="border-t border-border px-2.5 py-1.5 text-[6pt] leading-relaxed text-fg-4">
              {tv("pricesNote")}
            </p>
          </div>
        </div>

        <div className="min-w-0 space-y-3">
          <div className="one-pager-avoid-break min-w-0 max-w-full rounded border border-accent/30 bg-accent/[0.03] p-2.5">
            <h3 className="mb-1 font-mono text-[0.55rem] font-bold uppercase tracking-[0.12em] text-accent">
              {tv("proofTitle")}
            </h3>
            <div className="min-w-0 space-y-1 text-[7.3pt] leading-relaxed text-fg-2">
              <ProofItem>{tv("proofCollected")}</ProofItem>
              <ProofItem>{tv("proof1")}</ProofItem>
              <ProofItem>{tv("proof2")}</ProofItem>
              <ProofItem>{tv("proof3")}</ProofItem>
            </div>
          </div>

          <div className="one-pager-avoid-break min-w-0">
            <SectionTitle>{tv("photosTitle")}</SectionTitle>
            <div className="grid min-w-0 gap-2">
              <figure className="one-pager-proof-photo relative aspect-[2.35/1] overflow-hidden rounded border border-border bg-bg-raised">
                <img
                  src={ONEPAGER_IMAGE_SRCS[0]}
                  alt={tv(IMG_ALT_SUFFIXES[0])}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className="grid min-w-0 grid-cols-2 gap-2">
                {ONEPAGER_IMAGE_SRCS.slice(1).map((src, i) => (
                  <figure
                    key={src}
                    className="one-pager-proof-photo relative aspect-[4/3] overflow-hidden rounded border border-border bg-bg-raised"
                  >
                    <img
                      src={src}
                      alt={tv(IMG_ALT_SUFFIXES[i + 1]!)}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                ))}
              </div>
            </div>
            <p className="mt-1.5 text-[6.9pt] leading-relaxed text-fg-3">{tv("photosDisclaimer")}</p>
          </div>
        </div>
      </div>

      <footer className="one-pager-footer-block mt-3">
        <div className="mb-2 grid min-w-0 grid-cols-[1fr_auto] items-start gap-4 border-t border-border pt-2 text-[7.3pt] leading-relaxed text-fg-2">
          <div className="min-w-0">
            <p className="mb-0.5 font-mono text-[0.5rem] font-bold uppercase tracking-wider text-fg">
              {tv("footer.organizersLabel")}
            </p>
            <p>
              <a href={AILABS_URL} className="font-semibold text-fg underline">
                Ai /abs
              </a>
              {tv("footer.organizersLine")}
              <a href={UFG_URL} className="text-fg underline">
                UFG
              </a>
              {tv("footer.organizersTail")}
            </p>
          </div>
          <div className="shrink-0 text-right text-fg-3">
            <p>{tv("footer.place1")}</p>
            <p>{tv("footer.place2")}</p>
          </div>
        </div>

        <div className="one-pager-cta-bar rounded px-4 py-2.5">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <a href={sponsorMailto} className="font-display text-[11pt] font-bold tracking-tight">
                hello@wmorales.dev
              </a>
              <p className="mt-1 text-[7.5pt] leading-relaxed">{tv("ctaEmailHint")}</p>
            </div>
            <span className="shrink-0 font-mono text-[0.5rem] font-bold uppercase tracking-wider">
              {tv("ctaBecomeSponsor")}
            </span>
          </div>
        </div>

        <p className="mt-2 text-center font-mono text-[0.5rem] leading-relaxed text-fg-3">
          <a href="/" className="text-accent underline underline-offset-2">
            {siteDisplay}
          </a>
          {tv("footerCopyright")}
        </p>
      </footer>
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mb-1.5 w-full max-w-full border-b border-border pb-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-[0.12em] text-fg">
      {children}
    </h2>
  );
}

function StatCell({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div className="one-pager-stat-cell min-w-0 border-r border-bg-alt px-0.5 py-1.5 last:border-r-0 md:py-2">
      <p className="text-[0.82rem] font-bold uppercase leading-none tracking-tight text-accent md:text-[0.88rem]">
        {value}
      </p>
      <p className="mt-0.5 font-mono text-[0.46rem] uppercase leading-tight text-fg-2 md:text-[0.5rem]">
        {label}
      </p>
      <p className="mt-px font-mono text-[0.42rem] leading-tight text-fg-3 md:text-[0.46rem]">{sub}</p>
    </div>
  );
}

function DecisionMiniCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="min-w-0 rounded border border-accent/20 bg-white/70 p-1.5">
      <p className="font-mono text-[0.44rem] font-bold uppercase tracking-[0.12em] text-accent">{title}</p>
      <p className="mt-0.5 break-words">{body}</p>
    </div>
  );
}

function ProofItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="one-pager-proof-line grid grid-cols-[auto_minmax(0,1fr)] gap-x-1.5 text-fg-2">
      <span className="one-pager-proof-dot mt-[0.35em] shrink-0" aria-hidden />
      <p className="m-0 min-w-0 break-words">{children}</p>
    </div>
  );
}

function BenefitCategory({
  group,
  tv,
}: {
  group: { category: string; items: string[] };
  tv: (suffix: string) => string;
}) {
  return (
    <div className="border-b border-border last:border-b-0">
      <p className="border-b border-border bg-bg px-2.5 py-1 font-mono text-[0.48rem] font-bold uppercase tracking-[0.14em] text-accent">
        {tv(group.category)}
      </p>
      <ul className="space-y-0.5 px-2.5 py-1.5">
        {group.items.map((itemSuffix) => (
          <li key={itemSuffix} className="flex items-start gap-1.5 text-fg-2">
            <span className="mt-[0.25em] text-accent">●</span>
            <span>{tv(itemSuffix)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OnePagerNiuPage() {
  return <LightOnePagerSheet variant="niu" />;
}

export function OnePagerBoxfulPage() {
  return <LightOnePagerSheet variant="boxful" />;
}
