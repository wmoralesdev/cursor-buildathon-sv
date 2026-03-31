import { useMemo } from "react";

import { AnchorHeading } from "./anchor-heading";
import { useTranslation } from "../context/language-context";
import type { TranslationKey } from "../i18n/translations";

export function AboutSection() {
  const { t } = useTranslation();

  const profiles = useMemo(
    () =>
      [
        { icon: "⌨", titleKey: "about.profile1.title", descKey: "about.profile1.desc" },
        { icon: "◈", titleKey: "about.profile2.title", descKey: "about.profile2.desc" },
        { icon: "◉", titleKey: "about.profile3.title", descKey: "about.profile3.desc" },
        { icon: "◎", titleKey: "about.profile4.title", descKey: "about.profile4.desc" },
      ] as { icon: string; titleKey: TranslationKey; descKey: TranslationKey }[],
    [],
  );

  const chips = useMemo(
    () => ["about.chip1", "about.chip2", "about.chip3"] as const,
    [],
  );

  return (
    <section id="about" className="group relative py-28 sm:py-36 lg:py-48 section-padding bg-bg">
      <div className="absolute left-0 top-0 bottom-0 w-px border-accent-left" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-28 items-start">
          <div className="reveal min-w-0">
            <span className="tag mb-6 inline-block">{t("about.tag")}</span>
            <AnchorHeading id="about">
              <h2 className="font-bold uppercase leading-[0.92] mb-8 font-display text-[clamp(2.5rem,6vw,4.5rem)] text-fg tracking-[-0.02em]">
                {t("about.title1")}
                <br />
                <span className="text-accent">{t("about.title2")}</span>
              </h2>
            </AnchorHeading>
            <p className="mb-6 font-display text-[1.05rem] text-fg-2 leading-[1.7] max-w-[min(480px,100%)]">
              {t("about.p1")}
            </p>
            <p className="font-display text-[1.05rem] text-fg-2 leading-[1.7] max-w-[min(480px,100%)]">
              {t("about.p2")}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {chips.map((key) => (
                <div
                  key={key}
                  className="inline-flex items-center gap-3 border border-border px-5 py-3 bg-accent/4"
                >
                  <span className="text-accent text-base">▸</span>
                  <span className="font-mono text-[0.7rem] tracking-[0.08em] text-fg-2 uppercase">
                    {t(key)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 min-w-0">
            {profiles.map((p, i) => (
              <div
                key={p.titleKey}
                className="reveal group min-w-0 wrap-break-word p-7 border border-border bg-bg-raised cursor-default profile-card-hover"
                style={{ "--delay": `${i * 0.1}s` } as React.CSSProperties}
              >
                <div className="text-[1.4rem] mb-3 text-accent font-mono">{p.icon}</div>
                <h3 className="font-semibold mb-2 font-display text-[0.95rem] text-fg tracking-[0.05em] uppercase">
                  {t(p.titleKey)}
                </h3>
                <p className="font-display text-[0.82rem] text-fg-3 leading-[1.6]">{t(p.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
