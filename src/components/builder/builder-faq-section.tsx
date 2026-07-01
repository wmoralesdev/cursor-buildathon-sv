import { useMemo, useState } from "react";

import { BUILDER_FAQ_KEYS } from "../../data/builder-faq";
import { useTranslation } from "../../context/language-context";
import { BuilderSectionHeader } from "./builder-section-header";

export function BuilderFaqSection() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<number | null>(null);

  const faqs = useMemo(
    () => BUILDER_FAQ_KEYS.map((k) => ({ q: t(k.q), a: t(k.a) })),
    [t],
  );

  return (
    <section id="faq" className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40 section-padding bg-bg-alt">
      <div className="mx-auto max-w-[1400px]">
        <BuilderSectionHeader
          id="faq"
          tagKey="builder.faq.tag"
          title1Key="builder.faq.title1"
          title2Key="builder.faq.title2"
          asideKey="builder.faq.aside"
        />

        {faqs.length === 0 ? (
          <p className="reveal font-display text-base leading-[1.7] text-fg-3">
            {t("builder.faq.empty")}
          </p>
        ) : (
          <div className="reveal border-t border-border-faint">
            {faqs.map((faq, i) => (
              <div
                key={faq.q}
                className="border-b border-border-faint"
                style={{ "--delay": `${i * 0.05}s` } as React.CSSProperties}
              >
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="group flex w-full cursor-pointer items-start justify-between gap-6 border-none bg-transparent py-6 text-left"
                  aria-expanded={open === i}
                  aria-controls={`builder-faq-answer-${i}`}
                  id={`builder-faq-question-${i}`}
                >
                  <span
                    className={`flex-1 font-display text-base font-medium leading-snug transition-colors duration-200 ${open === i ? "text-fg" : "text-fg-2"}`}
                  >
                    {faq.q}
                  </span>
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center font-mono text-[0.9rem] transition-[color,transform] duration-200 ${open === i ? "rotate-45 text-accent" : "text-fg-5"}`}
                  >
                    +
                  </span>
                </button>

                <div
                  id={`builder-faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`builder-faq-question-${i}`}
                  className="faq-accordion-content"
                  data-open={open === i ? "true" : "false"}
                >
                  <p className="max-w-[640px] pb-6 font-display text-sm leading-[1.8] text-fg-3">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
