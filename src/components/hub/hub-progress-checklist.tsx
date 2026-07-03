import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { HUB_CHECKPOINTS } from "../../data/hub-progress-steps";
import { useTranslation } from "../../context/language-context";
import { useHubUser } from "../../hooks/use-hub-user";
import { HubButton, HubCard, HubError, HubField, HubTextarea } from "./hub-ui-primitives";

export function HubProgressChecklist() {
  const { t } = useTranslation();
  const { hubQueryArgs } = useHubUser();
  const progress = useQuery(api.hub.progress.getProgress, hubQueryArgs);
  const submitCheckpoint = useMutation(api.hub.progress.submitCheckpoint);

  const [activeCheckpoint, setActiveCheckpoint] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // #region agent log
  useEffect(() => {
    fetch("http://127.0.0.1:7524/ingest/ae7e5f7a-7927-4023-a554-d1b0cfb79922", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "73c77a" },
      body: JSON.stringify({
        sessionId: "73c77a",
        runId: "post-fix",
        hypothesisId: "B,E",
        location: "hub-progress-checklist.tsx:progress-query",
        message: "Progress query state",
        data: {
          progressStatus:
            progress === undefined ? "loading" : progress.steps.length === 0 ? "empty" : "resolved",
          stepCount: progress?.steps.length ?? null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }, [progress]);
  // #endregion

  if (progress === undefined) {
    return (
      <HubCard title={t("hub.progress.title")} tag={t("hub.progress.tag")}>
        <div className="h-24 animate-pulse bg-border-faint" />
      </HubCard>
    );
  }

  async function handleCheckpointSubmit(checkpointId: string) {
    setBusy(true);
    setError(null);
    try {
      await submitCheckpoint({ checkpointId, note });
      setActiveCheckpoint(null);
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("hub.error.generic"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <HubCard title={t("hub.progress.title")} tag={t("hub.progress.tag")}>
      <div className="mb-8">
        <h4 className="mb-3 font-mono text-[0.675rem] uppercase tracking-[0.12em] text-fg-3">
          {t("hub.progress.milestones")}
        </h4>
        <ul className="space-y-2">
          {progress.steps.map((step) => (
            <li
              key={step.id}
              className="flex items-center justify-between border border-border-faint px-3 py-2"
            >
              <span className="font-display text-[0.925rem] text-fg">
                {t(`hub.progress.step.${step.id}` as never)}
              </span>
              <span className={step.completed ? "text-accent" : "text-fg-3"}>
                {step.completed ? t("hub.progress.done") : t("hub.progress.pending")}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="mb-3 font-mono text-[0.675rem] uppercase tracking-[0.12em] text-fg-3">
          {t("hub.progress.checkpoints")}
        </h4>
        <div className="space-y-3">
          {HUB_CHECKPOINTS.map((checkpoint) => {
            const row = progress.checkpoints.find((cp) => cp.id === checkpoint.id);
            const isOpen = activeCheckpoint === checkpoint.id;
            return (
              <div key={checkpoint.id} className="border border-border-faint p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-[0.95rem] text-fg">{checkpoint.label}</p>
                    {row?.note ? (
                      <p className="mt-1 font-display text-[0.85rem] text-fg-2">{row.note}</p>
                    ) : null}
                  </div>
                  <HubButton
                    variant="ghost"
                    disabled={busy}
                    onClick={() => {
                      setActiveCheckpoint(isOpen ? null : checkpoint.id);
                      setNote(row?.note ?? "");
                    }}
                  >
                    {row?.submittedAt ? t("hub.progress.updateCheckpoint") : t("hub.progress.checkIn")}
                  </HubButton>
                </div>
                {isOpen ? (
                  <div className="mt-3">
                    <HubField label={t("hub.progress.checkpointNote")}>
                      <HubTextarea value={note} onChange={(e) => setNote(e.target.value)} />
                    </HubField>
                    <HubButton
                      disabled={busy || note.trim().length < 3}
                      onClick={() => handleCheckpointSubmit(checkpoint.id)}
                    >
                      {t("hub.progress.saveCheckpoint")}
                    </HubButton>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <HubError message={error} />
    </HubCard>
  );
}
