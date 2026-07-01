import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { useMarqueeDrag } from "../../hooks/use-marquee-drag";
import { useTranslation } from "../../context/language-context";
import { SponsorRailGroup } from "../hero-section/sponsor-rail-group";

/** Fixed full-width sponsor rail pinned to the bottom of the builder page viewport. */
export function BuilderSponsorCarousel() {
  const { t } = useTranslation();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setActive(true), { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setActive(true), 400);
    return () => window.clearTimeout(id);
  }, []);

  if (!active) {
    return (
      <footer
        id="sponsors"
        className="fixed inset-x-0 bottom-0 z-30 h-[4.25rem] border-t border-border bg-bg-deep sm:h-[4.75rem]"
        aria-hidden
      />
    );
  }

  return <BuilderSponsorCarouselActive ariaLabel={t("builder.sponsors.ariaLabel")} />;
}

function BuilderSponsorCarouselActive({ ariaLabel }: { ariaLabel: string }) {
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
  } = useMarqueeDrag({ pxPerSecond: 36 });

  const trackStyle: CSSProperties = {
    willChange: "transform",
  };

  return (
    <footer
      id="sponsors"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg-deep"
      aria-label={ariaLabel}
    >
      <div
        ref={viewportRef}
        className={`relative w-full overflow-hidden touch-pan-y motion-reduce:overflow-x-auto [&_a]:cursor-pointer ${
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
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-bg-deep/95 to-transparent sm:w-16"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-bg-deep/95 to-transparent sm:w-16"
        />

        <div
          ref={trackRef}
          className="flex w-max items-stretch py-4 motion-reduce:overflow-x-auto motion-reduce:snap-x motion-reduce:snap-mandatory sm:py-5"
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
    </footer>
  );
}
