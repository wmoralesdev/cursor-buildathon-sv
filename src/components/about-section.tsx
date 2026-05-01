import { useMemo, type ComponentType } from "react";
import { motion } from "motion/react";
import { CodeXml, Compass, Lightbulb, Sparkles } from "lucide-react";

import { AnchorHeading } from "./anchor-heading";
import { useTranslation } from "../context/language-context";
import type { TranslationKey } from "../i18n/translations";

interface ProfileRow {
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}

const PROFILES: ProfileRow[] = [
  { Icon: CodeXml,   titleKey: "about.profile1.title", descKey: "about.profile1.desc" },
  { Icon: Compass,   titleKey: "about.profile2.title", descKey: "about.profile2.desc" },
  { Icon: Lightbulb, titleKey: "about.profile3.title", descKey: "about.profile3.desc" },
  { Icon: Sparkles,  titleKey: "about.profile4.title", descKey: "about.profile4.desc" },
];

export function AboutSection() {
  const { t } = useTranslation();
  const chips = useMemo(
    () => ["about.chip1", "about.chip2", "about.chip3"] as const,
    [],
  );

  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 lg:py-40 section-padding bg-bg"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">
          {/* Left rail — eyebrow, headline, intro, chips */}
          <div className="lg:col-span-5 reveal min-w-0">
            <span className="tag mb-6 inline-block">{t("about.tag")}</span>
            <AnchorHeading id="about">
              <h2 className="font-display font-medium text-fg tracking-[-0.02em] leading-[1] text-[clamp(2rem,4.4vw,3.4rem)]">
                {t("about.title1")}
                <br />
                <span className="text-accent">{t("about.title2")}</span>
              </h2>
            </AnchorHeading>

            <p className="mt-7 max-w-[44ch] font-display text-base text-fg-2 leading-[1.75]">
              {t("about.p1")}
            </p>
            <p className="mt-4 max-w-[44ch] font-display text-base text-fg-3 leading-[1.75]">
              {t("about.p2")}
            </p>

            <ul className="mt-8 flex flex-wrap gap-2">
              {chips.map((key) => (
                <li
                  key={key}
                  className="inline-flex items-center gap-2 border border-border px-3 py-1.5 font-mono text-[0.65rem] tracking-[0.08em] uppercase text-fg-3"
                >
                  <span aria-hidden className="h-1 w-1 rounded-full bg-accent" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>

          {/* Right rail — profile data list */}
          <ol className="lg:col-span-7 min-w-0 divide-y divide-border-faint border-y border-border-faint">
            {PROFILES.map((p, i) => {
              const Icon = p.Icon;
              return (
                <motion.li
                  key={p.titleKey}
                  className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 py-7 sm:py-8"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-center gap-3 pt-1">
                    <span className="font-mono text-[0.65rem] tracking-[0.18em] text-fg-5 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Icon
                      className="h-4 w-4 text-accent"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-base sm:text-lg font-semibold text-fg tracking-[-0.005em]">
                      {t(p.titleKey)}
                    </h3>
                    <p className="mt-2 max-w-[60ch] font-display text-sm text-fg-3 leading-[1.7]">
                      {t(p.descKey)}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
