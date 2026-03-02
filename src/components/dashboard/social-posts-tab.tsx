import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useTranslation } from "../../context/language-context";

type Platform = "x" | "linkedin";

const inputBase =
  "w-full px-4 py-3 bg-bg border border-border text-fg font-display placeholder:text-fg-5 focus:outline-none focus:border-accent/60 transition-colors";

interface SocialPostsTabProps {
  teamId: Id<"teams"> | null;
}

export function SocialPostsTab({ teamId }: SocialPostsTabProps) {
  const { t } = useTranslation();
  const posts = useQuery(
    api.social_posts.listByTeam,
    teamId ? { teamId } : "skip"
  );
  const addPost = useMutation(api.social_posts.add);
  const removePost = useMutation(api.social_posts.remove);

  const [platform, setPlatform] = useState<Platform>("x");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "adding" | "error">("idle");

  if (!teamId) {
    return (
      <p className="font-display text-[0.9rem] text-fg-3">
        {t("dashboard.socialForm.noTeam")}
      </p>
    );
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!teamId) return;
    const trimmed = url.trim();
    if (!trimmed) {
      setStatus("error");
      return;
    }

    setStatus("adding");
    try {
      await addPost({ teamId, platform, url: trimmed });
      setUrl("");
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  async function handleRemove(id: Id<"social_posts">) {
    await removePost({ id });
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value as Platform)}
          className={`text-[0.9rem] sm:w-40 ${inputBase} appearance-none cursor-pointer`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23787878' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            paddingRight: "2rem",
          }}
        >
          <option value="x">{t("dashboard.socialForm.platformX")}</option>
          <option value="linkedin">{t("dashboard.socialForm.platformLinkedIn")}</option>
        </select>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t("dashboard.socialForm.urlPlaceholder")}
          className={`flex-1 text-[0.9rem] ${inputBase}`}
        />
        <button
          type="submit"
          disabled={status === "adding"}
          className="btn-phosphor text-sm px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {status === "adding" ? "..." : t("dashboard.socialForm.submit")}
        </button>
      </form>

      {status === "error" && (
        <p className="font-mono text-[0.7rem] text-accent uppercase">
          {t("dashboard.teamForm.required")}
        </p>
      )}

      {posts && posts.length > 0 && (
        <div className="space-y-2">
          <div className="font-mono text-[0.65rem] tracking-[0.15em] text-fg-3 uppercase">
            {t("dashboard.socialForm.title")}
          </div>
          <ul className="divide-y divide-border">
            {posts.map((post) => (
              <li
                key={post._id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <span className="font-mono text-[0.65rem] text-fg-4 uppercase">
                  {post.platform === "x"
                    ? t("dashboard.socialForm.platformX")
                    : t("dashboard.socialForm.platformLinkedIn")}
                </span>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 truncate text-[0.85rem] text-fg-2 hover:text-accent transition-colors"
                >
                  {post.url}
                </a>
                <button
                  type="button"
                  onClick={() => handleRemove(post._id)}
                  className="font-mono text-[0.6rem] text-fg-4 hover:text-accent uppercase transition-colors shrink-0"
                >
                  {t("dashboard.socialForm.remove")}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
