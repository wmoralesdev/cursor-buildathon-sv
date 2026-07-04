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

/** Mount heavy lazy sections when near the viewport, targeted by hash, or tab is active. */
export function BuilderDeferredSection({
  sectionId,
  minHeight = "14rem",
  active = false,
  children,
}: {
  sectionId: string;
  minHeight?: string;
  active?: boolean;
  children: ReactNode;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [mountedFromDeferred, setMountedFromDeferred] = useState(() => {
    if (typeof window === "undefined") return active;
    return active || window.location.hash === `#${sectionId}`;
  });
  const shouldMount = active || mountedFromDeferred;

  useEffect(() => {
    if (shouldMount) return;

    const onHashChange = () => {
      if (window.location.hash === `#${sectionId}`) {
        setMountedFromDeferred(true);
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
          setMountedFromDeferred(true);
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
  }, [sectionId, shouldMount, active]);

  if (shouldMount) {
    return children;
  }

  return (
    <div ref={sentinelRef}>
      <BuilderSectionPlaceholder sectionId={sectionId} minHeight={minHeight} />
    </div>
  );
}
