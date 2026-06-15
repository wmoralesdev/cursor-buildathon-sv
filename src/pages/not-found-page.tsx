import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { useTranslation } from "../context/language-context";

export function NotFoundPage() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("notFound.documentTitle");
  }, [t]);

  return (
    <main className="section-padding mx-auto flex min-h-[calc(100dvh-var(--site-nav-height))] w-full max-w-[1400px] flex-col items-center justify-center py-16 text-center">
      <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent">
        {t("notFound.kicker")}
      </p>

      <h1 className="mt-4 font-display text-[clamp(4.5rem,18vw,9rem)] font-bold uppercase leading-none tracking-tight text-fg">
        404
      </h1>

      <p className="mt-4 max-w-md font-display text-xl font-semibold uppercase tracking-wide text-fg-2 sm:text-2xl">
        {t("notFound.title")}
      </p>

      <p className="mt-3 max-w-lg text-sm leading-relaxed text-fg-3 sm:text-base">
        {t("notFound.body")}
      </p>

      <p className="mt-5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-fg-4">
        <span className="text-fg-3">{t("notFound.pathLabel")}</span>{" "}
        <code className="rounded border border-border-faint bg-bg-raised px-2 py-0.5 text-fg-2">
          {pathname}
        </code>
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/" className="btn-phosphor no-underline">
          {t("notFound.home")}
        </Link>
        <Link to="/welcome" className="btn-ghost no-underline">
          {t("notFound.welcome")}
        </Link>
      </div>
    </main>
  );
}
