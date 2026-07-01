import type { ReactNode } from "react";

import { useDeferredMount } from "../../hooks/use-deferred-mount";

interface BuilderDeferredSectionProps {
  sectionId: string;
  children: ReactNode;
  /** Reserve space before content mounts to limit layout shift. */
  minHeight?: string;
}

export function BuilderDeferredSection({
  sectionId,
  children,
  minHeight = "14rem",
}: BuilderDeferredSectionProps) {
  const { ref, visible } = useDeferredMount({ sectionId });

  if (!visible) {
    return (
      <div
        id={sectionId}
        ref={ref}
        className="scroll-mt-20"
        style={{ minHeight }}
        aria-hidden
      />
    );
  }

  return <div ref={ref}>{children}</div>;
}
