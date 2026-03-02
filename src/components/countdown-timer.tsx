import { useEffect, useState } from "react";

interface TimeUnit {
  value: number;
  label: string;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

const EVENT_DATE = new Date("2026-03-07T10:00:00-06:00");

function getTimeLeft(): TimeUnit[] {
  const now = new Date();
  const diff = EVENT_DATE.getTime() - now.getTime();

  if (diff <= 0) {
    return [
      { value: 0, label: "días" },
      { value: 0, label: "horas" },
      { value: 0, label: "min" },
      { value: 0, label: "seg" },
    ];
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return [
    { value: days, label: "días" },
    { value: hours, label: "horas" },
    { value: minutes, label: "min" },
    { value: seconds, label: "seg" },
  ];
}

export function CountdownTimer() {
  const [units, setUnits] = useState<TimeUnit[]>(getTimeLeft);
  const [tick, setTick] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setUnits(getTimeLeft());
      setTick((t) => !t);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`relative overflow-hidden font-mono text-[clamp(2rem,5vw,3.5rem)] font-bold text-fg leading-none tracking-[-0.02em] ${tick ? "animate-[countdown-tick_0.1s_ease]" : ""}`}
            >
              <span
                className={`transition-colors duration-300 ease ${unit.label === "días" && unit.value <= 7 ? "text-accent" : ""}`}
              >
                {pad(unit.value)}
              </span>
            </div>
            <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-fg-3 mt-1">
              {unit.label}
            </span>
          </div>
          {i < units.length - 1 && (
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
