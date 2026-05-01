import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

import { CursorLockup } from "./sponsor-logos";
import { useTranslation } from "../context/language-context";

export function SiteNav() {
  const { resolvedTheme, setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();

  return (
    <nav className="relative z-20 flex items-center justify-between max-w-[1400px] mx-auto w-full py-5 sm:py-6 section-padding">
      <div className="flex items-center">
        <Link to="/" aria-label="Cursor Buildathon home">
          <CursorLockup alt="Cursor" className="h-6 w-auto object-contain" />
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className="flex items-center rounded-full border border-border-faint p-0.5 text-[0.65rem] font-mono uppercase tracking-[0.12em]"
          role="group"
          aria-label={t("nav.language")}
        >
          <button
            type="button"
            onClick={() => setLanguage("en")}
            aria-pressed={language === "en"}
            className={`rounded-full px-2.5 py-1.5 transition-colors ${
              language === "en"
                ? "bg-accent/15 text-accent"
                : "text-fg-4 hover:text-fg-2"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage("es")}
            aria-pressed={language === "es"}
            className={`rounded-full px-2.5 py-1.5 transition-colors ${
              language === "es"
                ? "bg-accent/15 text-accent"
                : "text-fg-4 hover:text-fg-2"
            }`}
          >
            ES
          </button>
        </div>

        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="rounded-full border border-border-faint p-2 text-fg-3 transition-[border-color,color] duration-200 hover:border-accent/50 hover:text-accent"
        >
          {resolvedTheme === "dark" ? <Sun size={14} strokeWidth={1.75} /> : <Moon size={14} strokeWidth={1.75} />}
        </button>

        <Link
          to={{ pathname: "/", hash: "cta" }}
          className="btn-phosphor text-xs px-4 py-2.5 sm:px-6 sm:py-2.5 no-underline"
        >
          <span className="hidden sm:inline">{t("nav.sponsorCta")}</span>
          <span className="sm:hidden" aria-hidden="true">Sponsor →</span>
        </Link>
      </div>
    </nav>
  );
}
