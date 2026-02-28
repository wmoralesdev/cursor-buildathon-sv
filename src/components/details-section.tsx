import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useTranslation } from "../context/language-context";
import { SectionHeading } from "./section-heading";
import type { TranslationKey } from "../i18n/translations";

interface DetailItem {
  icon: React.ReactNode;
  label: TranslationKey;
  value: TranslationKey;
}

const DETAILS: DetailItem[] = [
  { icon: <Calendar size={22} />, label: "details.date.label", value: "details.date.value" },
  { icon: <Clock size={22} />, label: "details.time.label", value: "details.time.value" },
  { icon: <MapPin size={22} />, label: "details.venue.label", value: "details.venue.value" },
  { icon: <Users size={22} />, label: "details.format.label", value: "details.format.value" },
];

export function DetailsSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="details" ref={ref} className="section-padding relative py-28 md:py-36">
      <div className="accent-rule mx-auto mb-20 max-w-4xl" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <SectionHeading label="details.label" title="details.title" lineNumber="03" />
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DETAILS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.6 }}
              className="glass-card rounded-2xl p-6 transition-all duration-300"
            >
              <div className="mb-4 text-accent">{item.icon}</div>
              <p className="mb-1 text-xs font-semibold tracking-widest uppercase text-text-muted">
                {t(item.label)}
              </p>
              <p className="font-display text-base font-medium leading-snug whitespace-pre-line">
                {t(item.value)}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-10 max-w-2xl text-sm leading-relaxed text-text-muted"
        >
          {t("details.note")}
        </motion.p>
      </div>
    </section>
  );
}
