import {
  type ComponentType,
  type CSSProperties,
  type Ref,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, Calendar, MapPin, Users, Zap } from "lucide-react";

import { CountdownTimer } from "./countdown-timer";
import type { BrandLogoProps, ProductSponsorId } from "./sponsor-logos";
import {
  CursorLockup,
  productSponsorLogoById,
  ZavuLogo,
} from "./sponsor-logos";
import { sponsors } from "../data/sponsors";
import { useTranslation } from "../context/language-context";
import type { TranslationKey } from "../i18n/translations";

type HeroPartnerId = ProductSponsorId | "zavu";
const ZAVU_URL = "https://zavu.dev";

const RAIL_LOGO_CLASS: Record<HeroPartnerId, string> = {
  zavu:     "h-[1.375rem] w-auto max-w-[6.5rem] object-contain object-left",
  n8n:      "h-7 w-auto max-w-[8rem] object-contain object-left",
  codex:    "h-9 w-auto max-w-[9rem] object-contain object-left",
  yonjob:   "h-8 w-auto max-w-[9rem] object-contain object-left",
  nubiwork: "h-11 w-auto max-w-[12rem] object-contain object-left",
};

const PARTNER_ORDER: readonly HeroPartnerId[] = [
  "n8n",
  "codex",
  "yonjob",
  "nubiwork",
  "zavu",
] as const;

interface RailEntry {
  id: HeroPartnerId;
  href: string;
  label: string;
  Logo: ComponentType<BrandLogoProps>;
  className: string;
}

function buildRail(): RailEntry[] {
  return PARTNER_ORDER.map((id) => {
    if (id === "zavu") {
      return {
        id,
        href: ZAVU_URL,
        label: "Zavu",
        Logo: ZavuLogo,
        className: RAIL_LOGO_CLASS[id],
      };
    }
    const s = sponsors.find((x) => x.id === id);
    if (!s) throw new Error(`hero: sponsor "${id}" missing`);
    return {
      id,
      href: s.url,
      label: s.name,
      Logo: productSponsorLogoById[id],
      className: RAIL_LOGO_CLASS[id],
    };
  });
}

const PARTNER_RAIL = buildRail();

interface BriefRow {
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  labelKey: TranslationKey;
  valueKey: TranslationKey;
  subKey: TranslationKey;
}

const BRIEF_ROWS: BriefRow[] = [
  {
    Icon: Calendar,
    labelKey: "hero.brief.window.label",
    valueKey: "hero.brief.window.value",
    subKey: "hero.brief.window.sub",
  },
  {
    Icon: MapPin,
    labelKey: "hero.brief.venue.label",
    valueKey: "hero.brief.venue.value",
    subKey: "hero.brief.venue.sub",
  },
  {
    Icon: Users,
    labelKey: "hero.brief.audience.label",
    valueKey: "hero.brief.audience.value",
    subKey: "hero.brief.audience.sub",
  },
  {
    Icon: Zap,
    labelKey: "hero.brief.edition.label",
    valueKey: "hero.brief.edition.value",
    subKey: "hero.brief.edition.sub",
  },
];

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-bg"
    >
      <div className="absolute inset-0 pointer-events-none bg-grid mask-radial-hero opacity-70" />
      <div className="absolute inset-x-0 top-0 h-[60vh] pointer-events-none glow-top-center opacity-80" />

      {/* Centered hero composition — brief + marquee live as one block */}
      <div className="relative z-10 flex-1 flex items-center section-padding pt-10 lg:pt-12 pb-10">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left column — value proposition + CTAs */}
            <motion.div
              className="lg:col-span-7 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="tag w-fit mb-7">{t("hero.eyebrow")}</span>

              <h1 className="font-display font-bold uppercase text-fg tracking-[-0.02em] leading-[0.95]">
                <span className="block text-[clamp(2.4rem,5.5vw,4.4rem)]">
                  {t("hero.title.line1")}
                </span>
                <span className="mt-1 block text-[clamp(1.4rem,3.2vw,2.4rem)] text-accent font-medium tracking-[0.02em]">
                  {t("hero.title.line2")}
                </span>
              </h1>

              <p className="mt-7 max-w-[58ch] font-display text-base sm:text-[1.05rem] text-fg-2 leading-[1.75]">
                {t("hero.lede")}
              </p>

              <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">
                <div>
                  <p className="font-mono text-[0.6rem] tracking-[0.2em] text-accent uppercase mb-2">
                    {t("hero.countdownLabel")}
                  </p>
                  <CountdownTimer />
                </div>
                <div className="hidden sm:block h-12 w-px bg-border-faint" />
                <div className="inline-flex flex-wrap gap-3">
                  <Link
                    to={{ pathname: "/", hash: "tiers" }}
                    className="btn-phosphor inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm py-2.5 px-5 no-underline"
                  >
                    {t("hero.ctaTiers")}
                  </Link>
                  <a
                    href="#about"
                    className="btn-ghost inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm py-2.5 px-5 no-underline"
                  >
                    {t("hero.ctaAbout")}
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right column — sponsor decision brief */}
            <motion.aside
              className="lg:col-span-5 w-full"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              aria-labelledby="hero-brief-title"
            >
              <div className="relative border border-border bg-bg-raised/80 backdrop-blur-sm">
                <span className="pointer-events-none absolute -top-px left-6 right-6 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent" />

                <header className="flex items-center justify-between border-b border-border-faint px-6 py-4">
                  <p
                    id="hero-brief-title"
                    className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-fg-3"
                  >
                    {t("hero.brief.title")}
                  </p>
                  <span className="font-mono text-[0.6rem] tracking-[0.2em] text-accent">
                    04 · 05 · JUL 26
                  </span>
                </header>

                <dl className="divide-y divide-border-faint">
                  {BRIEF_ROWS.map(({ Icon, labelKey, valueKey, subKey }) => (
                    <div
                      key={labelKey}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4"
                    >
                      <Icon
                        className="h-4 w-4 text-accent shrink-0"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <dt className="font-mono text-[0.6rem] tracking-[0.18em] uppercase text-fg-4">
                          {t(labelKey)}
                        </dt>
                        <dd className="mt-0.5 font-display text-sm text-fg-2 leading-snug">
                          {t(subKey)}
                        </dd>
                      </div>
                      <div className="text-right font-display text-sm font-semibold text-fg tracking-[-0.01em] tabular-nums">
                        {t(valueKey)}
                      </div>
                    </div>
                  ))}
                </dl>

                <Link
                  to={{ pathname: "/", hash: "tiers" }}
                  className="group/cta flex items-center justify-between border-t border-border-faint px-6 py-4 no-underline transition-colors duration-200 hover:bg-accent/[0.04] focus-visible:bg-accent/[0.04]"
                >
                  <span className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-accent whitespace-nowrap">
                    {t("hero.ctaTiers")}
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 text-accent transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </Link>
              </div>
            </motion.aside>
          </div>

          {/* Sponsor logo rail — composed as part of the hero block */}
          <div className="mt-12 lg:mt-14">
            <SponsorRail />
          </div>
        </div>
      </div>
    </section>
  );
}

const MARQUEE_PX_PER_SECOND = 40;

function SponsorRail() {
  const { t } = useTranslation();
  const viewportRef = useRef<HTMLDivElement>(null);
  const measureGroupRef = useRef<HTMLDivElement>(null);
  const [groupWidth, setGroupWidth] = useState<number>(0);
  const [copies, setCopies] = useState<number>(2);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const group = measureGroupRef.current;
    if (!viewport || !group) return;

    const measure = () => {
      const vw = viewport.clientWidth;
      const gw = group.offsetWidth;
      if (gw <= 0 || vw <= 0) return;

      setGroupWidth(gw);
      setCopies(Math.max(2, Math.ceil(vw / gw) + 1));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    ro.observe(group);
    return () => ro.disconnect();
  }, []);

  const trackStyle: CSSProperties =
    groupWidth > 0
      ? ({
          ["--marquee-shift" as string]: `-${groupWidth}px`,
          animationDuration: `${(groupWidth / MARQUEE_PX_PER_SECOND).toFixed(3)}s`,
        } as CSSProperties)
      : {};

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Event sponsors and product partners"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-accent">
            {t("hero.partnersLabel")}
          </p>
          <p className="mt-1.5 font-display text-sm text-fg-3 leading-snug max-w-md">
            {t("hero.partnersSubLabel")}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.2em] uppercase text-fg-5">
          <span className="h-1 w-1 rounded-full bg-accent shadow-[0_0_6px_rgba(255,75,0,0.7)]" />
          <span>{PARTNER_RAIL.length + 1} confirmed</span>
        </div>
      </div>

      <div className="relative border-y border-border bg-bg-deep/70">
        {/* Host anchor — Cursor — sits as the prominent left wall */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr]">
          <a
            href="https://cursor.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 border-b md:border-b-0 md:border-r border-border px-6 py-6 md:py-7 transition-colors duration-200 hover:bg-accent/[0.04]"
            aria-label="Cursor — host"
          >
            <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-fg-5">
              Host
            </span>
            <CursorLockup
              alt="Cursor"
              className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </a>

          {/* Marquee viewport — padding lives on the clip container so the moving track stays uniform */}
          <div
            ref={viewportRef}
            className="relative overflow-hidden px-6 motion-reduce:px-0"
          >
            {/* Edge fades */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-12 z-10 bg-linear-to-r from-bg-deep/95 to-transparent"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-12 z-10 bg-linear-to-l from-bg-deep/95 to-transparent"
            />

            {/* MOTION: marquee track — N copies, translates by exactly one group width */}
            <div
              className="flex w-max items-stretch py-6 md:py-7 motion-safe:animate-[marquee_linear_infinite] motion-safe:hover:[animation-play-state:paused] motion-safe:[will-change:transform] motion-reduce:overflow-x-auto motion-reduce:snap-x motion-reduce:snap-mandatory"
              style={trackStyle}
              role="list"
            >
              {Array.from({ length: copies }).map((_, idx) => (
                <SponsorRailGroup
                  key={idx}
                  ariaHidden={idx !== 0}
                  groupRef={idx === 0 ? measureGroupRef : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

interface SponsorRailGroupProps {
  ariaHidden?: boolean;
  groupRef?: Ref<HTMLDivElement>;
}

function SponsorRailGroup({ ariaHidden = false, groupRef }: SponsorRailGroupProps) {
  return (
    <div
      ref={groupRef}
      className="flex shrink-0 items-center gap-12 pr-12"
      aria-hidden={ariaHidden || undefined}
    >
      {PARTNER_RAIL.map((p) => {
        const Logo = p.Logo;
        return (
          <a
            key={p.id}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            role={ariaHidden ? undefined : "listitem"}
            aria-label={ariaHidden ? undefined : `${p.label} — product partner`}
            tabIndex={ariaHidden ? -1 : 0}
            className="shrink-0 motion-reduce:snap-start opacity-90 transition-[opacity,transform] duration-300 hover:opacity-100 hover:scale-[1.04] active:scale-[0.98]"
          >
            <Logo alt={ariaHidden ? "" : p.label} className={p.className} />
          </a>
        );
      })}
    </div>
  );
}
