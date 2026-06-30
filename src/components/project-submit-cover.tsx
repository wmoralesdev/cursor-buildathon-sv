import { ArrowRight, Clock, Users } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { DarkGrainyPosterBackground } from "./dark-grainy-poster-background";
import { CursorLockup } from "./sponsor-logos";
import { useTranslation } from "../context/language-context";

type ProjectSubmitCoverProps = {
  onStart: () => void;
};

const easeOut = [0.16, 1, 0.3, 1] as const;

export function ProjectSubmitCover({ onStart }: ProjectSubmitCoverProps) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduceMotion
      ? { initial: false, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.75, delay, ease: easeOut },
        };

  return (
    <div className="submit-cover relative flex min-h-[calc(100dvh-var(--site-nav-height))] flex-col overflow-hidden bg-bg">
      <div className="submit-cover__light-bg" aria-hidden />
      <DarkGrainyPosterBackground className="submit-cover__dark-bg" />

      <div className="submit-cover__grid pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-between section-padding py-10 sm:py-14 lg:py-16">
        <motion.header {...fadeUp(0.05)} className="flex items-start justify-between gap-6">
          <div className="space-y-4">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-accent sm:text-xs">
              {t("submit.cover.eyebrow")}
            </p>
            <CursorLockup
              alt="Cursor"
              className="h-6 w-auto object-contain opacity-90 sm:h-7"
            />
          </div>

          <div className="hidden shrink-0 flex-col items-end gap-1 text-right sm:flex">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-fg-4">
              {t("hero.regionYear")}
            </p>
            <p className="font-display text-sm font-semibold tracking-tight text-fg-2">
              {t("hero.brief.window.value")}
            </p>
          </div>
        </motion.header>

        <div className="my-10 flex flex-1 flex-col justify-center sm:my-14">
          <motion.div {...fadeUp(0.15)} className="max-w-3xl">
            <h1 className="font-display text-[clamp(2.5rem,8vw,4.75rem)] font-bold leading-[0.92] tracking-[-0.03em] text-fg">
              <span className="block">{t("submit.cover.titleLine1")}</span>
              <span className="submit-cover__title-accent mt-1 inline-block">
                {t("submit.cover.titleLine2")}
              </span>
            </h1>

            <motion.p
              {...fadeUp(0.28)}
              className="mt-6 max-w-xl text-base leading-relaxed text-fg-3 sm:mt-8 sm:text-lg"
            >
              {t("submit.cover.subtitle")}
            </motion.p>
          </motion.div>

          <motion.ul
            {...fadeUp(0.38)}
            className="mt-8 flex flex-wrap gap-3 sm:mt-10"
            aria-label={t("submit.cover.metaAria")}
          >
            <li className="submit-cover__pill">
              <Clock className="size-3.5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
              <span>{t("submit.cover.meta.time")}</span>
            </li>
            <li className="submit-cover__pill">
              <Users className="size-3.5 shrink-0 text-accent-2" strokeWidth={1.75} aria-hidden />
              <span>{t("submit.cover.meta.team")}</span>
            </li>
            <li className="submit-cover__pill submit-cover__pill--muted hidden sm:inline-flex">
              <span>{t("submit.cover.meta.public")}</span>
            </li>
          </motion.ul>
        </div>

        <motion.footer
          {...fadeUp(0.48)}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="max-w-sm font-mono text-[0.65rem] uppercase leading-relaxed tracking-[0.14em] text-fg-4">
            {t("submit.cover.hint")}
          </p>

          <button
            type="button"
            onClick={onStart}
            className="btn-phosphor group inline-flex w-full items-center justify-center gap-3 px-8 py-4 text-sm sm:w-auto"
          >
            {t("submit.cover.cta")}
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2}
              aria-hidden
            />
          </button>
        </motion.footer>
      </div>

      {!reduceMotion ? (
        <motion.div
          className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          aria-hidden
        >
          <motion.span
            className="block h-8 w-px bg-gradient-to-b from-accent/60 to-transparent"
            animate={{ opacity: [0.4, 1, 0.4], scaleY: [0.85, 1, 0.85] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      ) : null}
    </div>
  );
}
