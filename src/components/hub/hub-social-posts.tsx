import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useTranslation } from "../../context/language-context";
import { useHubUser } from "../../hooks/use-hub-user";
import {
  inferSocialPlatformFromUrl,
  socialPlatformLabel,
} from "../../lib/social-post-url";
import { HubSocialPostEmbed } from "./hub-social-post-embed";
import { HubButton, HubCard, HubError, HubField, HubInput } from "./hub-ui-primitives";

type PostRow = {
  key: string;
  postId?: Id<"hub_social_posts">;
  url: string;
  authorName?: string;
};

function createEmptyRow(): PostRow {
  return { key: crypto.randomUUID(), url: "" };
}

function rowsFromPosts(
  posts: Array<{
    _id: Id<"hub_social_posts">;
    url: string;
    authorName: string;
  }>,
): PostRow[] {
  if (posts.length === 0) return [createEmptyRow()];
  return posts.map((post) => ({
    key: post._id,
    postId: post._id,
    url: post.url,
    authorName: post.authorName,
  }));
}

export function HubSocialPosts() {
  const { t } = useTranslation();
  const { hubQueryArgs } = useHubUser();
  const posts = useQuery(api.hub.socialPosts.listByTeam, hubQueryArgs);
  const syncPosts = useMutation(api.hub.socialPosts.syncPosts);

  const [rows, setRows] = useState<PostRow[]>([createEmptyRow()]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (posts === undefined) return;
    setRows(rowsFromPosts(posts));
  }, [posts]);

  function updateRow(key: string, url: string) {
    setRows((current) => current.map((row) => (row.key === key ? { ...row, url } : row)));
  }

  function addRow() {
    setRows((current) => [...current, createEmptyRow()]);
  }

  function removeRow(key: string) {
    setRows((current) => {
      const next = current.filter((row) => row.key !== key);
      return next.length > 0 ? next : [createEmptyRow()];
    });
  }

  async function handleSave() {
    setBusy(true);
    setError(null);
    try {
      await syncPosts({
        posts: rows.map((row) => ({
          postId: row.postId,
          url: row.url,
        })),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("hub.error.generic"));
    } finally {
      setBusy(false);
    }
  }

  if (posts === undefined) {
    return (
      <HubCard title={t("hub.social.title")} tag={t("hub.social.tag")}>
        <div className="h-16 animate-pulse bg-border-faint" />
      </HubCard>
    );
  }

  const hasInvalidUrl = rows.some((row) => {
    const trimmed = row.url.trim();
    return trimmed.length > 0 && inferSocialPlatformFromUrl(trimmed) === null;
  });

  return (
    <HubCard title={t("hub.social.title")} tag={t("hub.social.tag")}>
      <p className="mb-5 font-display text-[0.925rem] text-fg-2">{t("hub.social.intro")}</p>

      <div className="space-y-6">
        {rows.map((row, index) => {
          const platform = inferSocialPlatformFromUrl(row.url);
          const platformLabel = platform
            ? socialPlatformLabel(platform)
            : row.url.trim()
              ? t("hub.social.platformUnknown")
              : null;

          return (
            <div key={row.key} className="border border-border-faint p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-fg-3">
                  {t("hub.social.postLabel")} {index + 1}
                  {row.authorName ? ` · ${row.authorName}` : ""}
                </p>
                {platformLabel ? (
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-accent">
                    {platformLabel}
                  </span>
                ) : null}
              </div>

              <HubField label={t("hub.social.url")}>
                <HubInput
                  value={row.url}
                  onChange={(e) => updateRow(row.key, e.target.value)}
                  placeholder={t("hub.social.urlPlaceholder")}
                />
              </HubField>

              {row.url.trim() && !platform ? (
                <p className="mb-3 font-display text-[0.85rem] text-red-400">{t("hub.social.invalidUrl")}</p>
              ) : null}

              <HubSocialPostEmbed url={row.url} platform={platform} />

              <div className="mt-3">
                <HubButton variant="ghost" onClick={() => removeRow(row.key)}>
                  {t("hub.social.remove")}
                </HubButton>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <HubButton variant="ghost" onClick={addRow}>
          {t("hub.social.add")}
        </HubButton>
        <HubButton disabled={busy || hasInvalidUrl} onClick={handleSave}>
          {t("hub.social.save")}
        </HubButton>
      </div>

      <HubError message={error} />
    </HubCard>
  );
}
