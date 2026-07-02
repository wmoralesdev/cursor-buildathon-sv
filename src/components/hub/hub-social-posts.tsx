import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useHubQueryReady } from "../../hooks/use-hub-query-ready";
import { useTranslation } from "../../context/language-context";
import { formatHubMutationError } from "../../lib/hub-mutation-error";
import { validateSocialPostUrlClient } from "../../lib/validate-social-post-url";
import { HubButton, HubCard, HubError, HubField, HubInput } from "./hub-ui-primitives";

const PLATFORM_PLACEHOLDERS = {
  x: "https://x.com/user/status/1234567890",
  linkedin: "https://www.linkedin.com/posts/...",
} as const;

export function HubSocialPosts() {
  const { t } = useTranslation();
  const hubReady = useHubQueryReady();
  const posts = useQuery(api.hub.socialPosts.listByTeam, hubReady ? {} : "skip");
  const addPost = useMutation(api.hub.socialPosts.addPost);
  const removePost = useMutation(api.hub.socialPosts.removePost);

  const [platform, setPlatform] = useState<"x" | "linkedin">("x");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleAdd() {
    const validation = validateSocialPostUrlClient(platform, url);
    if (!validation.ok) {
      setError(t(validation.messageKey));
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await addPost({ platform, url: validation.normalized });
      setUrl("");
    } catch (err) {
      setError(formatHubMutationError(err, "hub.error.generic", t));
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
        <HubInput
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError(null);
          }}
          placeholder={PLATFORM_PLACEHOLDERS[platform]}
        />
        <p className="mt-1.5 font-display text-[0.75rem] text-fg-4">
          {platform === "x" ? t("hub.social.hint.x") : t("hub.social.hint.linkedin")}
        </p>
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
