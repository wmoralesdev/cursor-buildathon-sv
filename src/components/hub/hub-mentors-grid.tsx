import { useQuery } from "convex/react";
import { ExternalLink } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useTranslation } from "../../context/language-context";
import { isConvexConfigured } from "../../lib/convex-client";
import { HubCard } from "./hub-ui-primitives";

export function HubMentorsGrid() {
  const { t } = useTranslation();
  const mentors = useQuery(
    api.hub.mentors.listMentors,
    isConvexConfigured ? { remoteOnly: true } : "skip",
  );

  if (mentors === undefined) {
    return (
      <HubCard title={t("hub.mentors.title")} tag={t("hub.mentors.tag")}>
        <div className="h-24 animate-pulse bg-border-faint" />
      </HubCard>
    );
  }

  return (
    <HubCard title={t("hub.mentors.title")} tag={t("hub.mentors.tag")}>
      <p className="mb-5 font-display text-[0.925rem] text-fg-2">{t("hub.mentors.intro")}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {mentors.map((mentor) => (
          <div key={mentor._id} className="border border-border-faint p-4">
            <p className="font-display text-[1rem] text-fg">{mentor.name}</p>
            <p className="mt-1 font-display text-[0.875rem] text-fg-2">{mentor.role}</p>
            {mentor.company ? (
              <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-fg-3">
                {mentor.company}
              </p>
            ) : null}
            {mentor.bio ? (
              <p className="mt-3 font-display text-[0.85rem] leading-relaxed text-fg-2">{mentor.bio}</p>
            ) : null}
            {mentor.bookingUrl ? (
              <a
                href={mentor.bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 border border-accent px-4 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent transition-colors hover:bg-accent/10"
              >
                {t("hub.mentors.book")}
                <ExternalLink className="size-3.5" />
              </a>
            ) : (
              <p className="mt-4 font-display text-[0.8rem] text-fg-3">{t("hub.mentors.noBooking")}</p>
            )}
          </div>
        ))}
      </div>
    </HubCard>
  );
}
