import type { CSSProperties } from "react";
import { motion } from "motion/react";

import { CursorLockup } from "../sponsor-logos";
import { useTranslation } from "../../context/language-context";
import { useMarqueeDrag } from "../../hooks/use-marquee-drag";
import { PARTNER_RAIL } from "./hero-partner-config";
import { SponsorRailGroup } from "./sponsor-rail-group";

export function SponsorRail() {
  const { t } = useTranslation();
  const {
    viewportRef,
    trackRef,
    measureGroupRef,
    copies,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    endDrag,
    handleClickCapture,
    handleViewportPointerEnter,
    handleViewportPointerLeave,
  } = useMarqueeDrag();

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

          <div
            ref={viewportRef}
            className={`relative overflow-hidden px-6 touch-pan-y motion-reduce:overflow-x-auto motion-reduce:px-0 [&_a]:cursor-pointer ${
              isDragging ? "cursor-grabbing select-none" : "cursor-grab"
            }`}
            onPointerEnter={handleViewportPointerEnter}
            onPointerLeave={handleViewportPointerLeave}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-12 z-10 bg-linear-to-r from-bg-deep/95 to-transparent"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-12 z-10 bg-linear-to-l from-bg-deep/95 to-transparent"
            />

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
