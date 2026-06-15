import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useHashScroll() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;
    const id = hash.slice(1);
    const timer = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.setTimeout(() => {
          window.dispatchEvent(new Event("scroll"));
        }, 450);
      }
    }, 100);
    return () => window.clearTimeout(timer);
  }, [location.hash]);
}
