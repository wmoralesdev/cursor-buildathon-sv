import { motion } from "motion/react";
import { ArrowRight, MapPin, Calendar, Clock } from "lucide-react";
import { useTranslation } from "../context/language-context";
import { DotGrid } from "./dot-grid";

const LUMA_URL = "https://luma.com/935r7zp6";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <DotGrid />

      <div
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,107,44,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute top-0 left-[20%] h-full w-px bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
        <div className="absolute top-0 left-[80%] h-full w-px bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      </div>

      <div className="section-padding relative z-10 mx-auto max-w-5xl pt-24 pb-16 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-6 font-mono text-xs tracking-[0.3em] text-text-muted"
        >
          {"{ 07.03.2026 }"}
        </motion.p>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl leading-[1.05] font-bold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl"
          >
            Cursor
            <br />
            <span className="text-accent">Hackathon</span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="font-display mt-4 text-lg font-light tracking-wide text-text-secondary sm:text-xl md:text-2xl"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-text-secondary"
        >
          <span className="flex items-center gap-2">
            <Calendar size={14} className="text-accent" />
            {t("hero.date")}
          </span>
          <span className="hidden text-text-muted sm:inline">·</span>
          <span className="flex items-center gap-2">
            <Clock size={14} className="text-accent" />
            {t("hero.time")}
          </span>
          <span className="hidden text-text-muted sm:inline">·</span>
          <span className="flex items-center gap-2">
            <MapPin size={14} className="text-accent" />
            UVG Z15
          </span>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <a
            href={LUMA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-xl bg-accent px-8 py-4 font-display text-base font-semibold text-[#050505] transition-all duration-300 hover:gap-4 hover:shadow-[0_0_40px_rgba(255,107,44,0.25)] hover:brightness-110"
          >
            {t("hero.cta")}
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
          <p className="text-xs tracking-wider text-text-muted">{t("hero.spots")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto h-8 w-px bg-gradient-to-b from-accent/40 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
