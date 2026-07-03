import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { HubSponsorId } from "../../../convex/lib/hubSponsorIds";
import { sponsors } from "../../data/sponsors";
import { useTranslation } from "../../context/language-context";
import { useHubUser } from "../../hooks/use-hub-user";
import { HubButton, HubCard, HubError, HubField, HubTextarea } from "./hub-ui-primitives";

const sponsorNameById = Object.fromEntries(sponsors.map((s) => [s.id, s.name]));

export function HubSponsorFeedback() {
  const { t } = useTranslation();
  const { hubQueryArgs } = useHubUser();
  const pending = useQuery(api.hub.sponsorFeedback.getMyPendingFeedback, hubQueryArgs);
  const submitFeedback = useMutation(api.hub.sponsorFeedback.submitFeedback);

  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  if (pending === undefined) {
    return (
      <HubCard title={t("hub.feedback.title")} tag={t("hub.feedback.tag")}>
        <div className="h-16 animate-pulse bg-border-faint" />
      </HubCard>
    );
  }

  if (pending.pending.length === 0) {
    return (
      <HubCard title={t("hub.feedback.title")} tag={t("hub.feedback.tag")}>
        <p className="font-display text-[0.925rem] text-fg-2">{t("hub.feedback.noneRequired")}</p>
      </HubCard>
    );
  }

  async function handleSubmit(sponsorId: HubSponsorId) {
    setBusy(sponsorId);
    setError(null);
    try {
      await submitFeedback({
        sponsorId,
        feedback: drafts[sponsorId] ?? "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("hub.error.generic"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <HubCard title={t("hub.feedback.title")} tag={t("hub.feedback.tag")}>
      <p className="mb-5 font-display text-[0.925rem] text-fg-2">{t("hub.feedback.intro")}</p>
      <div className="space-y-5">
        {pending.pending.map((item) => (
          <div key={item.sponsorId} className="border border-border-faint p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="font-display text-[0.95rem] text-fg">
                {sponsorNameById[item.sponsorId] ?? item.sponsorId}
              </h4>
              <span className={item.submitted ? "text-accent" : "text-fg-3"}>
                {item.submitted ? t("hub.feedback.done") : t("hub.feedback.required")}
              </span>
            </div>
            <HubField label={t("hub.feedback.field")}>
              <HubTextarea
                value={drafts[item.sponsorId] ?? item.feedback ?? ""}
                onChange={(e) =>
                  setDrafts((current) => ({ ...current, [item.sponsorId]: e.target.value }))
                }
              />
            </HubField>
            <HubButton
              disabled={busy === item.sponsorId}
              onClick={() => handleSubmit(item.sponsorId)}
            >
              {t("hub.feedback.save")}
            </HubButton>
          </div>
        ))}
      </div>
      <HubError message={error} />
    </HubCard>
  );
}
