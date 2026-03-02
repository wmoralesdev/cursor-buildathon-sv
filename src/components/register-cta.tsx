import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "../context/language-context";

const LUMA_URL = "https://luma.com/935r7zp6";

export function RegisterCta() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section-padding relative overflow-hidden py-32 md:py-44">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,107,44,0.08)_0%,transparent_65%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl leading-[1.1] font-bold tracking-tight whitespace-pre-line sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {t("cta.title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 text-lg text-text-secondary md:text-xl"
        >
          {t("cta.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10"
        >
          <a
            href={LUMA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-xl border-2 border-accent bg-accent/10 px-10 py-5 font-display text-lg font-semibold text-accent transition-all duration-300 hover:bg-accent hover:text-[#050505] hover:shadow-[0_0_60px_rgba(255,107,44,0.3)]"
          >
            {t("cta.button")}
            <ArrowUpRight
              size={20}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-6 text-xs tracking-wider text-text-muted"
        >
          {t("cta.note")}
        </motion.p>
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="relative z-10 mt-32 border-t border-white/5 pt-8"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-text-muted sm:flex-row">
          <p>
            {t("footer.hosted")}{" "}
            <span className="text-text-secondary">Oscar Morales</span> &{" "}
            <span className="text-text-secondary">Walter Morales</span>
          </p>
          <p>
            {t("footer.powered")}{" "}
            <a
              href="https://cursor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent transition-colors hover:text-accent/80"
            >
              Cursor
            </a>{" "}
            &{" "}
            <a
              href="https://cursor.com/community"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary transition-colors hover:text-accent"
            >
              Cursor Community
            </a>
          </p>
        </div>
      </motion.footer>
    </section>
  );
}
