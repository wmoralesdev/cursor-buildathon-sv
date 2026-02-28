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
              className="relative overflow-hidden"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 700,
                color: "#f5f0e8",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                animation: tick ? "countdown-tick 0.1s ease" : undefined,
              }}
            >
              <span
                style={{
                  color: unit.label === "días" && unit.value <= 7 ? "#ff4b00" : undefined,
                  transition: "color 0.3s ease",
                }}
              >
                {pad(unit.value)}
              </span>
            </div>
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#555555",
                marginTop: "4px",
              }}
            >
              {unit.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                color: "#ff4b00",
                lineHeight: 1,
                opacity: tick ? 1 : 0.3,
                transition: "opacity 0.5s ease",
                alignSelf: "flex-start",
                marginTop: "2px",
              }}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
