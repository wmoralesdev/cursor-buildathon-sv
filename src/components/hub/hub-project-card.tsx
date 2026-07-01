import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { HubSponsorId } from "../../../convex/lib/hubSponsorIds";
import { sponsors } from "../../data/sponsors";
import { useTranslation } from "../../context/language-context";
import { isConvexConfigured } from "../../lib/convex-client";
import { HubButton, HubCard, HubError, HubField, HubInput, HubTextarea } from "./hub-ui-primitives";

const PRODUCT_SPONSORS = sponsors.filter((s) => s.tier === "product");

export function HubProjectCard() {
  const { t } = useTranslation();
  const data = useQuery(api.hub.projects.getMyProject, isConvexConfigured ? {} : "skip");
  const upsertProject = useMutation(api.hub.projects.upsertProject);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [sponsorsUsed, setSponsorsUsed] = useState<HubSponsorId[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!data?.project) return;
    setName(data.project.name);
    setDescription(data.project.description);
    setUrl(data.project.url);
    setRepoUrl(data.project.repoUrl);
    setSponsorsUsed(data.project.sponsorsUsed);
  }, [data?.project]);

  function toggleSponsor(id: HubSponsorId) {
    setSponsorsUsed((current) =>
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id],
    );
  }

  async function handleSave() {
    setBusy(true);
    setError(null);
    try {
      await upsertProject({ name, description, url, repoUrl, sponsorsUsed });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("hub.error.generic"));
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

  return (
    <HubCard title={t("hub.project.title")} tag={t("hub.project.tag")}>
      <HubField label={t("hub.project.name")}>
        <HubInput value={name} onChange={(e) => setName(e.target.value)} />
      </HubField>
      <HubField label={t("hub.project.description")}>
        <HubTextarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </HubField>
      <div className="grid gap-4 sm:grid-cols-2">
        <HubField label={t("hub.project.url")}>
          <HubInput value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
        </HubField>
        <HubField label={t("hub.project.repo")}>
          <HubInput value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/" />
        </HubField>
      </div>

      <div className="mb-5">
        <p className="mb-3 font-mono text-[0.675rem] uppercase tracking-[0.12em] text-fg-3">
          {t("hub.project.sponsorsUsed")}
        </p>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_SPONSORS.map((sponsor) => {
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

      <HubButton disabled={busy} onClick={handleSave}>
        {t("hub.project.save")}
      </HubButton>
      <HubError message={error} />
    </HubCard>
  );
}
