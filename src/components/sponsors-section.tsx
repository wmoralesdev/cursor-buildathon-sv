import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useTranslation } from "../context/language-context";
import { SectionHeading } from "./section-heading";

const SPONSORS = ["UVG", "Vudy", "PAQwallet", "VU"];
const PARTNERS = ["CCOTI", "the502project"];

export function SponsorsSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="sponsors" ref={ref} className="section-padding relative py-28 md:py-36">
      <div className="accent-rule mx-auto mb-20 max-w-4xl" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <SectionHeading label="sponsors.label" title="sponsors.title" lineNumber="04" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <p className="mb-6 text-xs font-semibold tracking-[0.2em] uppercase text-accent">
            {t("sponsors.sponsors")}
          </p>
          <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {SPONSORS.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                className="glass-card flex h-24 items-center justify-center rounded-xl transition-all duration-300 sm:h-28"
              >
                <span className="font-display text-xl font-bold tracking-tight text-text-primary/80 sm:text-2xl">
                  {name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <p className="mb-6 text-xs font-semibold tracking-[0.2em] uppercase text-electric">
            {t("sponsors.partners")}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:max-w-lg sm:grid-cols-3">
            {PARTNERS.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.08, duration: 0.5 }}
                className="glass-card flex h-20 items-center justify-center rounded-xl transition-all duration-300"
              >
                <span className="font-display text-base font-semibold tracking-tight text-text-secondary">
                  {name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
