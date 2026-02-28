import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "../context/language-context";

const LUMA_URL = "https://luma.com/935r7zp6";

const NAV_LINKS = [
  { href: "#about", label: "nav.about" as const },
  { href: "#details", label: "nav.details" as const },
  { href: "#sponsors", label: "nav.sponsors" as const },
];

export function Navigation() {
  const { language, toggleLanguage, t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-base/80 border-b border-white/5 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="section-padding mx-auto flex h-16 max-w-7xl items-center justify-between md:h-20">
        <a href="#" className="group flex items-center gap-3">
          <CursorLogo className="h-7 w-7 transition-transform duration-300 group-hover:rotate-12" />
          <span className="font-display text-sm font-semibold tracking-tight">
            Cursor<span className="text-accent">GT</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-accent"
            >
              {t(link.label)}
            </a>
          ))}

          <button
            onClick={toggleLanguage}
            className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs tracking-wider text-text-secondary transition-all duration-200 hover:border-accent/40 hover:text-accent"
          >
            {language === "en" ? "ES" : "EN"}
          </button>

          <a
            href={LUMA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-[#050505] transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,107,44,0.3)] hover:brightness-110"
          >
            {t("nav.register")}
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-text-secondary md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-white/5 bg-base/95 backdrop-blur-xl md:hidden"
          >
            <div className="section-padding flex flex-col gap-4 py-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-medium text-text-secondary transition-colors hover:text-accent"
                >
                  {t(link.label)}
                </a>
              ))}

              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={toggleLanguage}
                  className="rounded-full border border-white/10 px-4 py-1.5 font-mono text-xs tracking-wider text-text-secondary"
                >
                  {language === "en" ? "ES" : "EN"}
                </button>

                <a
                  href={LUMA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-[#050505]"
                >
                  {t("nav.register")}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function CursorLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M60 8L108 34V86L60 112L12 86V34L60 8Z" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M60 28L88 44V76L60 92L32 76V44L60 28Z" fill="currentColor" opacity="0.15" />
      <path d="M60 20L96 38V82L60 100L24 82V38L60 20Z" stroke="currentColor" strokeWidth="1.5" opacity="0.4" fill="none" />
      <path d="M60 48V72" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M48 60H72" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
