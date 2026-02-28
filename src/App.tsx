import { useEffect, useRef } from "react";
import "./App.css";
import { NoiseOverlay } from "./components/noise-overlay";
import { HeroSection } from "./components/hero-section";
import { AboutSection } from "./components/about-section";
import { DetailsSection } from "./components/details-section";
import { SponsorsSection } from "./components/sponsors-section";
import { ScheduleSection } from "./components/schedule-section";
import { FAQSection } from "./components/faq-section";
import { FooterCTA } from "./components/footer-cta";

function useCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    };

    const animate = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
      ring.style.left = `${ringPos.current.x}px`;
      ring.style.top = `${ringPos.current.y}px`;
      rafRef.current = requestAnimationFrame(animate);
    };

    const onEnter = () => ring.classList.add("hovering");
    const onLeave = () => ring.classList.remove("hovering");

    const interactables = document.querySelectorAll("a, button, [data-hover]");
    interactables.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    window.addEventListener("mousemove", onMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
      interactables.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return { dotRef, ringRef };
}

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

export default function App() {
  const { dotRef, ringRef } = useCursor();
  useScrollReveal();

  return (
    <div className="relative min-h-screen" style={{ background: "#080808" }}>
      {/* Custom cursor */}
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />

      {/* Canvas grain */}
      <NoiseOverlay />

      {/* Page sections */}
      <main>
        <HeroSection />
        <AboutSection />
        <DetailsSection />
        <SponsorsSection />
        <ScheduleSection />
        <FAQSection />
        <FooterCTA />
      </main>
    </div>
  );
}
