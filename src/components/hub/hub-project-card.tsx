import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { HubSponsorId } from "../../../convex/lib/hubSponsorIds";
import { isHubCreditSponsorId } from "../../../convex/lib/hubSponsorIds";
import { hubCreditSponsors } from "../../data/hub-credit-sponsors";
import { useHubConvexSync, useHubQueryReady } from "../../hooks/use-hub-query-ready";
import { useTranslation } from "../../context/language-context";
import { formatHubMutationError } from "../../lib/hub-mutation-error";
import {
  HubButton,
  HubCard,
  HubError,
  HubField,
  HubInput,
  HubTextarea,
} from "./hub-ui-primitives";

function sponsorLabel(id: HubSponsorId): string {
  return hubCreditSponsors.find((s) => s.id === id)?.name ?? id;
}

export function HubProjectCard() {
  const { t } = useTranslation();
  const hubReady = useHubQueryReady();
  const { convexConnected } = useHubConvexSync();
  const data = useQuery(api.hub.projects.getMyProject, hubReady ? {} : "skip");
  const upsertProject = useMutation(api.hub.projects.upsertProject);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [sponsorsUsed, setSponsorsUsed] = useState<HubSponsorId[]>([]);
  const [isEditing, setIsEditing] = useState(true);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const hydratedKeyRef = useRef<string | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const savedFlashRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function hydrateFromData(next: NonNullable<typeof data>) {
    if (next.project) {
      setName(next.project.name);
      setDescription(next.project.description);
      setUrl(next.project.url);
      setRepoUrl(next.project.repoUrl);
      setSponsorsUsed(next.project.sponsorsUsed.filter(isHubCreditSponsorId));
      setIsEditing(false);
      return;
    }

    setName("");
    setDescription("");
    setUrl("");
    setSponsorsUsed([]);
    setRepoUrl(next.linkedRepoUrl ?? "");
    setIsEditing(true);
  }

  useEffect(() => {
    if (!data) return;

    const hydrateKey = data.project?._id ?? `new:${data.linkedRepoUrl ?? ""}`;
    if (hydratedKeyRef.current === hydrateKey) return;
    hydratedKeyRef.current = hydrateKey;
    hydrateFromData(data);
  }, [data]);

  useEffect(() => {
    if (!error) return;
    feedbackRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [error]);

  useEffect(() => {
    return () => {
      if (savedFlashRef.current) clearTimeout(savedFlashRef.current);
    };
  }, []);

  function clearFeedback() {
    setError(null);
    setJustSaved(false);
  }

  function showSavedFlash() {
    setJustSaved(true);
    if (savedFlashRef.current) clearTimeout(savedFlashRef.current);
    savedFlashRef.current = setTimeout(() => setJustSaved(false), 4000);
  }

  function toggleSponsor(id: HubSponsorId) {
    clearFeedback();
    setSponsorsUsed((current) =>
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id],
    );
  }

  function handleCancelEdit() {
    if (!data) return;
    clearFeedback();
    hydratedKeyRef.current = null;
    hydrateFromData(data);
    hydratedKeyRef.current = data.project?._id ?? `new:${data.linkedRepoUrl ?? ""}`;
  }

  function validateBeforeSave(): string | null {
    if (!name.trim()) return t("hub.project.error.nameRequired");
    if (!description.trim()) return t("hub.project.error.descriptionRequired");
    if (!url.trim()) return t("hub.project.error.urlRequired");
    const effectiveRepo = repoUrl.trim() || data?.linkedRepoUrl || "";
    if (!effectiveRepo) return t("hub.project.error.repoRequired");
    return null;
  }

  async function handleSave() {
    if (!data || busy) return;

    if (!convexConnected) {
      setError(t("hub.convexAuthPendingHint"));
      return;
    }

    const validationError = validateBeforeSave();
    if (validationError) {
      setError(validationError);
      return;
    }

    setBusy(true);
    setError(null);
    const effectiveRepoUrl = repoUrl.trim() || data.linkedRepoUrl || "";
    try {
      const saved = await upsertProject({
        name: name.trim(),
        description: description.trim(),
        url: url.trim(),
        repoUrl: effectiveRepoUrl,
        sponsorsUsed,
      });
      hydratedKeyRef.current = saved._id;
      setIsEditing(false);
      showSavedFlash();
    } catch (err) {
      setError(formatHubMutationError(err, "hub.error.generic", t));
    } finally {
      setBusy(false);
    }
  }

  if (data === undefined) {
    return (
      <div id="hub-project" className="scroll-mt-24">
        <HubCard title={t("hub.project.title")} tag={t("hub.project.tag")}>
          <div className="h-24 animate-pulse bg-border-faint" />
        </HubCard>
      </div>
    );
  }

  if (data === null) {
    return (
      <div id="hub-project" className="scroll-mt-24">
        <HubCard title={t("hub.project.title")} tag={t("hub.project.tag")}>
          <p className="font-display text-[0.925rem] text-fg-2">{t("hub.project.needTeam")}</p>
        </HubCard>
      </div>
    );
  }

  const hasProject = Boolean(data.project);
  const showViewMode = hasProject && !isEditing;

  return (
    <div id="hub-project" className="scroll-mt-24">
      <HubCard title={t("hub.project.title")} tag={t("hub.project.tag")}>
        {showViewMode ? (
          <ProjectSavedView
            name={name}
            description={description}
            url={url}
            repoUrl={repoUrl}
            sponsorsUsed={sponsorsUsed}
            justSaved={justSaved}
            onEdit={() => {
              clearFeedback();
              setIsEditing(true);
            }}
          />
        ) : (
          <ProjectEditForm
            data={data}
            name={name}
            description={description}
            url={url}
            repoUrl={repoUrl}
            sponsorsUsed={sponsorsUsed}
            isNewProject={!hasProject}
            busy={busy}
            convexConnected={convexConnected}
            error={error}
            feedbackRef={feedbackRef}
            onNameChange={(value) => {
              clearFeedback();
              setName(value);
            }}
            onDescriptionChange={(value) => {
              clearFeedback();
              setDescription(value);
            }}
            onUrlChange={(value) => {
              clearFeedback();
              setUrl(value);
            }}
            onRepoUrlChange={(value) => {
              clearFeedback();
              setRepoUrl(value);
            }}
            onToggleSponsor={toggleSponsor}
            onSave={() => void handleSave()}
            onCancel={hasProject ? handleCancelEdit : undefined}
          />
        )}
      </HubCard>
    </div>
  );
}

function ProjectSavedView({
  name,
  description,
  url,
  repoUrl,
  sponsorsUsed,
  justSaved,
  onEdit,
}: {
  name: string;
  description: string;
  url: string;
  repoUrl: string;
  sponsorsUsed: HubSponsorId[];
  justSaved: boolean;
  onEdit: () => void;
}) {
  const { t } = useTranslation();

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] transition-colors ${
            justSaved
              ? "border-accent bg-accent/10 text-accent"
              : "border-border-faint bg-bg-raised/40 text-fg-3"
          }`}
        >
          <Check className="size-3" aria-hidden />
          {justSaved ? t("hub.project.saved") : t("hub.project.savedBadge")}
        </span>
        <HubButton type="button" variant="ghost" onClick={onEdit}>
          {t("hub.project.edit")}
        </HubButton>
      </div>

      <div className="space-y-4 border border-border-faint bg-bg-raised/20 p-4 sm:p-5">
        <ProjectSummaryRow label={t("hub.project.name")} value={name} />
        <ProjectSummaryRow label={t("hub.project.description")} value={description} multiline />
        <ProjectSummaryRow
          label={t("hub.project.url")}
          value={url}
          href={url}
        />
        <ProjectSummaryRow
          label={t("hub.project.repo")}
          value={repoUrl}
          href={repoUrl}
        />

        <div>
          <p className="mb-2 font-mono text-[0.675rem] uppercase tracking-[0.12em] text-fg-3">
            {t("hub.project.sponsorsUsed")}
          </p>
          {sponsorsUsed.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {sponsorsUsed.map((id) => (
                <span
                  key={id}
                  className="border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-accent"
                >
                  {sponsorLabel(id)}
                </span>
              ))}
            </div>
          ) : (
            <p className="font-display text-[0.875rem] text-fg-4">
              {t("hub.project.noSponsorsSelected")}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

function ProjectSummaryRow({
  label,
  value,
  href,
  multiline = false,
}: {
  label: string;
  value: string;
  href?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <p className="mb-1 font-mono text-[0.675rem] uppercase tracking-[0.12em] text-fg-3">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all font-display text-[0.925rem] text-accent no-underline hover:underline"
        >
          {value}
        </a>
      ) : (
        <p
          className={`font-display text-[0.925rem] text-fg ${multiline ? "whitespace-pre-wrap leading-relaxed" : ""}`}
        >
          {value}
        </p>
      )}
    </div>
  );
}

function ProjectEditForm({
  data,
  name,
  description,
  url,
  repoUrl,
  sponsorsUsed,
  isNewProject,
  busy,
  convexConnected,
  error,
  feedbackRef,
  onNameChange,
  onDescriptionChange,
  onUrlChange,
  onRepoUrlChange,
  onToggleSponsor,
  onSave,
  onCancel,
}: {
  data: NonNullable<ReturnType<typeof useQuery<typeof api.hub.projects.getMyProject>>>;
  name: string;
  description: string;
  url: string;
  repoUrl: string;
  sponsorsUsed: HubSponsorId[];
  isNewProject: boolean;
  busy: boolean;
  convexConnected: boolean;
  error: string | null;
  feedbackRef: React.RefObject<HTMLDivElement | null>;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onRepoUrlChange: (value: string) => void;
  onToggleSponsor: (id: HubSponsorId) => void;
  onSave: () => void;
  onCancel?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <>
      {isNewProject ? (
        <p className="mb-5 max-w-[52ch] font-display text-[0.925rem] leading-relaxed text-fg-2">
          {t("hub.project.createIntro")}
        </p>
      ) : null}

      <HubField label={t("hub.project.nameRequired")}>
        <HubInput
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
          aria-required="true"
        />
      </HubField>
      <HubField label={t("hub.project.descriptionRequired")}>
        <HubTextarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          required
          aria-required="true"
        />
      </HubField>
      <div className="grid gap-4 sm:grid-cols-2">
        <HubField label={t("hub.project.urlRequired")}>
          <HubInput
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://"
            required
            aria-required="true"
          />
        </HubField>
        <HubField label={t("hub.project.repo")}>
          <HubInput
            id="hub-project-repo"
            value={repoUrl}
            onChange={(e) => onRepoUrlChange(e.target.value)}
            placeholder={t("submit.project.repoPlaceholder")}
            readOnly={Boolean(data.linkedRepoUrl) && repoUrl === data.linkedRepoUrl}
          />
          <p className="mt-1.5 font-display text-[0.75rem] text-fg-4">
            {data.linkedRepoUrl
              ? t("hub.project.repoLinkedHint")
              : t("hub.project.repoHint")}
          </p>
        </HubField>
      </div>

      <div className="mb-5">
        <p className="mb-3 font-mono text-[0.675rem] uppercase tracking-[0.12em] text-fg-3">
          {t("hub.project.sponsorsUsed")}
        </p>
        <p className="mb-3 max-w-[52ch] font-display text-[0.8125rem] leading-relaxed text-fg-4">
          {t("hub.project.sponsorsUsedHint")}
        </p>
        <div className="flex flex-wrap gap-2">
          {hubCreditSponsors.map((sponsor) => {
            const selected = sponsorsUsed.includes(sponsor.id as HubSponsorId);
            return (
              <button
                key={sponsor.id}
                type="button"
                onClick={() => onToggleSponsor(sponsor.id as HubSponsorId)}
                className={`border px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] transition-colors ${
                  selected
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border-faint text-fg-3 hover:border-accent hover:text-accent"
                }`}
              >
                {sponsor.name}
              </button>
            );
          })}
        </div>
      </div>

      <div ref={feedbackRef}>
        <HubError message={error} />
      </div>

      <div className="flex flex-wrap gap-2">
        <HubButton type="button" disabled={busy || !convexConnected} onClick={onSave}>
          {busy ? t("hub.project.saving") : t("hub.project.save")}
        </HubButton>
        {onCancel ? (
          <HubButton type="button" variant="ghost" disabled={busy} onClick={onCancel}>
            {t("hub.project.cancelEdit")}
          </HubButton>
        ) : null}
      </div>
    </>
  );
}
