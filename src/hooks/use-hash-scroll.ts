import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { scrollToBuilderSection } from "../lib/builder-section-scroll";

export function useHashScroll() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/builder") return;

    const hash = location.hash;
    if (!hash) return;
    const id = hash.slice(1);
    if (!id) return;

    const timer = window.setTimeout(() => {
      scrollToBuilderSection(id);
    }, 50);

    return () => window.clearTimeout(timer);
  }, [location.hash, location.pathname]);
}
