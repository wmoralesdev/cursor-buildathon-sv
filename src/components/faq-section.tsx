import { useMemo, useState } from "react";

import { AnchorHeading } from "./anchor-heading";
import { SPONSOR_MAILTO } from "../constants";
import { useTranslation } from "../context/language-context";
import type { TranslationKey } from "../i18n/translations";

const FAQ_KEYS = [
  { q: "faq.q0", a: "faq.a0" },
  { q: "faq.q1", a: "faq.a1" },
  { q: "faq.q2", a: "faq.a2" },
  { q: "faq.q3", a: "faq.a3" },
  { q: "faq.q4", a: "faq.a4" },
  { q: "faq.q5", a: "faq.a5" },
  { q: "faq.q6", a: "faq.a6" },
] as const satisfies { q: TranslationKey; a: TranslationKey }[];

export function FAQSection() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<number | null>(null);

  const faqs = useMemo(
    () => FAQ_KEYS.map((k) => ({ q: t(k.q), a: t(k.a) })),
    [t],
  );

  return (
    <section
      id="faq"
      className="relative py-24 sm:py-32 lg:py-40 section-padding bg-bg"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">
          <div className="lg:col-span-4 reveal lg:sticky lg:top-24 self-start">
            <span className="tag mb-4 inline-block">{t("faq.tag")}</span>
            <AnchorHeading id="faq">
              <h2 className="font-display font-medium text-fg tracking-[-0.02em] leading-[1] text-[clamp(2rem,4.4vw,3rem)]">
                {t("faq.title1")}
                <br />
                <span className="text-accent">{t("faq.title2")}</span>
              </h2>
            </AnchorHeading>
            <p className="mt-5 font-display text-base text-fg-3 leading-[1.7] max-w-[36ch]">
              {t("faq.subtitle")}
            </p>
            <a
              href={SPONSOR_MAILTO}
              className="mt-6 inline-block font-mono text-[0.7rem] text-accent tracking-[0.16em] uppercase no-underline border-b border-accent/40 pb-1 transition-[border-color] duration-200 hover:border-accent"
            >
              {t("faq.toCta")}
            </a>
          </div>

          <div className="lg:col-span-8">
            {faqs.map((faq, i) => (
              <div
                key={faq.q}
                className="reveal border-b border-border-faint"
                style={{ "--delay": `${i * 0.05}s` } as React.CSSProperties}
              >
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full text-left py-6 flex items-start justify-between gap-6 group bg-transparent border-none cursor-pointer"
                  aria-expanded={open === i}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                >
                  <span
                    className={`font-display text-base font-medium leading-snug flex-1 transition-colors duration-200 ${open === i ? "text-fg" : "text-fg-2"}`}
                  >
                    {faq.q}
                  </span>
                  <span
                    className={`font-mono text-[0.9rem] shrink-0 flex items-center justify-center w-6 h-6 mt-0.5 transition-[color,transform] duration-200 ${open === i ? "text-accent rotate-45" : "text-fg-5"}`}
                  >
                    +
                  </span>
                </button>

                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  className="faq-accordion-content"
                  data-open={open === i ? "true" : "false"}
                >
                  <p className="pb-6 font-display text-sm text-fg-3 leading-[1.8] max-w-[600px]">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
