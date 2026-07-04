import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useTranslation } from "../../context/language-context";
import { useHubUser } from "../../hooks/use-hub-user";
import { HubButton, HubCard, HubError, HubField, HubInput, HubTextarea } from "./hub-ui-primitives";

export function HubDeliverablesCard() {
  const { t } = useTranslation();
  const { hubQueryArgs } = useHubUser();
  const data = useQuery(api.hub.projects.getMyProject, hubQueryArgs);
  const completionStatus = useQuery(api.hub.projects.getCompletionStatus, hubQueryArgs);
  const upsertDeliverables = useMutation(api.hub.projects.upsertDeliverables);

  const [slidesUrl, setSlidesUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [testUsers, setTestUsers] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!data?.deliverables) return;
    setSlidesUrl(data.deliverables.slidesUrl ?? "");
    setVideoUrl(data.deliverables.videoUrl ?? "");
    setTestUsers(data.deliverables.testUsers ?? "");
  }, [data?.deliverables]);

  async function save(finalize: boolean) {
    setBusy(true);
    setError(null);
    try {
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
      <HubCard title={t("hub.deliverables.title")} tag={t("hub.deliverables.tag")}>
        <div className="h-24 animate-pulse bg-border-faint" />
      </HubCard>
    );
  }

  if (data === null || !data.project) {
    return (
      <HubCard title={t("hub.deliverables.title")} tag={t("hub.deliverables.tag")}>
        <p className="font-display text-[0.925rem] text-fg-2">{t("hub.deliverables.needProject")}</p>
      </HubCard>
    );
  }

  const submitted = Boolean(data.deliverables?.submittedAt);
  const canFinalize = completionStatus?.canFinalize ?? false;

  let blockReason: string | null = null;
  if (!submitted && completionStatus) {
    if (!completionStatus.detailsComplete) {
      blockReason = t("hub.deliverables.blockedByDetails");
    } else if (!completionStatus.feedbackComplete) {
      blockReason = t("hub.deliverables.blockedByFeedback");
    } else if (!completionStatus.deliverablesReady) {
      blockReason = t("hub.deliverables.blockedByDeliverables");
    }
  }

  return (
    <HubCard title={t("hub.deliverables.title")} tag={t("hub.deliverables.tag")}>
      <HubField label={t("hub.deliverables.slides")}>
        <HubInput
          value={slidesUrl}
          onChange={(e) => setSlidesUrl(e.target.value)}
          placeholder="https://docs.google.com/..."
        />
      </HubField>

      <HubField label={t("hub.deliverables.videoUrl")}>
        <HubInput
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder={t("hub.deliverables.videoUrlPlaceholder")}
        />
      </HubField>

      <HubField label={t("hub.deliverables.testUsers")}>
        <HubTextarea
          value={testUsers}
          onChange={(e) => setTestUsers(e.target.value)}
          placeholder={t("hub.deliverables.testUsersPlaceholder")}
        />
      </HubField>

      <div className="mb-5 space-y-1 font-display text-[0.875rem] text-fg-2">
        {completionStatus?.detailsComplete === false ? (
          <p>{t("hub.deliverables.detailsPending")}</p>
        ) : null}
        {completionStatus?.feedbackComplete === false ? (
          <p>{t("hub.deliverables.feedbackPending")}</p>
        ) : completionStatus?.feedbackComplete ? (
          <p>{t("hub.deliverables.feedbackReady")}</p>
        ) : null}
        {completionStatus?.deliverablesReady === false && completionStatus.detailsComplete ? (
          <p>{t("hub.deliverables.deliverablesPending")}</p>
        ) : null}
        {submitted ? <p className="text-accent">{t("hub.deliverables.submitted")}</p> : null}
        {blockReason && !submitted ? (
          <p className="text-fg-3">{blockReason}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <HubButton variant="ghost" disabled={busy} onClick={() => save(false)}>
          {t("hub.deliverables.saveDraft")}
        </HubButton>
        <HubButton disabled={busy || !canFinalize || submitted} onClick={() => save(true)}>
          {t("hub.deliverables.submitFinal")}
        </HubButton>
      </div>
      <HubError message={error} />
    </HubCard>
  );
}
