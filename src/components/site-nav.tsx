import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

import { CursorLockup } from "./sponsor-logos";
import { AI_LABS_LINKS_URL } from "../constants";
import { useTranslation } from "../context/language-context";

export function SiteNav() {
  const { resolvedTheme, setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();

  return (
    <nav className="relative z-20 mx-auto flex w-full max-w-[1400px] flex-col gap-4 py-4 section-padding sm:flex-row sm:items-center sm:justify-between sm:gap-y-0 sm:py-6">
      <Link
        to="/"
        aria-label="Cursor Buildathon home"
        className="inline-flex shrink-0 self-start sm:self-auto"
      >
        <CursorLockup alt="Cursor" className="h-6 w-auto object-contain sm:h-7" />
      </Link>

      <div className="flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-2 sm:w-auto sm:flex-nowrap sm:justify-end sm:gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="flex items-center rounded-full border border-border-faint p-0.5 text-[0.65rem] font-mono uppercase tracking-[0.12em]"
            role="group"
            aria-label={t("nav.language")}
          >
            <button
              type="button"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
              className={`rounded-full px-2 py-1.5 transition-colors sm:px-2.5 ${
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
              className={`rounded-full px-2 py-1.5 transition-colors sm:px-2.5 ${
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
            {resolvedTheme === "dark" ? (
              <Sun size={14} strokeWidth={1.75} />
            ) : (
              <Moon size={14} strokeWidth={1.75} />
            )}
          </button>
        </div>

        <a
          href={AI_LABS_LINKS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-phosphor shrink-0 text-xs px-3 py-2 sm:px-6 sm:py-2.5 no-underline"
        >
          <span className="hidden sm:inline">{t("nav.followCta")}</span>
          <span className="sm:hidden" aria-hidden="true">
            Follow →
          </span>
        </a>
      </div>
    </nav>
  );
}
