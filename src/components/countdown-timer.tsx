import { useEffect, useState } from "react";
import { EVENT_START_ISO } from "../constants";
import { useTranslation } from "../context/language-context";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

const EVENT_DATE = new Date(EVENT_START_ISO);

function getTimeLeftValues(): number[] {
  const now = new Date();
  const diff = EVENT_DATE.getTime() - now.getTime();

  if (diff <= 0) {
    return [0, 0, 0, 0];
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return [days, hours, minutes, seconds];
}

export function CountdownTimer() {
  const { t } = useTranslation();
  const [values, setValues] = useState(getTimeLeftValues);
  const [tick, setTick] = useState(false);

  const labels = [
    t("hero.countdown.days"),
    t("hero.countdown.hours"),
    t("hero.countdown.minutes"),
    t("hero.countdown.seconds"),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setValues(getTimeLeftValues());
      setTick((x) => !x);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {values.map((value, i) => (
        <div key={labels[i]} className="flex items-center gap-2 sm:gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`relative overflow-hidden font-mono text-[clamp(2rem,5vw,3.5rem)] font-bold text-fg leading-none tracking-[-0.02em] ${tick ? "animate-[countdown-tick_0.1s_ease]" : ""}`}
            >
              <span
                className={`transition-colors duration-300 ease ${i === 0 && value <= 7 ? "text-accent" : ""}`}
              >
                {pad(value)}
              </span>
            </div>
            <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-fg-3 mt-1">
              {labels[i]}
            </span>
          </div>
          {i < values.length - 1 && (
            <span
              className={`font-mono text-[clamp(1.5rem,3vw,2.5rem)] text-accent leading-none self-start mt-0.5 transition-opacity duration-[500ms] ${tick ? "opacity-100" : "opacity-30"}`}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
