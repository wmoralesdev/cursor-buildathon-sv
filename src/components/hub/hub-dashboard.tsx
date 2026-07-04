import { SignInButton, useAuth } from "@clerk/react";
import { Link } from "react-router-dom";
import { useHubUser } from "../../hooks/use-hub-user";
import { isClerkConfigured } from "../../lib/clerk-config";
import { isConvexConfigured } from "../../lib/convex-client";
import { useTranslation } from "../../context/language-context";
import { HubSubTabNav } from "./hub-sub-tab-nav";
import { HubSubTabPanels } from "./hub-sub-tab-panels";
import { HubButton, HubCard } from "./hub-ui-primitives";

export function HubDashboard() {
  const { t } = useTranslation();
  const { isSignedIn } = useAuth();
  const { role, isHubConvexLoading, isHubBootstrapping, bootstrapError } = useHubUser();

  if (!isConvexConfigured || !isClerkConfigured) {
    return (
      <section id="hub" className="scroll-mt-24 py-8 sm:py-10">
        <HubCard title={t("hub.title")} tag={t("hub.tag")}>
          <p className="font-display text-[0.925rem] text-fg-2">{t("hub.setupRequired")}</p>
        </HubCard>
      </section>
    );
  }

  return (
    <section id="hub" className="scroll-mt-24 py-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="tag mb-4 inline-block">{t("hub.tag")}</span>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold uppercase tracking-[0.04em] text-fg">
            {t("hub.title")}
          </h2>
          <p className="mt-3 max-w-2xl font-display text-[0.975rem] leading-relaxed text-fg-2">
            {t("hub.intro")}
          </p>
        </div>
        {isSignedIn && role ? (
          <Link to="/admin">
            <HubButton variant="ghost">{t("hub.openAdmin")}</HubButton>
          </Link>
        ) : null}
      </div>

      {!isSignedIn ? (
        <HubCard title={t("hub.signInTitle")}>
          <p className="mb-5 font-display text-[0.925rem] text-fg-2">{t("hub.signInIntro")}</p>
          <SignInButton mode="modal">
            <HubButton>{t("hub.signInCta")}</HubButton>
          </SignInButton>
        </HubCard>
      ) : bootstrapError ? (
        <HubCard title={t("hub.title")} tag={t("hub.tag")}>
          <p className="font-display text-[0.925rem] text-red-400">{bootstrapError}</p>
          <p className="mt-3 font-display text-[0.925rem] text-fg-2">{t("hub.bootstrapError")}</p>
        </HubCard>
      ) : isHubConvexLoading || isHubBootstrapping ? (
        <HubCard title={t("hub.title")} tag={t("hub.tag")}>
          <div className="h-24 animate-pulse bg-border-faint" />
          <p className="mt-4 font-display text-[0.925rem] text-fg-2">{t("hub.connecting")}</p>
        </HubCard>
      ) : (
        <>
          <HubSubTabNav />
          <HubSubTabPanels />
        </>
      )}
    </section>
  );
}
