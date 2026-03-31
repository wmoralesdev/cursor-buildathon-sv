import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

import { useTranslation } from "../context/language-context";

export function SiteNav() {
  const { resolvedTheme, setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();

  return (
    <nav className="relative z-20 flex items-center justify-between max-w-7xl mx-auto w-full py-8 section-padding">
      <div className="flex items-center">
        <Link to="/">
          <img
            src={resolvedTheme === "light" ? "/lockup-light.png" : "/lockup-dark.png"}
            alt="Cursor"
            className="h-6 w-auto object-contain"
          />
        </Link>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className="flex items-center rounded-full border border-white/10 p-0.5 text-[0.65rem] font-mono uppercase tracking-[0.12em]"
          role="group"
          aria-label={t("nav.language")}
        >
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`rounded-full px-2.5 py-1.5 transition-colors ${
              language === "en"
                ? "bg-accent/20 text-accent"
                : "text-fg-4 hover:text-fg-2"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage("es")}
            className={`rounded-full px-2.5 py-1.5 transition-colors ${
              language === "es"
                ? "bg-accent/20 text-accent"
                : "text-fg-4 hover:text-fg-2"
            }`}
          >
            ES
          </button>
        </div>
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="rounded-full border border-white/10 p-2 text-fg-3 transition-all duration-200 hover:border-accent/40 hover:text-accent"
        >
          {resolvedTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <Link
          to={{ pathname: "/", hash: "tiers" }}
          className="btn-phosphor text-xs hidden sm:inline-block px-7 py-2.5 no-underline"
        >
          {t("nav.sponsorCta")}
        </Link>
      </div>
    </nav>
  );
}
