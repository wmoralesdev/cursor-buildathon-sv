import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useTranslation } from "../context/language-context";

function markVisible(el: Element) {
  el.classList.add("is-visible");
}

function isRevealInView(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < vh * 0.99 && rect.bottom > 8;
}

function countPendingReveals(): number {
  return document.querySelectorAll(".reveal:not(.is-visible)").length;
}

function flushPendingReveals(observer: IntersectionObserver) {
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
    if (isRevealInView(el)) {
      markVisible(el);
      observer.unobserve(el);
    }
  });
}

function bindRevealElements(observer: IntersectionObserver) {
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
    if (isRevealInView(el)) {
      markVisible(el);
      return;
    }
    observer.observe(el);
  });
}

export function useScrollReveal() {
  const location = useLocation();
  const { language } = useTranslation();
  const isBuilderHub = location.pathname === "/builder";

  useEffect(() => {
    // Builder hub shows .reveal content via CSS; skip observers entirely.
    if (isBuilderHub) return;

    let pendingReveals = countPendingReveals();
    let bindRaf = 0;
    let flushRaf = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            markVisible(entry.target);
            observer.unobserve(entry.target);
            pendingReveals = Math.max(0, pendingReveals - 1);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px 8% 0px" },
    );

    const scheduleBind = () => {
      cancelAnimationFrame(bindRaf);
      bindRaf = requestAnimationFrame(() => {
        bindRevealElements(observer);
        pendingReveals = countPendingReveals();
      });
    };

    const onScrollOrResize = () => {
      if (pendingReveals <= 0) return;

      cancelAnimationFrame(flushRaf);
      flushRaf = requestAnimationFrame(() => {
        flushPendingReveals(observer);
        pendingReveals = countPendingReveals();
      });
    };

    scheduleBind();

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    const t1 = window.setTimeout(scheduleBind, 120);
    const t2 = window.setTimeout(onScrollOrResize, 400);

    return () => {
      cancelAnimationFrame(bindRaf);
      cancelAnimationFrame(flushRaf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      observer.disconnect();
    };
  }, [isBuilderHub, language]);
}
