import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { SiteNav } from "./components/site-nav";
import { useHashScroll } from "./hooks/use-hash-scroll";

function useScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [location.pathname]);
}

export default function App() {
  useScrollReveal();
  useHashScroll();

  return (
    <div className="relative min-h-screen bg-bg">
      <div className="grain" aria-hidden="true" />

      <SiteNav />

      <Outlet />
    </div>
  );
}
