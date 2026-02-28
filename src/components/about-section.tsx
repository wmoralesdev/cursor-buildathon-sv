import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useTranslation } from "../context/language-context";
import { SectionHeading } from "./section-heading";

const STATS = [
  { value: "about.stat.duration" as const, label: "about.stat.duration.label" as const },
  { value: "about.stat.teams" as const, label: "about.stat.teams.label" as const },
  { value: "about.stat.experience" as const, label: "about.stat.experience.label" as const },
];

export function AboutSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="section-padding relative py-28 md:py-36">
      <div className="accent-rule mx-auto mb-20 max-w-4xl" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeading label="about.label" title="about.title" lineNumber="01" />
        </motion.div>

        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="max-w-lg text-lg leading-relaxed text-text-secondary"
          >
            {t("about.description")}
          </motion.p>

          <div className="grid grid-cols-3 gap-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                className="glass-card rounded-xl p-5 text-center transition-all duration-300"
              >
                <p className="font-display text-3xl font-bold text-accent md:text-4xl">
                  {t(stat.value)}
                </p>
                <p className="mt-2 text-xs leading-snug tracking-wide text-text-muted">
                  {t(stat.label)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
