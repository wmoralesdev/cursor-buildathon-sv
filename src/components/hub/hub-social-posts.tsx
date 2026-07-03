import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useTranslation } from "../../context/language-context";
import { useHubUser } from "../../hooks/use-hub-user";
import { HubButton, HubCard, HubError, HubField, HubInput } from "./hub-ui-primitives";

export function HubSocialPosts() {
  const { t } = useTranslation();
  const { hubQueryArgs } = useHubUser();
  const posts = useQuery(api.hub.socialPosts.listByTeam, hubQueryArgs);
  const addPost = useMutation(api.hub.socialPosts.addPost);
  const removePost = useMutation(api.hub.socialPosts.removePost);

  const [platform, setPlatform] = useState<"x" | "linkedin">("x");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleAdd() {
    setBusy(true);
    setError(null);
    try {
      await addPost({ platform, url });
      setUrl("");
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

  return (
    <HubCard title={t("hub.social.title")} tag={t("hub.social.tag")}>
      <div className="mb-4 flex gap-2">
        {(["x", "linkedin"] as const).map((value) => (
          <HubButton
            key={value}
            variant={platform === value ? "primary" : "ghost"}
            onClick={() => setPlatform(value)}
          >
            {value === "x" ? "X" : "LinkedIn"}
          </HubButton>
        ))}
      </div>
      <HubField label={t("hub.social.url")}>
        <HubInput value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
      </HubField>
      <HubButton disabled={busy || !url.trim()} onClick={handleAdd}>
        {t("hub.social.add")}
      </HubButton>

      <ul className="mt-6 space-y-2">
        {posts.map((post) => (
          <li
            key={post._id}
            className="flex flex-wrap items-center justify-between gap-3 border border-border-faint px-3 py-2"
          >
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-fg-3">
                {post.platform} · {post.authorName}
              </p>
              <a href={post.url} target="_blank" rel="noreferrer" className="font-display text-[0.9rem] text-accent">
                {post.url}
              </a>
            </div>
            <HubButton variant="ghost" onClick={() => removePost({ postId: post._id })}>
              {t("hub.social.remove")}
            </HubButton>
          </li>
        ))}
      </ul>
      <HubError message={error} />
    </HubCard>
  );
}
