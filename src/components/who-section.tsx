import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Code2, Palette, Rocket, Sparkles } from "lucide-react";
import { useTranslation } from "../context/language-context";
import { SectionHeading } from "./section-heading";
import type { TranslationKey } from "../i18n/translations";

interface AudienceCard {
  icon: React.ReactNode;
  title: TranslationKey;
  desc: TranslationKey;
  accentColor: string;
}

const CARDS: AudienceCard[] = [
  {
    icon: <Code2 size={28} />,
    title: "who.developers.title",
    desc: "who.developers.desc",
    accentColor: "text-accent",
  },
  {
    icon: <Palette size={28} />,
    title: "who.designers.title",
    desc: "who.designers.desc",
    accentColor: "text-electric",
  },
  {
    icon: <Rocket size={28} />,
    title: "who.entrepreneurs.title",
    desc: "who.entrepreneurs.desc",
    accentColor: "text-accent",
  },
  {
    icon: <Sparkles size={28} />,
    title: "who.curious.title",
    desc: "who.curious.desc",
    accentColor: "text-electric",
  },
];

export function WhoSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section-padding relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <SectionHeading label="who.label" title="who.title" lineNumber="02" />
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.6 }}
              className="glass-card group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 md:p-8"
            >
              <div className={`mb-6 ${card.accentColor}`}>
                {card.icon}
              </div>

              <h3 className="font-display mb-3 text-lg font-semibold">
                {t(card.title)}
              </h3>

              <p className="text-sm leading-relaxed text-text-secondary">
                {t(card.desc)}
              </p>

              <div
                className="pointer-events-none absolute -right-8 -bottom-8 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: card.accentColor.includes("electric")
                    ? "rgba(0, 229, 160, 0.08)"
                    : "rgba(255, 107, 44, 0.08)",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
