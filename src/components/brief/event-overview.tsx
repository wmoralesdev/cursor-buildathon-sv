import { useMemo } from "react";

import { useTranslation } from "../../context/language-context";
import type { TranslationKey } from "../../i18n/translations";

export function EventOverview() {
  const { t } = useTranslation();

  const highlightKeys = useMemo(
    () =>
      [
        { code: "01", titleKey: "overview.h1.title", bodyKey: "overview.h1.body" },
        { code: "02", titleKey: "overview.h2.title", bodyKey: "overview.h2.body" },
        { code: "03", titleKey: "overview.h3.title", bodyKey: "overview.h3.body" },
        { code: "04", titleKey: "overview.h4.title", bodyKey: "overview.h4.body" },
      ] as { code: string; titleKey: TranslationKey; bodyKey: TranslationKey }[],
    [],
  );

  return (
    <section
      id="overview"
      className="relative py-24 sm:py-32 section-padding bg-bg"
    >
      <div className="h-rule mb-16 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5 reveal">
            <span className="tag mb-4 inline-block">{t("overview.tag")}</span>
            <h2 className="font-bold uppercase leading-none font-display text-[clamp(1.8rem,4vw,2.8rem)] text-fg tracking-[-0.02em]">
              {t("overview.title1")}
              <br />
              {t("overview.title2")}
            </h2>
          </div>

          <div className="lg:col-span-7 reveal reveal-delay-1 flex items-center">
            <p className="font-display text-[1.05rem] text-fg-2 leading-[1.8]">{t("overview.lead")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {highlightKeys.map((h, i) => (
            <div
              key={h.code}
              className="reveal border border-border p-8 bg-surface"
              style={{ "--delay": `${i * 0.08}s` } as React.CSSProperties}
            >
              <div className="font-mono text-[0.6rem] tracking-[0.15em] text-fg-5 uppercase mb-4">{h.code}</div>
              <h3 className="font-display text-base font-semibold text-fg uppercase tracking-[0.03em] mb-3">
                {t(h.titleKey)}
              </h3>
              <p className="font-display text-sm text-fg-3 leading-[1.75]">{t(h.bodyKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
