import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "../context/language-context";

const PRESETS = { short: 180, long: 300 } as const;

function formatTime(seconds: number): string {
  const m = Math.floor(Math.abs(seconds) / 60);
  const s = Math.abs(seconds) % 60;
  const sign = seconds < 0 ? "-" : "";
  return `${sign}${m}:${s.toString().padStart(2, "0")}`;
}

export function PitchTimer() {
  const { t } = useTranslation();
  const [preset, setPreset] = useState<"short" | "long">("short");
  const [remaining, setRemaining] = useState<number>(PRESETS.short);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxSeconds = preset === "short" ? PRESETS.short : PRESETS.long;
  const isOvertime = remaining < 0;

  const tick = useCallback(() => {
    setRemaining((prev) => prev - 1);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, tick]);

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemaining(maxSeconds);
  };

  const handlePresetToggle = () => {
    const next = preset === "short" ? "long" : "short";
    setPreset(next);
    if (!isRunning) setRemaining(PRESETS[next]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        setIsRunning((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="border border-border bg-surface p-3">
      <p className="font-mono text-[0.55rem] tracking-[0.15em] text-fg-5 uppercase mb-2">
        {t("admin.timer.label")}
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={handlePresetToggle}
          className="font-mono text-[0.6rem] tracking-wider uppercase border border-border px-2 py-1 text-fg-4 hover:text-fg hover:border-fg-5 transition-colors"
        >
          {preset === "short" ? t("admin.timer.preset3") : t("admin.timer.preset5")}
        </button>
        <span
          className={`font-display font-bold text-[1.5rem] tabular-nums ${
            isOvertime ? "text-red-400" : "text-fg"
          }`}
        >
          {formatTime(remaining)}
        </span>
        {isOvertime && (
          <span className="font-mono text-[0.55rem] tracking-wider text-red-400 uppercase">
            {t("admin.timer.overtime")}
          </span>
        )}
        <button
          type="button"
          onClick={handleStartPause}
          className="font-mono text-[0.6rem] tracking-wider uppercase border border-accent/40 text-accent px-3 py-1.5 hover:bg-accent/10 transition-colors"
        >
          {isRunning
            ? t("admin.timer.pause")
            : remaining < maxSeconds
              ? t("admin.timer.resume")
              : t("admin.timer.start")}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="font-mono text-[0.6rem] tracking-wider uppercase border border-border text-fg-4 px-2 py-1 hover:text-fg hover:border-fg-5 transition-colors"
        >
          {t("admin.timer.reset")}
        </button>
      </div>
    </div>
  );
}
