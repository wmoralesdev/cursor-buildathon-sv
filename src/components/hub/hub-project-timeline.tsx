import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { HubSponsorId } from "../../../convex/lib/hubSponsorIds";
import { sponsors } from "../../data/sponsors";
import { useTranslation } from "../../context/language-context";
import type { TranslationKey } from "../../i18n/translations";
import { useHubUser } from "../../hooks/use-hub-user";
import { HubButton, HubCard } from "./hub-ui-primitives";

const sponsorById = Object.fromEntries(sponsors.map((s) => [s.id, s]));

type TimelineEvent = {
  _id: string;
  kind: string;
  meta?: {
    from?: string;
    to?: string;
    sponsorId?: HubSponsorId;
  };
  createdAt: number;
  actor: {
    _id: string;
    name: string;
    avatarUrl?: string;
  };
};

function formatRelativeTime(timestamp: number, locale: string): string {
  const diffMs = timestamp - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const absSec = Math.abs(diffSec);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (absSec < 60) return rtf.format(diffSec, "second");
  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute");
  const diffHour = Math.round(diffMin / 60);
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, "hour");
  const diffDay = Math.round(diffHour / 24);
  return rtf.format(diffDay, "day");
}

function resolveSponsorName(sponsorId?: HubSponsorId): string {
  if (!sponsorId) return "";
  return sponsorById[sponsorId]?.name ?? sponsorId;
}

function formatEventLabel(
  t: (key: TranslationKey) => string,
  event: TimelineEvent,
): string {
  const templateKey = `hub.project.timeline.${event.kind}` as TranslationKey;
  const template = t(templateKey);
  const sponsor = resolveSponsorName(event.meta?.sponsorId);

  return template
    .replace("{name}", event.actor.name)
    .replace("{title}", event.meta?.to ?? "")
    .replace("{from}", event.meta?.from ?? "")
    .replace("{to}", event.meta?.to ?? "")
    .replace("{sponsor}", sponsor);
}

function TimelineRow({ event, locale, t }: { event: TimelineEvent; locale: string; t: (key: TranslationKey) => string }) {
  return (
    <li className="relative flex gap-4 pb-6 last:pb-0">
      <div className="flex flex-col items-center">
        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" aria-hidden />
        <span className="mt-1 w-px flex-1 bg-border-faint" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 pb-1">
        <div className="flex flex-wrap items-center gap-2">
          {event.actor.avatarUrl ? (
            <img
              src={event.actor.avatarUrl}
              alt=""
              className="size-6 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-6 items-center justify-center rounded-full bg-border-faint font-mono text-[0.6rem] uppercase text-fg-3">
              {event.actor.name.slice(0, 1)}
            </span>
          )}
          <time
            dateTime={new Date(event.createdAt).toISOString()}
            className="font-mono text-[0.65rem] uppercase tracking-[0.08em] text-fg-3"
          >
            {formatRelativeTime(event.createdAt, locale)}
          </time>
        </div>
        <p className="mt-1.5 font-display text-[0.925rem] leading-snug text-fg">
          {formatEventLabel(t, event)}
        </p>
      </div>
    </li>
  );
}

export function HubProjectTimeline() {
  const { t, language } = useTranslation();
  const { hubQueryArgs } = useHubUser();
  const { results, status, loadMore } = usePaginatedQuery(
    api.hub.projects.listTimeline,
    hubQueryArgs,
    { initialNumItems: 20 },
  );

  return (
    <HubCard title={t("hub.project.timeline.title")} tag={t("hub.project.timeline.tag")}>
      {!results?.length ? (
        <p className="font-display text-[0.925rem] text-fg-2">{t("hub.project.timeline.empty")}</p>
      ) : (
        <ol className="list-none">
          {results.map((event) => (
            <TimelineRow key={event._id} event={event} locale={language} t={t} />
          ))}
        </ol>
      )}

      {status === "CanLoadMore" ? (
        <HubButton variant="ghost" className="mt-4" onClick={() => loadMore(20)}>
          {t("hub.project.timeline.loadMore")}
        </HubButton>
      ) : null}
    </HubCard>
  );
}
