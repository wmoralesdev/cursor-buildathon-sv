import { type ReactNode, useEffect, useRef, useState } from "react";

const NEAR_VIEWPORT_MARGIN = "800px 0px";

function BuilderSectionPlaceholder({
  sectionId,
  minHeight,
}: {
  sectionId: string;
  minHeight: string;
}) {
  return (
    <div
      id={sectionId}
      className="scroll-mt-24 section-padding py-24 sm:py-32 lg:py-40"
      style={{ minHeight }}
      aria-hidden
    />
  );
}

/** Mount heavy lazy sections only when near the viewport or targeted by hash. */
export function BuilderDeferredSection({
  sectionId,
  minHeight = "14rem",
  children,
}: {
  sectionId: string;
  minHeight?: string;
  children: ReactNode;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.location.hash === `#${sectionId}`;
  });

  useEffect(() => {
    if (shouldMount) return;

    const onHashChange = () => {
      if (window.location.hash === `#${sectionId}`) {
        setShouldMount(true);
      }
    };

    window.addEventListener("hashchange", onHashChange);

    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return () => window.removeEventListener("hashchange", onHashChange);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: NEAR_VIEWPORT_MARGIN },
    );

    observer.observe(sentinel);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      observer.disconnect();
    };
  }, [sectionId, shouldMount]);

  if (shouldMount) {
    return children;
  }

  return (
    <div ref={sentinelRef}>
      <BuilderSectionPlaceholder sectionId={sectionId} minHeight={minHeight} />
    </div>
  );
}
