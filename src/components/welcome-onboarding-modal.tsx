import { useEffect, useId, useMemo, useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

import { useTranslation } from "../context/language-context";

const AI_LABS_LINKS_URL = "https://ailabs.sv/links";
const WHATSAPP_INVITE_URL = "https://chat.whatsapp.com/Ga8mG1fqDM9C0ryxAw1eIj";

const OVERLAY_TRANSITION = { duration: 0.22 };
const SHEET_TRANSITION = { type: "spring" as const, stiffness: 320, damping: 30 };
const STEP_TRANSITION = { type: "spring" as const, stiffness: 140, damping: 24 };

type Props = {
  open: boolean;
  onDismiss: () => void;
};

export function WelcomeOnboardingModal({ open, onDismiss }: Props) {
  const { t } = useTranslation();
  const headingId = useId();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onDismiss]);

  const progressLabel = useMemo(
    () =>
      t("welcome.onboarding.progress").replace(/\{step\}/g, String(step + 1)),
    [t, step],
  );

  const linkBtnClass =
    "inline-flex w-full items-center justify-center gap-2 rounded-none border border-accent/60 bg-accent px-4 py-2.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-bg sm:text-xs sm:tracking-[0.14em]";

  function stepContent(forStep: number) {
    switch (forStep) {
      case 0:
        return (
          <section className="space-y-3" aria-labelledby="welcome-onboarding-s1-title">
            <h3 id="welcome-onboarding-s1-title" className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-fg">
              {t("welcome.onboarding.step1.title")}
            </h3>
            <p className="text-[0.7rem] leading-snug text-fg-3 sm:text-sm">{t("welcome.onboarding.step1.body")}</p>
            <motion.a
              href={AI_LABS_LINKS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkBtnClass}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              <ExternalLink className="size-3.5 shrink-0 sm:size-4" strokeWidth={1.75} aria-hidden />
              {t("welcome.onboarding.step1.cta")}
            </motion.a>
          </section>
        );
      case 1:
        return (
          <section className="space-y-3" aria-labelledby="welcome-onboarding-s2-title">
            <h3 id="welcome-onboarding-s2-title" className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-fg">
              {t("welcome.onboarding.step2.title")}
            </h3>
            <p className="text-[0.7rem] leading-snug text-fg-3 sm:text-sm">{t("welcome.onboarding.step2.body")}</p>
            <motion.a
              href={WHATSAPP_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkBtnClass}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              <ExternalLink className="size-3.5 shrink-0 sm:size-4" strokeWidth={1.75} aria-hidden />
              {t("welcome.onboarding.step2.cta")}
            </motion.a>
          </section>
        );
      case 2:
        return (
          <section className="space-y-3" aria-labelledby="welcome-onboarding-s3-title">
            <h3 id="welcome-onboarding-s3-title" className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-fg">
              {t("welcome.onboarding.step3.title")}
            </h3>
            <p className="text-[0.7rem] leading-snug text-fg-3 sm:text-sm">{t("welcome.onboarding.step3.body")}</p>
            <ul className="list-inside list-disc space-y-1.5 text-[0.7rem] leading-snug text-fg-2 sm:text-sm">
              <li>{t("welcome.onboarding.tagBulletLinkedIn")}</li>
              <li>{t("welcome.onboarding.tagBulletX")}</li>
            </ul>
            <Link
              to="/builder"
              onClick={onDismiss}
              className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-accent no-underline hover:underline sm:text-xs"
            >
              {t("nav.builder")}
              <ArrowRight className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
            </Link>
          </section>
        );
      default:
        return null;
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="welcome-onboarding-backdrop"
          className="fixed inset-0 z-[95] flex items-end justify-center bg-[#050505]/92 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:items-center sm:p-6"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={OVERLAY_TRANSITION}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onDismiss();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            className="flex w-full max-w-md flex-col gap-5 border border-border bg-bg-deep p-4 shadow-[0_28px_100px_-24px_rgba(255,75,0,0.35)] sm:gap-6 sm:p-6"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={SHEET_TRANSITION}
          >
            <motion.header
              className="space-y-2 border-b border-border-faint pb-4"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...STEP_TRANSITION, delay: 0.04 }}
            >
              <p className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-fg-4 sm:text-[0.6rem]">
                {t("welcome.onboarding.kicker")}
              </p>
              <h2 id={headingId} className="font-display text-xl font-semibold tracking-tight text-fg sm:text-2xl">
                {t("welcome.onboarding.title")}
              </h2>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-fg-4 sm:text-[0.65rem] sm:tracking-[0.14em]">
                {progressLabel}
              </p>
              <p className="text-[0.7rem] leading-snug text-fg-3 sm:text-sm sm:leading-relaxed">
                {t("welcome.onboarding.lead")}
              </p>
            </motion.header>

            <div className="relative min-h-[7.5rem] overflow-hidden sm:min-h-[8rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -14 }}
                  transition={STEP_TRANSITION}
                >
                  {stepContent(step)}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <motion.button
                type="button"
                disabled={step === 0}
                className="inline-flex shrink-0 items-center justify-center border border-border-faint px-4 py-2.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-fg-2 transition-colors hover:border-fg-5 hover:text-fg disabled:pointer-events-none disabled:opacity-30 sm:py-3 sm:text-xs"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                whileTap={step === 0 ? undefined : { scale: 0.98 }}
              >
                {t("welcome.onboarding.back")}
              </motion.button>
              <motion.button
                type="button"
                className={`inline-flex shrink-0 items-center justify-center border px-5 py-2.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] sm:py-3 sm:text-xs sm:tracking-[0.14em] ${step === 2 ? "border-accent/60 bg-accent text-bg" : "border-fg bg-fg text-bg"}`}
                onClick={() => {
                  if (step >= 2) {
                    onDismiss();
                  } else {
                    setStep((s) => s + 1);
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
              >
                {step >= 2 ? t("welcome.onboarding.done") : t("welcome.onboarding.next")}
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              {step >= 2 ? (
                <motion.p
                  key="wait-note"
                  className="text-center text-[0.68rem] leading-snug text-fg-5 sm:text-sm"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={STEP_TRANSITION}
                >
                  {t("welcome.onboarding.waitNote")}
                </motion.p>
              ) : (
                <div key="wait-spacer" className="h-px shrink-0" aria-hidden />
              )}
            </AnimatePresence>

            <div className="flex justify-center gap-1.5" aria-label={progressLabel}>
              {[0, 1, 2].map((i) => (
                <motion.button
                  key={i}
                  type="button"
                  className={`h-1 max-w-[3rem] flex-1 rounded-none ${i === step ? "bg-accent" : "bg-border-faint hover:bg-border"}`}
                  aria-label={`${progressLabel}: ${String(i + 1)}`}
                  aria-current={i === step ? "step" : undefined}
                  onClick={() => setStep(i)}
                  animate={{ opacity: i === step ? 1 : 0.48, scaleY: i === step ? 1.6 : 1 }}
                  transition={STEP_TRANSITION}
                  whileHover={{ opacity: i === step ? 1 : 0.72 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ transformOrigin: "center" }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
