import { useCallback, useEffect, useRef, useState } from "react";
import { useAction, useQuery } from "convex/react";
import { Plus, Trash2 } from "lucide-react";
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
  repoUrls: "hub.project.completion.missingRepo",
};

const REPO_VALIDATE_DEBOUNCE_MS = 600;

function repoUrlsEqual(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((url, index) => url.trim() === right[index]?.trim());
}

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
  const [repoUrls, setRepoUrls] = useState<string[]>([""]);
  const [sponsorsUsed, setSponsorsUsed] = useState<HubSponsorId[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [repoErrors, setRepoErrors] = useState<Record<number, string | null>>({});
  const [repoValidating, setRepoValidating] = useState<Record<number, boolean>>({});
  const [busy, setBusy] = useState(false);
  const savedRepoUrlsRef = useRef<string[]>([""]);
  const validateRequestRef = useRef(0);

  useEffect(() => {
    if (!data?.project) return;
    setName(data.project.name);
    setDescription(data.project.description);
    setUrl(data.project.url);
    const nextRepoUrls = data.project.repoUrls.length > 0 ? data.project.repoUrls : [""];
    setRepoUrls(nextRepoUrls);
    setSponsorsUsed(data.project.sponsorsUsed);
    savedRepoUrlsRef.current = nextRepoUrls;
    setRepoErrors({});
    setRepoValidating({});
  }, [data?.project]);

  const runRepoValidation = useCallback(
    async (values: string[]) => {
      const trimmedValues = values.map((value) => value.trim());
      const hasAnyRepo = trimmedValues.some((value) => value !== "");
      if (!hasAnyRepo) {
        setRepoErrors({});
        setRepoValidating({});
        return;
      }

      if (repoUrlsEqual(trimmedValues, savedRepoUrlsRef.current)) {
        setRepoErrors({});
        setRepoValidating({});
        return;
      }

      const requestId = ++validateRequestRef.current;
      const nextValidating: Record<number, boolean> = {};
      const nextErrors: Record<number, string | null> = {};

      for (const [index, value] of trimmedValues.entries()) {
        if (!value) {
          nextErrors[index] = null;
          continue;
        }

        if (savedRepoUrlsRef.current[index]?.trim() === value) {
          nextErrors[index] = null;
          continue;
        }

        nextValidating[index] = true;
      }

      setRepoValidating(nextValidating);
      setRepoErrors((current) => {
        const merged = { ...current };
        for (const index of Object.keys(nextValidating).map(Number)) {
          merged[index] = null;
        }
        return merged;
      });

      await Promise.all(
        trimmedValues.map(async (value, index) => {
          if (!value || savedRepoUrlsRef.current[index]?.trim() === value) {
            return;
          }

          try {
            await validateRepoUrl({ repoUrl: value });
            if (requestId !== validateRequestRef.current) return;
            setRepoErrors((current) => ({ ...current, [index]: null }));
          } catch (err) {
            if (requestId !== validateRequestRef.current) return;
            const message = err instanceof Error ? err.message : t("hub.error.generic");
            setRepoErrors((current) => ({
              ...current,
              [index]: translateRepoValidationError(message, t),
            }));
          } finally {
            if (requestId === validateRequestRef.current) {
              setRepoValidating((current) => {
                const next = { ...current };
                delete next[index];
                return next;
              });
            }
          }
        }),
      );
    },
    [t, validateRepoUrl],
  );

  useEffect(() => {
    const trimmedValues = repoUrls.map((value) => value.trim());
    if (!trimmedValues.some((value) => value !== "") || repoUrlsEqual(trimmedValues, savedRepoUrlsRef.current)) {
      setRepoValidating({});
      setRepoErrors({});
      return;
    }

    const timer = window.setTimeout(() => {
      void runRepoValidation(repoUrls);
    }, REPO_VALIDATE_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [repoUrls, runRepoValidation]);

  function toggleSponsor(id: HubSponsorId) {
    setSponsorsUsed((current) =>
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id],
    );
  }

  function updateRepoUrl(index: number, value: string) {
    setRepoUrls((current) => current.map((url, i) => (i === index ? value : url)));
  }

  function addRepoUrl() {
    setRepoUrls((current) => [...current, ""]);
  }

  function removeRepoUrl(index: number) {
    setRepoUrls((current) => {
      if (current.length === 1) {
        return [""];
      }
      return current.filter((_, i) => i !== index);
    });
    setRepoErrors((current) => {
      const next: Record<number, string | null> = {};
      for (const [key, value] of Object.entries(current)) {
        const currentIndex = Number(key);
        if (currentIndex < index) {
          next[currentIndex] = value;
        } else if (currentIndex > index) {
          next[currentIndex - 1] = value;
        }
      }
      return next;
    });
    setRepoValidating((current) => {
      const next: Record<number, boolean> = {};
      for (const [key, value] of Object.entries(current)) {
        const currentIndex = Number(key);
        if (currentIndex < index) {
          next[currentIndex] = value;
        } else if (currentIndex > index) {
          next[currentIndex - 1] = value;
        }
      }
      return next;
    });
  }

  function formatError(err: unknown): string {
    const message = err instanceof Error ? err.message : t("hub.error.generic");
    return translateRepoValidationError(message, t);
  }

  async function handleSave() {
    setBusy(true);
    setError(null);
    try {
      const result = await upsertProject({
        name,
        description,
        url,
        repoUrls: repoUrls.map((value) => value.trim()).filter(Boolean),
        sponsorsUsed,
      });
      const nextRepoUrls = result.repoUrls.length > 0 ? result.repoUrls : [""];
      savedRepoUrlsRef.current = nextRepoUrls;
      setRepoUrls(nextRepoUrls);
      setRepoErrors({});
      setRepoValidating({});
    } catch (err) {
      const message = formatError(err);
      setError(message);
      if (message !== t("hub.error.generic")) {
        setRepoErrors({ 0: message });
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
  const hasRepoInput = repoUrls.some((value) => value.trim() !== "");
  const hasRepoValidationError = Object.values(repoErrors).some((value) => value);
  const isRepoValidating = Object.keys(repoValidating).length > 0;
  const canSave = name.trim() !== "" && hasRepoInput && !isRepoValidating && !hasRepoValidationError;

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
          <div className="space-y-2">
            {repoUrls.map((repoUrl, index) => (
              <div key={`repo-url-${index}`} className="space-y-1">
                <div className="flex items-center gap-2">
                  <HubInput
                    value={repoUrl}
                    onChange={(e) => updateRepoUrl(index, e.target.value)}
                    onBlur={() => void runRepoValidation(repoUrls)}
                    placeholder="https://github.com/org/repo"
                  />
                  {repoUrls.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeRepoUrl(index)}
                      className="inline-flex size-9 shrink-0 items-center justify-center border border-border-faint text-fg-3 transition-colors hover:border-red-400/50 hover:text-red-400"
                      aria-label={t("hub.project.repoRemove")}
                    >
                      <Trash2 className="size-3.5" strokeWidth={2} aria-hidden />
                    </button>
                  ) : null}
                </div>
                {repoValidating[index] ? (
                  <p className="font-display text-[0.8125rem] text-fg-3">{t("hub.project.repoValidating")}</p>
                ) : null}
                {repoErrors[index] ? (
                  <p className="font-display text-[0.8125rem] text-red-400">{repoErrors[index]}</p>
                ) : null}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addRepoUrl}
            className="mt-2 inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-fg-3 transition-colors hover:text-accent"
          >
            <Plus className="size-3" strokeWidth={2} aria-hidden />
            {t("hub.project.repoAdd")}
          </button>
          <p className="mt-1.5 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-fg-3">
            {t("hub.project.repoRequiredHint")}
          </p>
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
