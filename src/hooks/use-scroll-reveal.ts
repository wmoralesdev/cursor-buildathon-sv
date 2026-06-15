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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            markVisible(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px 8% 0px" },
    );

    let raf = 0;
    const scheduleBind = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => bindRevealElements(observer));
    };

    scheduleBind();

    const onScrollOrResize = () => flushPendingReveals(observer);

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    const t1 = window.setTimeout(scheduleBind, 120);
    const t2 = window.setTimeout(onScrollOrResize, 400);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      observer.disconnect();
    };
  }, [location.pathname, language]);
}
