import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EVENT_START_ISO } from "../constants";
import { useTranslation } from "../context/language-context";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function getTimeLeftValues(targetDate: Date): number[] {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return [0, 0, 0];
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return [days, hours, minutes];
}

interface CountdownTimerProps {
  targetIso?: string;
  /** Slightly larger unit labels for builder hub readability */
  legible?: boolean;
}

export function CountdownTimer({ targetIso = EVENT_START_ISO, legible = false }: CountdownTimerProps) {
  const { t } = useTranslation();
  const targetDate = useMemo(() => new Date(targetIso), [targetIso]);
  const [values, setValues] = useState(() => getTimeLeftValues(targetDate));
  const [tick, setTick] = useState(false);

  const labels = [
    t("hero.countdown.days"),
    t("hero.countdown.hours"),
    t("hero.countdown.minutes"),
  ];

  useEffect(() => {
    setValues(getTimeLeftValues(targetDate));
    const interval = setInterval(() => {
      setValues(getTimeLeftValues(targetDate));
      setTick((x) => !x);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
      {values.map((value, i) => (
        <div key={labels[i]} className="flex items-center gap-1.5 sm:gap-2.5">
          <div className="flex flex-col items-center">
            <div className="relative overflow-hidden font-mono text-[clamp(1.2rem,3.2vw,2.1rem)] font-bold text-fg leading-none tracking-[-0.02em] h-[1.2em]">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={`${i}-${value}`}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={`block ${i === 0 && value <= 7 ? "text-accent" : ""}`}
                >
                  {pad(value)}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className={`font-mono tracking-[0.18em] uppercase text-fg-3 mt-0.5 ${legible ? "text-[0.775rem]" : "text-[0.65rem]"}`}>
              {labels[i]}
            </span>
          </div>
          {i < values.length - 1 && (
            <motion.span
              animate={{ opacity: tick ? 1 : 0.3 }}
              transition={{ duration: 0.5 }}
              className="font-mono text-[clamp(1rem,2.4vw,1.5rem)] text-accent leading-none self-start mt-0.5"
            >
              :
            </motion.span>
          )}
        </div>
      ))}
    </div>
  );
}
