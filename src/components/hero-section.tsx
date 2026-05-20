import {
  type ComponentType,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
  type Ref,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion, useAnimationFrame, useReducedMotion } from "motion/react";
import { ArrowUpRight, Calendar, MapPin, Users } from "lucide-react";

import { CountdownTimer } from "./countdown-timer";
import type { BrandLogoProps, ProductSponsorId } from "./sponsor-logos";
import {
  CursorLockup,
  productSponsorLogoById,
  ZavuLogo,
} from "./sponsor-logos";
import { SPONSOR_MAILTO } from "../constants";
import { sponsors, type Sponsor } from "../data/sponsors";
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
  abaco:    "h-6 w-auto max-w-[7.5rem] object-contain object-left",
  elevenlabs: "h-6 w-auto max-w-[8.5rem] object-contain object-left",
  simov: "h-6 w-auto max-w-[8rem] object-contain object-left",
  kreali: "h-6 w-auto max-w-[8.5rem] object-contain object-left",
  weris: "h-6 w-auto max-w-[8.5rem] object-contain object-left",
  boxful: "h-6 w-auto max-w-[8.5rem] object-contain object-left",
  drop: "h-6 w-auto max-w-[7.5rem] object-contain object-left",
  gamesquad: "h-10 w-auto max-w-[12rem] object-contain object-left",
  searchyou: "h-6 w-auto max-w-[8.5rem] object-contain object-left",
};

const PARTNER_ORDER: readonly HeroPartnerId[] = [
  "n8n",
  "codex",
  "yonjob",
  "nubiwork",
  "abaco",
  "elevenlabs",
  "simov",
  "kreali",
  "weris",
  "boxful",
  "drop",
  "gamesquad",
  "searchyou",
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

function requireSponsor(id: ProductSponsorId): Sponsor {
  const s = sponsors.find((x) => x.id === id);
  if (!s) throw new Error(`hero: sponsor "${id}" missing`);
  return s;
}

const codexSponsorEntry = requireSponsor("codex");
const elevenlabsSponsorEntry = requireSponsor("elevenlabs");

const CodexLogo = productSponsorLogoById.codex;
const ElevenLabsLogo = productSponsorLogoById.elevenlabs;

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
];

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100dvh_-_var(--site-nav-height))] flex-col overflow-hidden bg-bg"
    >
      <div className="absolute inset-0 pointer-events-none bg-grid mask-radial-hero opacity-70" />
      <div className="absolute inset-x-0 top-0 h-[60vh] pointer-events-none glow-top-center opacity-80" />

      {/* One block: grid + sponsor rail, centered in the viewport band below the in-flow nav */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center section-padding py-8 sm:py-10">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
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

              <div className="mt-5 sm:mt-6">
                <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-fg-4 mb-3">
                  {t("hero.tierPartners.label")}
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-8">
                  <a
                    href={codexSponsorEntry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center py-1 opacity-90 transition-[opacity,transform] duration-300 hover:opacity-100 hover:scale-[1.02] active:scale-[0.98]"
                    aria-label={`${codexSponsorEntry.name} — product partner`}
                  >
                    <CodexLogo
                      alt={codexSponsorEntry.name}
                      className="h-11 w-auto max-w-[12rem] sm:h-[3.25rem] sm:max-w-[15rem] object-contain object-left"
                    />
                  </a>
                  <a
                    href={elevenlabsSponsorEntry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center py-1 opacity-90 transition-[opacity,transform] duration-300 hover:opacity-100 hover:scale-[1.02] active:scale-[0.98]"
                    aria-label={`${elevenlabsSponsorEntry.name} — product partner`}
                  >
                    <ElevenLabsLogo
                      alt={elevenlabsSponsorEntry.name}
                      className="h-7 w-auto max-w-[9rem] sm:h-9 sm:max-w-[10rem] object-contain object-left"
                    />
                  </a>
                </div>
              </div>

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
                  <a
                    href={SPONSOR_MAILTO}
                    className="btn-phosphor inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm py-2.5 px-5 no-underline"
                  >
                    {t("hero.ctaTiers")}
                  </a>
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

                <a
                  href={SPONSOR_MAILTO}
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
                </a>
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
const MARQUEE_DRAG_THRESHOLD_PX = 6;

function wrapMarqueeOffset(offset: number, groupWidth: number): number {
  if (groupWidth <= 0) return offset;
  let wrapped = offset % groupWidth;
  if (wrapped > 0) wrapped -= groupWidth;
  return wrapped;
}

function SponsorRail() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const measureGroupRef = useRef<HTMLDivElement>(null);
  const [groupWidth, setGroupWidth] = useState<number>(0);
  const [copies, setCopies] = useState<number>(2);
  const [isDragging, setIsDragging] = useState(false);
  const offsetRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);
  const dragSessionRef = useRef({
    active: false,
    startX: 0,
    startOffset: 0,
    moved: false,
  });

  const applyTrackOffset = useCallback((offset: number) => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offset}px, 0, 0)`;
    }
  }, []);

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
      offsetRef.current = wrapMarqueeOffset(offsetRef.current, gw);
      applyTrackOffset(offsetRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    ro.observe(group);
    return () => ro.disconnect();
  }, [applyTrackOffset]);

  useAnimationFrame((time) => {
    if (prefersReducedMotion || dragSessionRef.current.active || groupWidth <= 0) return;

    if (lastFrameRef.current === null) {
      lastFrameRef.current = time;
      return;
    }

    const dt = (time - lastFrameRef.current) / 1000;
    lastFrameRef.current = time;
    offsetRef.current = wrapMarqueeOffset(
      offsetRef.current - MARQUEE_PX_PER_SECOND * dt,
      groupWidth,
    );
    applyTrackOffset(offsetRef.current);
  });

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    dragSessionRef.current = {
      active: true,
      startX: event.clientX,
      startOffset: offsetRef.current,
      moved: false,
    };
    setIsDragging(true);
    lastFrameRef.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragSessionRef.current.active || groupWidth <= 0) return;

      const deltaX = event.clientX - dragSessionRef.current.startX;
      if (Math.abs(deltaX) > MARQUEE_DRAG_THRESHOLD_PX) {
        dragSessionRef.current.moved = true;
      }

      offsetRef.current = wrapMarqueeOffset(
        dragSessionRef.current.startOffset + deltaX,
        groupWidth,
      );
      applyTrackOffset(offsetRef.current);
    },
    [applyTrackOffset, groupWidth],
  );

  const endDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragSessionRef.current.active) return;
    dragSessionRef.current.active = false;
    setIsDragging(false);
    lastFrameRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const handleClickCapture = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    if (dragSessionRef.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      dragSessionRef.current.moved = false;
    }
  }, []);

  const trackStyle: CSSProperties = {
    willChange: "transform",
  };

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
            className={`relative overflow-hidden px-6 touch-pan-y motion-reduce:overflow-x-auto motion-reduce:px-0 ${
              isDragging ? "cursor-grabbing select-none" : "cursor-grab"
            }`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
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
              ref={trackRef}
              className="flex w-max items-stretch py-6 md:py-7 motion-reduce:overflow-x-auto motion-reduce:snap-x motion-reduce:snap-mandatory"
              style={trackStyle}
              role="list"
              onClickCapture={handleClickCapture}
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
