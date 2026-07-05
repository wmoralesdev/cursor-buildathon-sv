import { useCallback, useEffect, useRef, useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  HUB_PROJECT_TOOL_SPONSOR_IDS,
  type HubSponsorId,
} from "../../../convex/lib/hubSponsorIds";
import { sponsors } from "../../data/sponsors";
import { useTranslation } from "../../context/language-context";
import type { TranslationKey } from "../../i18n/translations";
import { useHubUser } from "../../hooks/use-hub-user";
import { translateRepoValidationError } from "../../lib/repo-validation-error";
import { HubButton, HubCard, HubError, HubField, HubInput, HubTextarea } from "./hub-ui-primitives";

const sponsorById = Object.fromEntries(sponsors.map((s) => [s.id, s]));

const PROJECT_TOOL_SPONSORS = HUB_PROJECT_TOOL_SPONSOR_IDS.map((id) => {
  const sponsor = sponsorById[id];
  if (!sponsor) {
    throw new Error(`sponsors: missing project tool sponsor "${id}"`);
  }
  return sponsor;
});

const MISSING_DETAIL_KEYS: Record<string, TranslationKey> = {
  name: "hub.project.completion.missingName",
  description: "hub.project.completion.missingDescription",
  url: "hub.project.completion.missingUrl",
  repoUrl: "hub.project.completion.missingRepo",
};

const REPO_VALIDATE_DEBOUNCE_MS = 600;

function HubProjectCompletionHint({
  missingDetails,
}: {
  missingDetails: string[];
}) {
  const { t } = useTranslation();

  if (missingDetails.length === 0) {
    return null;
  }

  return (
    <div className="mb-5 border border-border-faint px-3 py-3">
      <p className="mb-2 font-mono text-[0.675rem] uppercase tracking-[0.12em] text-fg-3">
        {t("hub.project.completionTitle")}
      </p>
      <ul className="space-y-1">
        {missingDetails.map((field) => {
          const key = MISSING_DETAIL_KEYS[field];
          if (!key) return null;
          return (
            <li key={field} className="font-display text-[0.875rem] text-fg-2">
              · {t(key)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function HubProjectCard() {
  const { t } = useTranslation();
  const { hubQueryArgs } = useHubUser();
  const data = useQuery(api.hub.projects.getMyProject, hubQueryArgs);
  const completionStatus = useQuery(api.hub.projects.getCompletionStatus, hubQueryArgs);
  const upsertProject = useAction(api.hub.projectActions.upsertProject);
  const validateRepoUrl = useAction(api.hub.projectActions.validateRepoUrl);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [sponsorsUsed, setSponsorsUsed] = useState<HubSponsorId[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [repoError, setRepoError] = useState<string | null>(null);
  const [repoValidating, setRepoValidating] = useState(false);
  const [busy, setBusy] = useState(false);
  const savedRepoUrlRef = useRef("");
  const validateRequestRef = useRef(0);

  useEffect(() => {
    if (!data?.project) return;
    setName(data.project.name);
    setDescription(data.project.description);
    setUrl(data.project.url);
    setRepoUrl(data.project.repoUrl);
    setSponsorsUsed(data.project.sponsorsUsed);
    savedRepoUrlRef.current = data.project.repoUrl;
    setRepoError(null);
  }, [data?.project]);

  const runRepoValidation = useCallback(
    async (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) {
        setRepoError(null);
        setRepoValidating(false);
        return;
      }

      if (trimmed === savedRepoUrlRef.current.trim()) {
        setRepoError(null);
        setRepoValidating(false);
        return;
      }

      const requestId = ++validateRequestRef.current;
      setRepoValidating(true);
      setRepoError(null);

      try {
        await validateRepoUrl({ repoUrl: trimmed });
        if (requestId !== validateRequestRef.current) return;
        setRepoError(null);
      } catch (err) {
        if (requestId !== validateRequestRef.current) return;
        const message = err instanceof Error ? err.message : t("hub.error.generic");
        setRepoError(translateRepoValidationError(message, t));
      } finally {
        if (requestId === validateRequestRef.current) {
          setRepoValidating(false);
        }
      }
    },
    [t, validateRepoUrl],
  );

  useEffect(() => {
    const trimmed = repoUrl.trim();
    if (!trimmed || trimmed === savedRepoUrlRef.current.trim()) {
      setRepoValidating(false);
      setRepoError(null);
      return;
    }

    const timer = window.setTimeout(() => {
      void runRepoValidation(trimmed);
    }, REPO_VALIDATE_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [repoUrl, runRepoValidation]);

  function toggleSponsor(id: HubSponsorId) {
    setSponsorsUsed((current) =>
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id],
    );
  }

  function formatError(err: unknown): string {
    const message = err instanceof Error ? err.message : t("hub.error.generic");
    return translateRepoValidationError(message, t);
  }

  async function handleSave() {
    setBusy(true);
    setError(null);
    try {
      const result = await upsertProject({ name, description, url, repoUrl, sponsorsUsed });
      savedRepoUrlRef.current = result.repoUrl;
      setRepoUrl(result.repoUrl);
      setRepoError(null);
    } catch (err) {
      const message = formatError(err);
      setError(message);
      if (message !== t("hub.error.generic")) {
        setRepoError(message);
      }
    } finally {
      setBusy(false);
    }
  }

  if (data === undefined) {
    return (
      <HubCard title={t("hub.project.title")} tag={t("hub.project.tag")}>
        <div className="h-24 animate-pulse bg-border-faint" />
      </HubCard>
    );
  }

  if (data === null) {
    return (
      <HubCard title={t("hub.project.title")} tag={t("hub.project.tag")}>
        <p className="font-display text-[0.925rem] text-fg-2">{t("hub.project.needTeam")}</p>
      </HubCard>
    );
  }

  const optionalLabel = ` (${t("hub.project.optionalHint")})`;
  const canSave = name.trim() !== "" && repoUrl.trim() !== "" && !repoValidating && !repoError;

  return (
    <HubCard title={t("hub.project.title")} tag={t("hub.project.tag")}>
      {completionStatus?.missingDetails.length ? (
        <HubProjectCompletionHint missingDetails={completionStatus.missingDetails} />
      ) : null}

      <HubField label={t("hub.project.name")}>
        <HubInput value={name} onChange={(e) => setName(e.target.value)} />
      </HubField>
      <HubField label={`${t("hub.project.description")}${optionalLabel}`}>
        <HubTextarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </HubField>
      <div className="grid gap-4 sm:grid-cols-2">
        <HubField label={`${t("hub.project.url")}${optionalLabel}`}>
          <HubInput value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
        </HubField>
        <HubField label={t("hub.project.repo")}>
          <HubInput
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            onBlur={() => void runRepoValidation(repoUrl)}
            placeholder="https://github.com/org/repo"
          />
          <p className="mt-1.5 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-fg-3">
            {t("hub.project.repoRequiredHint")}
          </p>
          {repoValidating ? (
            <p className="mt-1 font-display text-[0.8125rem] text-fg-3">{t("hub.project.repoValidating")}</p>
          ) : null}
          {repoError ? (
            <p className="mt-1 font-display text-[0.8125rem] text-red-400">{repoError}</p>
          ) : null}
        </HubField>
      </div>

      <div className="mb-5">
        <p className="mb-3 font-mono text-[0.675rem] uppercase tracking-[0.12em] text-fg-3">
          {t("hub.project.sponsorsUsed")}
        </p>
        <div className="flex flex-wrap gap-2">
          {PROJECT_TOOL_SPONSORS.map((sponsor) => {
            const selected = sponsorsUsed.includes(sponsor.id as HubSponsorId);
            return (
              <button
                key={sponsor.id}
                type="button"
                onClick={() => toggleSponsor(sponsor.id as HubSponsorId)}
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

      <HubButton disabled={busy || !canSave} onClick={handleSave}>
        {t("hub.project.save")}
      </HubButton>
      <HubError message={error} />
    </HubCard>
  );
}
