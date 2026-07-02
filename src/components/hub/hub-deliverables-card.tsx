import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useHubQueryReady } from "../../hooks/use-hub-query-ready";
import { useTranslation } from "../../context/language-context";
import { HubButton, HubCard, HubError, HubField, HubInput, HubTextarea } from "./hub-ui-primitives";

export function HubDeliverablesCard() {
  const { t } = useTranslation();
  const hubReady = useHubQueryReady();
  const data = useQuery(api.hub.projects.getMyProject, hubReady ? {} : "skip");
  const feedbackStatus = useQuery(
    api.hub.sponsorFeedback.getTeamFeedbackStatus,
    hubReady ? {} : "skip",
  );
  const upsertDeliverables = useMutation(api.hub.projects.upsertDeliverables);

  const [slidesUrl, setSlidesUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [testUsers, setTestUsers] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!data?.deliverables) return;
    setSlidesUrl(data.deliverables.slidesUrl ?? "");
    setVideoUrl(data.deliverables.videoUrl ?? data.deliverables.videoPlaybackUrl ?? "");
    setTestUsers(data.deliverables.testUsers ?? "");
  }, [data?.deliverables]);

  async function save(finalize: boolean) {
    setBusy(true);
    setError(null);
    try {
      if (finalize && !videoUrl.trim()) {
        throw new Error(t("hub.deliverables.videoRequired"));
      }

      await upsertDeliverables({
        slidesUrl: slidesUrl.trim() || undefined,
        videoUrl: videoUrl.trim() || undefined,
        testUsers: testUsers.trim() || undefined,
        finalize,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("hub.error.generic"));
    } finally {
      setBusy(false);
    }
  }

  if (data === undefined) {
    return (
      <div id="hub-deliverables" className="scroll-mt-24">
        <HubCard title={t("hub.deliverables.title")} tag={t("hub.deliverables.tag")}>
          <div className="h-24 animate-pulse bg-border-faint" />
        </HubCard>
      </div>
    );
  }

  if (data === null || !data.project) {
    return (
      <div id="hub-deliverables" className="scroll-mt-24">
        <HubCard title={t("hub.deliverables.title")} tag={t("hub.deliverables.tag")}>
          <p className="font-display text-[0.925rem] text-fg-2">{t("hub.deliverables.needProject")}</p>
        </HubCard>
      </div>
    );
  }

  const submitted = Boolean(data.deliverables?.submittedAt);
  const feedbackReady = feedbackStatus?.allComplete ?? false;
  const savedVideoUrl = data.deliverables?.videoUrl ?? data.deliverables?.videoPlaybackUrl;

  return (
    <div id="hub-deliverables" className="scroll-mt-24">
      <HubCard title={t("hub.deliverables.title")} tag={t("hub.deliverables.tag")}>
        <HubField label={t("hub.deliverables.slides")}>
          <HubInput
            value={slidesUrl}
            onChange={(e) => setSlidesUrl(e.target.value)}
            placeholder="https://docs.google.com/..."
          />
        </HubField>

        <HubField label={t("hub.deliverables.videoShowcase")}>
          <HubInput
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder={t("hub.deliverables.videoShowcasePlaceholder")}
          />
          <p className="mt-1.5 font-display text-[0.75rem] text-fg-4">
            {t("hub.deliverables.videoShowcaseHint")}
          </p>
          {savedVideoUrl ? (
            <a
              href={savedVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block font-mono text-[0.7rem] text-accent no-underline hover:underline"
            >
              {t("hub.deliverables.viewVideo")} →
            </a>
          ) : null}
        </HubField>

        <HubField label={t("hub.deliverables.testUsers")}>
          <HubTextarea
            value={testUsers}
            onChange={(e) => setTestUsers(e.target.value)}
            placeholder={t("hub.deliverables.testUsersPlaceholder")}
          />
        </HubField>

        <div className="mb-5 space-y-1 font-display text-[0.875rem] text-fg-2">
          <p>{feedbackReady ? t("hub.deliverables.feedbackReady") : t("hub.deliverables.feedbackPending")}</p>
          {submitted ? <p className="text-accent">{t("hub.deliverables.submitted")}</p> : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <HubButton variant="ghost" disabled={busy} onClick={() => void save(false)}>
            {t("hub.deliverables.saveDraft")}
          </HubButton>
          <HubButton disabled={busy || !feedbackReady} onClick={() => void save(true)}>
            {t("hub.deliverables.submitFinal")}
          </HubButton>
        </div>
        <HubError message={error} />
      </HubCard>
    </div>
  );
}
