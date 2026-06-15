import { useMemo } from "react";

import { useTranslation } from "../../context/language-context";

export function NumbersSection() {
  const { t } = useTranslation();

  const stats = useMemo(
    () => [
      { id: "s1", value: "~24h+", label: t("numbers.s1.label"), sub: t("numbers.s1.sub") },
      { id: "s2", value: "2–4",   label: t("numbers.s2.label"), sub: t("numbers.s2.sub") },
      { id: "s3", value: "UFG",   label: t("numbers.s3.label"), sub: t("numbers.s3.sub") },
      { id: "s4", value: "CA",    label: t("numbers.s4.label"), sub: t("numbers.s4.sub") },
      { id: "s5", value: t("hero.stat.editionValue"), label: t("numbers.s5.label"), sub: t("numbers.s5.sub") },
      { id: "s6", value: "~200",  label: t("numbers.s6.label"), sub: t("numbers.s6.sub") },
    ],
    [t],
  );

  return (
    <section
      id="numbers"
      className="relative py-20 sm:py-28 bg-accent"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.18) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto section-padding">
        <header className="reveal mb-12 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <span className="inline-block font-mono text-[0.65rem] tracking-[0.18em] uppercase text-[#080808]/70 border border-[#080808]/25 px-2.5 py-1 mb-4">
              {t("numbers.tag")}
            </span>
            <h2 className="font-display font-semibold text-[#080808] tracking-[-0.02em] leading-[1] text-[clamp(1.8rem,4vw,2.8rem)]">
              {t("numbers.title1")}
              <br />
              {t("numbers.title2")}
            </h2>
          </div>
        </header>

        {/* Cockpit-mode rule rows — no boxes, just lines */}
        <ul className="reveal grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[#080808]/15 border-y border-[#080808]/15">
          {stats.map((stat, i) => (
            <li
              key={stat.id}
              className="flex flex-col gap-1 px-5 py-6"
              style={{ "--delay": `${i * 0.05}s` } as React.CSSProperties}
            >
              <div className="font-display text-[clamp(1.85rem,3.6vw,2.6rem)] font-bold text-[#080808] leading-none tracking-[-0.02em] tabular-nums">
                {stat.value}
              </div>
              <div className="font-display text-xs font-semibold text-[#080808]/85 uppercase tracking-[0.06em]">
                {stat.label}
              </div>
              <div className="font-mono text-[0.65rem] tracking-widest text-[#080808]/55 uppercase leading-snug">
                {stat.sub}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
