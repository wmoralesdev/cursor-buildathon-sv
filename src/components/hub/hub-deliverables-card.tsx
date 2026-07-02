import { useEffect, useRef, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useTranslation } from "../../context/language-context";
import { isConvexConfigured } from "../../lib/convex-client";
import { uploadVideoToR2 } from "../../lib/r2-upload";
import { HubButton, HubCard, HubError, HubField, HubInput, HubTextarea } from "./hub-ui-primitives";

export function HubDeliverablesCard() {
  const { t } = useTranslation();
  const data = useQuery(api.hub.projects.getMyProject, isConvexConfigured ? {} : "skip");
  const feedbackStatus = useQuery(
    api.hub.sponsorFeedback.getTeamFeedbackStatus,
    isConvexConfigured ? {} : "skip",
  );
  const upsertDeliverables = useMutation(api.hub.projects.upsertDeliverables);
  const generateUploadUrl = useAction(api.uploads.generateUploadUrl);

  const [slidesUrl, setSlidesUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [testUsers, setTestUsers] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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
      let videoR2Key: string | undefined;
      const file = fileRef.current?.files?.[0];
      if (file) {
        const target = await uploadVideoToR2(file, "hub", (request) => generateUploadUrl(request));
        videoR2Key = target.objectKey;
      }

      await upsertDeliverables({
        slidesUrl: slidesUrl.trim() || undefined,
        videoUrl: videoUrl.trim() || undefined,
        videoR2Key,
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
  const feedbackReady = feedbackStatus?.allComplete ?? false;

  return (
    <HubCard title={t("hub.deliverables.title")} tag={t("hub.deliverables.tag")}>
      <HubField label={t("hub.deliverables.slides")}>
        <HubInput
          value={slidesUrl}
          onChange={(e) => setSlidesUrl(e.target.value)}
          placeholder="https://docs.google.com/..."
        />
      </HubField>

      <HubField label={t("hub.deliverables.videoUpload")}>
        <input ref={fileRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="w-full text-fg-2" />
        {data.deliverables?.videoPlaybackUrl ? (
          <a
            href={data.deliverables.videoPlaybackUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block font-mono text-[0.7rem] text-accent"
          >
            {t("hub.deliverables.viewUploadedVideo")}
          </a>
        ) : null}
      </HubField>

      <HubField label={t("hub.deliverables.videoUrl")}>
        <HubInput
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://youtube.com/..."
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
        <p>{feedbackReady ? t("hub.deliverables.feedbackReady") : t("hub.deliverables.feedbackPending")}</p>
        {submitted ? <p className="text-accent">{t("hub.deliverables.submitted")}</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <HubButton variant="ghost" disabled={busy} onClick={() => save(false)}>
          {t("hub.deliverables.saveDraft")}
        </HubButton>
        <HubButton disabled={busy || !feedbackReady} onClick={() => save(true)}>
          {t("hub.deliverables.submitFinal")}
        </HubButton>
      </div>
      <HubError message={error} />
    </HubCard>
  );
}
