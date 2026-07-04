import { BuilderAnnouncementBanner } from "./builder-announcement-banner";
import { BuilderHeroHeader } from "./builder-page-hero";
import { useTranslation } from "../../context/language-context";

type Props = {
  email?: string;
};

export function BuilderEventAccessGate({ email }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <main className="builder-page flex h-[calc(100dvh-var(--site-nav-height))] max-h-[calc(100dvh-var(--site-nav-height))] min-h-0 flex-col overflow-hidden pb-20 sm:pb-[4.75rem]">
        <BuilderAnnouncementBanner />
        <BuilderHeroHeader />
        <div className="mx-auto w-full max-w-[1400px] flex-1 section-padding pb-12">
          <div className="border border-border bg-surface px-5 py-6 sm:px-8">
            <p className="font-mono text-[0.675rem] font-bold uppercase tracking-[0.14em] text-accent">
              {t("builder.eventAccess.tag")}
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.35rem,3vw,1.75rem)] font-semibold uppercase tracking-[0.04em] text-fg">
              {t("builder.eventAccess.title")}
            </h2>
            {email ? (
              <p className="mt-4 font-mono text-[0.8125rem] text-fg">
                <span className="text-fg-3">{t("builder.eventAccess.signedInAs")} </span>
                {email}
              </p>
            ) : null}
            <p className="mt-4 max-w-2xl font-display text-[0.975rem] leading-relaxed text-fg-2">
              {t("builder.eventAccess.notEligible")}
            </p>
            <p className="mt-3 max-w-2xl font-display text-[0.925rem] leading-relaxed text-fg-3">
              {t("builder.eventAccess.notEligibleHint")}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
