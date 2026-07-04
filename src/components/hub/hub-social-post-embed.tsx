import { getSocialPostEmbedUrl, type SocialPlatform } from "../../lib/social-post-url";

export function HubSocialPostEmbed({
  url,
  platform,
}: {
  url: string;
  platform: SocialPlatform | null;
}) {
  const embedUrl = getSocialPostEmbedUrl(url);
  if (!embedUrl || !platform) return null;

  return (
    <div className="mt-3 overflow-hidden border border-border-faint bg-bg">
      <iframe
        src={embedUrl}
        title={`${platform} embed`}
        className="w-full min-h-[320px] border-0"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}
