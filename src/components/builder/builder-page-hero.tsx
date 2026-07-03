import { SignInButton } from "@clerk/react";

import { BUILDER_COUNTDOWN_ISO } from "../../constants";
import { BUILDER_NAV_SECTIONS, type BuilderSectionId } from "../../lib/builder-sections";
import { isClerkConfigured } from "../../lib/convex-clerk-provider";
import { useTranslation } from "../../context/language-context";
import { CountdownTimer } from "../countdown-timer";

type BuilderTabNavProps = {
  activeSection: BuilderSectionId;
  onSectionChange: (sectionId: BuilderSectionId) => void;
};

export function BuilderTabNav({ activeSection, onSectionChange }: BuilderTabNavProps) {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-30 shrink-0 border-y border-border-faint bg-bg">
      <nav aria-label={t("builder.hero.kicker")}>
        <ul
          role="tablist"
          className="mx-auto flex max-w-[1400px] snap-x gap-1 overflow-x-auto section-padding py-2 sm:gap-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {BUILDER_NAV_SECTIONS.map(({ id, labelKey }) => {
            const isActive = activeSection === id;
            return (
              <li key={id} role="presentation" className="shrink-0 snap-start">
                <button
                  type="button"
                  role="tab"
                  id={`builder-tab-${id}`}
                  aria-selected={isActive}
                  aria-controls={`builder-tabpanel-${id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => onSectionChange(id)}
                  className={`inline-flex items-center rounded-none border px-3 py-1.5 font-mono text-[0.725rem] uppercase tracking-[0.12em] transition-colors sm:px-4 sm:text-sm ${
                    isActive
                      ? "border-accent/50 bg-accent/10 text-accent"
                      : "border-transparent text-fg-4 hover:border-accent/40 hover:text-accent"
                  }`}
                >
                  {t(labelKey)}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function BuilderHeroHeader() {
  const { t } = useTranslation();

  return (
    <header className="relative flex flex-1 flex-col justify-center overflow-hidden bg-bg">
      <div
        className="pointer-events-none absolute -top-16 left-1/2 h-48 w-[min(90vw,42rem)] -translate-x-1/2 rounded-full bg-accent/8"
        aria-hidden
      />
      <div className="bg-grid mask-radial-hero pointer-events-none absolute inset-0 opacity-50" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] section-padding pb-4 pt-5 sm:pb-5 sm:pt-7">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-6">
          <div className="min-w-0">
            <span className="tag mb-2 inline-block">{t("builder.hero.kicker")}</span>
            <h1 className="max-w-[22ch] font-display font-bold uppercase leading-[0.95] tracking-[-0.02em] text-fg text-[clamp(2.2rem,6vw,4rem)]">
              {t("builder.hero.title1")}{" "}
              <span className="text-accent">{t("builder.hero.title2")}</span>
            </h1>
            <p className="mt-2 max-w-[48ch] font-display text-lg leading-snug text-fg-3 sm:text-xl">
              {t("builder.hero.intro")}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch lg:flex-row lg:gap-4">
            <div className="inline-flex flex-col border border-border bg-surface px-4 py-3 sm:min-w-[15rem] sm:px-5">
              <p className="font-mono text-[0.675rem] uppercase tracking-[0.2em] text-accent">
                {t("builder.hero.countdownLabel")}
              </p>
              <p className="mt-0.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-fg-4">
                {t("builder.hero.countdownWhen")}
              </p>
              <div className="mt-2">
                <CountdownTimer targetIso={BUILDER_COUNTDOWN_ISO} legible animate={false} />
              </div>
            </div>

            <div className="flex flex-col justify-center sm:min-w-[12rem]">
              {isClerkConfigured ? (
                <SignInButton mode="modal">
                  <button type="button" className="btn-phosphor inline-flex justify-center px-5 py-2.5">
                    {t("builder.hero.ctaLogin")}
                  </button>
                </SignInButton>
              ) : (
                <button type="button" disabled className="btn-phosphor inline-flex justify-center px-5 py-2.5 opacity-50">
                  {t("builder.hero.ctaLogin")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
