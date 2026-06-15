import { Printer } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

import { useTranslation } from "../context/language-context";
import {
  ONE_PAGER_PREVIEW_SCALES,
  ONE_PAGER_ROUTES,
  parseOnePagerEmbedScale,
  type OnePagerId,
  type OnePagerPreviewScale,
} from "../lib/one-pager-routes";

export interface OnePagerShellProps {
  onePagerId: OnePagerId;
  children: ReactNode;
  rootClassName?: string;
  rootDataAttrs?: Record<string, string>;
  showLanguageToggle?: boolean;
  printLabel?: string;
  previewScaleAria?: string;
  includeLangInPrintParams?: boolean;
}

export function OnePagerShell({
  onePagerId,
  children,
  rootClassName = "",
  rootDataAttrs,
  showLanguageToggle = false,
  printLabel,
  previewScaleAria,
  includeLangInPrintParams = false,
}: OnePagerShellProps) {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const { language, setLanguage, t } = useTranslation();
  const [previewScale, setPreviewScale] = useState<OnePagerPreviewScale>(1);

  const embedOnly =
    searchParams.get("embed") === "1" || searchParams.get("embed") === "true";
  const sheetOnly =
    embedOnly &&
    (searchParams.get("sheet") === "1" || searchParams.get("sheet") === "true");
  const embedScale: OnePagerPreviewScale = embedOnly
    ? parseOnePagerEmbedScale(searchParams.get("scale"))
    : 1;
  const shouldAutoPrint =
    embedOnly &&
    (searchParams.get("print") === "1" || searchParams.get("print") === "true");

  const resolvedPrintLabel = printLabel ?? t("onePager.nav.print");
  const resolvedPreviewScaleAria = previewScaleAria ?? t("onePager.nav.previewScaleAria");

  useEffect(() => {
    if (!embedOnly || !showLanguageToggle) return;
    const q = searchParams.get("lang");
    if (q === "en" || q === "es") setLanguage(q);
  }, [embedOnly, searchParams, setLanguage, showLanguageToggle]);

  useEffect(() => {
    if (!shouldAutoPrint) return;
    const id = window.setTimeout(() => {
      window.print();
    }, 350);
    return () => window.clearTimeout(id);
  }, [shouldAutoPrint]);

  const openPrintPreviewTab = (): void => {
    const params = new URLSearchParams();
    params.set("embed", "1");
    params.set("sheet", "1");
    if (includeLangInPrintParams) {
      params.set("lang", language);
    }
    params.set("scale", String(previewScale));
    params.set("print", "1");
    window.open(`${pathname}?${params.toString()}`, "_blank", "noopener,noreferrer");
  };

  const rootClass = [
    "one-pager-root one-pager-white",
    rootClassName,
    embedOnly
      ? `one-pager-embed${sheetOnly ? " one-pager-sheet-only-host" : ""}`
      : "one-pager-cash-preview-root flex min-h-screen min-h-[100dvh] flex-col",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass} data-theme="light" {...rootDataAttrs}>
      {!embedOnly && (
        <div className="one-pager-no-print flex flex-wrap items-center justify-center gap-3 border-b border-border bg-bg px-2 py-2">
          {showLanguageToggle && (
            <div
              className="flex items-center rounded-full border border-border bg-bg-raised p-0.5 text-[0.65rem] font-mono uppercase tracking-[0.12em] shadow-sm"
              role="group"
              aria-label={t("nav.language")}
            >
              <button
                type="button"
                onClick={() => setLanguage("en")}
                aria-pressed={language === "en"}
                className={`rounded-full px-2.5 py-1.5 transition-colors ${
                  language === "en" ? "bg-accent/15 text-accent" : "text-fg-4 hover:text-fg-2"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("es")}
                aria-pressed={language === "es"}
                className={`rounded-full px-2.5 py-1.5 transition-colors ${
                  language === "es" ? "bg-accent/15 text-accent" : "text-fg-4 hover:text-fg-2"
                }`}
              >
                ES
              </button>
            </div>
          )}

          <div
            className="flex items-center rounded-full border border-border bg-bg-raised p-0.5 text-[0.65rem] font-mono uppercase tracking-[0.12em] shadow-sm"
            role="group"
            aria-label={resolvedPreviewScaleAria}
          >
            {ONE_PAGER_PREVIEW_SCALES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPreviewScale(s)}
                aria-pressed={previewScale === s}
                className={`min-w-[2.35rem] rounded-full px-2 py-1.5 tabular-nums transition-colors ${
                  previewScale === s ? "bg-accent/15 text-accent" : "text-fg-4 hover:text-fg-2"
                }`}
              >
                {s}×
              </button>
            ))}
          </div>

          <nav
            className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-border bg-bg-raised p-0.5 text-[0.65rem] font-mono uppercase tracking-[0.12em] shadow-sm"
            aria-label={t("onePager.nav.ariaLabel")}
          >
            {ONE_PAGER_ROUTES.map((route) => {
              const isCurrent = route.id === onePagerId;
              return isCurrent ? (
                <span
                  key={route.id}
                  aria-current="page"
                  className="rounded-full bg-accent/15 px-2.5 py-1.5 font-semibold text-accent"
                >
                  {t(route.labelKey)}
                </span>
              ) : (
                <Link
                  key={route.id}
                  to={route.path}
                  className="rounded-full px-2.5 py-1.5 text-fg-4 transition-colors hover:bg-bg-alt hover:text-fg-2"
                >
                  {t(route.labelKey)}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => openPrintPreviewTab()}
            className="inline-flex items-center gap-2 rounded border border-border bg-bg-raised px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-fg shadow-sm hover:border-accent hover:text-accent"
          >
            <Printer className="size-3.5" aria-hidden />
            {resolvedPrintLabel}
          </button>
        </div>
      )}

      {embedOnly ? (
        <div
          className={`one-pager-cash-zoom mx-auto w-full max-w-full ${sheetOnly ? "" : "pb-10 pt-4"}`}
          style={
            embedScale !== 1 ? ({ zoom: embedScale } satisfies CSSProperties) : undefined
          }
        >
          {children}
        </div>
      ) : (
        <div className="one-pager-cash-preview flex min-h-0 flex-1 flex-col overflow-auto">
          <div
            className="one-pager-cash-zoom mx-auto pb-10 pt-4"
            style={{ zoom: previewScale } as CSSProperties}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
