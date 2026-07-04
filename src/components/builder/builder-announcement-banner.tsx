import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { X } from "lucide-react";

import { api } from "../../../convex/_generated/api";
import { isConvexConfigured } from "../../lib/convex-client";
import { useTranslation } from "../../context/language-context";

const DISMISSED_KEY = "builder_dismissed_announcements";

function readDismissed(): string[] {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function BuilderAnnouncementBanner() {
  if (!isConvexConfigured) return null;
  return <BuilderAnnouncementBannerInner />;
}

function BuilderAnnouncementBannerInner() {
  const { t, language } = useTranslation();
  const [dismissed, setDismissed] = useState<string[]>(readDismissed);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const announcements = useQuery(api.announcements.listActiveAnnouncements, {
    locale: language,
    now,
  });

  const active = announcements?.find((a) => !dismissed.includes(a.id));
  if (!active) return null;

  function dismiss(id: string) {
    setDismissed((prev) => {
      const next = [...prev, id];
      try {
        localStorage.setItem(DISMISSED_KEY, JSON.stringify(next));
      } catch {
        /* localStorage unavailable */
      }
      return next;
    });
  }

  const urgent = active.priority === "urgent";

  return (
    <div
      role="status"
      className={`border-b ${
        urgent ? "border-accent/50 bg-accent/10" : "border-border-faint bg-surface"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 section-padding py-2.5">
        <span
          className={`shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.16em] ${
            urgent ? "text-accent" : "text-fg-4"
          }`}
        >
          {t("builder.announcement.label")}
        </span>
        <p className="min-w-0 flex-1 font-display text-[0.925rem] leading-[1.5] text-fg-2">
          {active.message}
        </p>
        <button
          type="button"
          onClick={() => dismiss(active.id)}
          aria-label={t("builder.announcement.dismiss")}
          className="shrink-0 text-fg-4 transition-colors hover:text-accent"
        >
          <X className="size-4" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </div>
  );
}
