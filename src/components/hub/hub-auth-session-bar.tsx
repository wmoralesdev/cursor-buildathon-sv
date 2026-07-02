import { useEffect, useState } from "react";
import { useAuth, useClerk, useUser } from "@clerk/react";

import { useHubConvexSync } from "../../hooks/use-hub-query-ready";
import { useTranslation } from "../../context/language-context";
import { HubButton } from "./hub-ui-primitives";

const CLERK_CONVEX_SETUP_URL = "https://dashboard.clerk.com/apps/setup/convex";

export function HubAuthSessionBar() {
  const { t } = useTranslation();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const { convexLoading, convexConnected, convexPending } = useHubConvexSync();
  const [tokenIssue, setTokenIssue] = useState<string | null>(null);

  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    user?.fullName ??
    t("hub.session.unknownUser");

  const statusKey = convexLoading
    ? "hub.session.convexLoading"
    : convexConnected
      ? "hub.session.convexReady"
      : "hub.session.convexPending";

  useEffect(() => {
    if (!convexPending) {
      setTokenIssue(null);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const token = await getToken({ template: "convex" });
        if (cancelled) return;
        if (!token) {
          setTokenIssue("missing_template");
        }
      } catch {
        if (!cancelled) {
          setTokenIssue("missing_template");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [convexPending, getToken]);

  async function handleSignOut() {
    await signOut({ redirectUrl: "/builder" });
  }

  return (
    <div
      className={`mb-6 flex flex-col gap-4 border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${
        convexPending ? "border-accent/40 bg-accent/5" : "border-border-faint bg-surface"
      }`}
    >
      <div className="min-w-0">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-fg-4">
          {t("hub.session.label")}
        </p>
        <p className="mt-1 truncate font-display text-[0.95rem] text-fg">{email}</p>
        <p
          className={`mt-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] ${
            convexConnected ? "text-accent" : convexPending ? "text-accent" : "text-fg-4"
          }`}
        >
          {t(statusKey)}
        </p>
        {convexPending ? (
          <div className="mt-2 max-w-[52ch] space-y-2 font-display text-[0.875rem] leading-relaxed text-fg-2">
            <p>
              {tokenIssue === "missing_template"
                ? t("hub.convexMissingTemplate")
                : t("hub.convexAuthPendingHint")}
            </p>
            <a
              href={CLERK_CONVEX_SETUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-[0.675rem] uppercase tracking-[0.12em] text-accent no-underline hover:underline"
            >
              {t("hub.convexSetupLink")} →
            </a>
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <HubButton variant={convexPending ? "primary" : "ghost"} onClick={() => void handleSignOut()}>
          {convexPending ? t("hub.session.reconnect") : t("hub.session.signOut")}
        </HubButton>
      </div>
    </div>
  );
}
