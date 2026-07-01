import { useEffect, useRef, useState } from "react";

interface UseDeferredMountOptions {
  /** Match `section` anchor id (without #) for sticky nav jumps. */
  sectionId: string;
  /** Prefetch content before it enters the viewport. */
  rootMargin?: string;
}

function hashTargetsSection(sectionId: string): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hash === `#${sectionId}`;
}

export function useDeferredMount({
  sectionId,
  rootMargin = "480px 0px",
}: UseDeferredMountOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => hashTargetsSection(sectionId));

  useEffect(() => {
    if (visible) return;

    const reveal = () => setVisible(true);

    const onHashChange = () => {
      if (hashTargetsSection(sectionId)) reveal();
    };
    window.addEventListener("hashchange", onHashChange);

    const el = ref.current;
    if (!el) {
      return () => window.removeEventListener("hashchange", onHashChange);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) reveal();
      },
      { rootMargin },
    );
    observer.observe(el);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      observer.disconnect();
    };
  }, [sectionId, visible, rootMargin]);

  return { ref, visible };
}
