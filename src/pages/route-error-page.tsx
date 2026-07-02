import { useEffect } from "react";
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

import { useTranslation } from "../context/language-context";

function getErrorMessage(error: unknown): string | null {
  if (isRouteErrorResponse(error)) {
    if (typeof error.data === "string" && error.data.trim()) return error.data;
    if (
      error.data &&
      typeof error.data === "object" &&
      "message" in error.data &&
      typeof error.data.message === "string"
    ) {
      return error.data.message;
    }
    if (error.statusText) return error.statusText;
    return null;
  }

  if (error instanceof Error) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  return null;
}

export function RouteErrorPage() {
  const error = useRouteError();
  const { t } = useTranslation();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;
  const message = getErrorMessage(error);

  useEffect(() => {
    document.title = isNotFound
      ? t("routeError.notFoundDocumentTitle")
      : t("routeError.documentTitle");
  }, [isNotFound, t]);

  return (
    <main className="section-padding mx-auto flex min-h-[calc(100dvh-var(--site-nav-height))] w-full max-w-[1400px] flex-col items-center justify-center py-16 text-center">
      <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent">
        {isNotFound ? t("routeError.notFoundKicker") : t("routeError.kicker")}
      </p>

      <h1 className="mt-4 font-display text-[clamp(3rem,12vw,6rem)] font-bold uppercase leading-none tracking-tight text-fg">
        {isNotFound ? "404" : t("routeError.title")}
      </h1>

      <p className="mt-4 max-w-md font-display text-xl font-semibold uppercase tracking-wide text-fg-2 sm:text-2xl">
        {isNotFound ? t("routeError.notFoundTitle") : t("routeError.subtitle")}
      </p>

      <p className="mt-3 max-w-lg text-sm leading-relaxed text-fg-3 sm:text-base">
        {isNotFound ? t("routeError.notFoundBody") : t("routeError.body")}
      </p>

      {import.meta.env.DEV && message ? (
        <details className="mt-6 w-full max-w-xl text-left">
          <summary className="cursor-pointer font-mono text-[0.62rem] uppercase tracking-[0.14em] text-fg-3">
            {t("routeError.detailsLabel")}
          </summary>
          <pre className="mt-3 overflow-x-auto rounded border border-border-faint bg-bg-raised p-4 font-mono text-xs leading-relaxed text-fg-2">
            {message}
          </pre>
        </details>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/" className="btn-phosphor no-underline">
          {t("routeError.home")}
        </Link>
        <button type="button" className="btn-ghost" onClick={() => window.location.reload()}>
          {t("routeError.reload")}
        </button>
      </div>
    </main>
  );
}
