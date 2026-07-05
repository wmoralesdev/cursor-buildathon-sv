import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useTranslation } from "../../context/language-context";
import type { TranslationKey } from "../../i18n/translations";
import { useHubUser } from "../../hooks/use-hub-user";
import { HubButton, HubCard, HubError, HubField, HubInput, HubTextarea } from "./hub-ui-primitives";

const MISSING_DETAIL_KEYS: Record<string, TranslationKey> = {
  name: "hub.project.completion.missingName",
  description: "hub.project.completion.missingDescription",
  url: "hub.project.completion.missingUrl",
  repoUrl: "hub.project.completion.missingRepo",
};

type SubmitBlocker = {
  id: string;
  label: TranslationKey;
  hint?: TranslationKey;
};

function HubDeliverablesSubmitBlockers({
  blockers,
}: {
  blockers: SubmitBlocker[];
}) {
  const { t } = useTranslation();

  if (blockers.length === 0) {
    return null;
  }

  return (
    <div
      className="mb-5 border border-border-dim border-l-2 border-l-accent bg-bg-alt px-3 py-3"
      role="status"
      aria-live="polite"
    >
      <p className="mb-2 font-mono text-[0.675rem] uppercase tracking-[0.12em] text-fg-2">
        {t("hub.deliverables.submitBlockedTitle")}
      </p>
      <ul className="space-y-2">
        {blockers.map((blocker) => (
          <li key={blocker.id} className="font-display text-[0.875rem] text-fg">
            <span className="text-fg-3">·</span> {t(blocker.label)}
            {blocker.hint ? (
              <span className="mt-0.5 block pl-3 font-display text-[0.8125rem] text-fg-3">
                {t(blocker.hint)}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

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

  const submitted = Boolean(data?.deliverables?.submittedAt);
  const canFinalize = completionStatus?.canFinalize ?? false;

  const submitBlockers = useMemo((): SubmitBlocker[] => {
    if (!data?.project || !completionStatus || submitted) {
      return [];
    }

    const blockers: SubmitBlocker[] = [];

    for (const field of completionStatus.missingDetails) {
      const label = MISSING_DETAIL_KEYS[field];
      if (!label) continue;
      blockers.push({
        id: `project-${field}`,
        label,
        hint: "hub.deliverables.fixInProjectSection",
      });
    }

    if (!completionStatus.feedbackComplete) {
      blockers.push({
        id: "feedback",
        label: "hub.deliverables.blockedByFeedback",
        hint: "hub.deliverables.feedbackPending",
      });
    }

    const savedSlides = data.deliverables?.slidesUrl?.trim() ?? "";
    const savedVideoUrl = data.deliverables?.videoUrl?.trim() ?? "";
    const savedVideoR2Key = data.deliverables?.videoR2Key?.trim() ?? "";
    const draftSlides = slidesUrl.trim();
    const draftVideo = videoUrl.trim();

    if (!savedSlides) {
      blockers.push({
        id: "slides",
        label: draftSlides
          ? "hub.deliverables.unsavedSlides"
          : "hub.deliverables.missingSlides",
        hint: draftSlides ? "hub.deliverables.saveDraftHint" : undefined,
      });
    }

    if (!savedVideoR2Key && !savedVideoUrl) {
      blockers.push({
        id: "video",
        label: draftVideo ? "hub.deliverables.unsavedVideo" : "hub.deliverables.missingVideo",
        hint: draftVideo ? "hub.deliverables.saveDraftHint" : undefined,
      });
    }

    return blockers;
  }, [completionStatus, data, slidesUrl, submitted, videoUrl]);

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
        {!submitted && submitBlockers.length === 0 && canFinalize ? (
          <p className="text-accent">{t("hub.deliverables.readyToSubmit")}</p>
        ) : null}
        {completionStatus?.feedbackComplete && !submitted ? (
          <p>{t("hub.deliverables.feedbackReady")}</p>
        ) : null}
        {submitted ? <p className="text-accent">{t("hub.deliverables.submitted")}</p> : null}
      </div>

      {!submitted ? <HubDeliverablesSubmitBlockers blockers={submitBlockers} /> : null}

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
