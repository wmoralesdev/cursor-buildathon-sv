import { BUILDER_COUNTDOWN_ISO, BUILDER_TEAM_SECTION_ENABLED } from "../../constants";
import { scrollToBuilderSection } from "../../lib/builder-section-scroll";
import { useTranslation } from "../../context/language-context";
import type { TranslationKey } from "../../i18n/translations";
import { CountdownTimer } from "../countdown-timer";

const ANCHORS: { id: string; labelKey: TranslationKey }[] = [
  { id: "hub", labelKey: "builder.nav.hub" },
  { id: "sponsors", labelKey: "builder.nav.sponsors" },
  ...(BUILDER_TEAM_SECTION_ENABLED
    ? [{ id: "team", labelKey: "builder.nav.team" as TranslationKey }]
    : []),
  { id: "logistics", labelKey: "builder.nav.logistics" },
  { id: "mentors", labelKey: "builder.nav.mentors" },
  { id: "judges", labelKey: "builder.nav.judges" },
  { id: "submit", labelKey: "builder.nav.submit" },
  { id: "premios", labelKey: "builder.nav.premios" },
  { id: "credits", labelKey: "builder.nav.credits" },
  { id: "faq", labelKey: "builder.nav.faq" },
];

export function BuilderPageHero() {
  const { t } = useTranslation();

  return (
    <header className="relative overflow-hidden bg-bg">
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[min(90vw,52rem)] -translate-x-1/2 rounded-full bg-accent/8"
        aria-hidden
      />
      <div className="bg-grid mask-radial-hero pointer-events-none absolute inset-0 opacity-50" aria-hidden />

      <div className="relative z-10 mx-auto max-w-[1400px] section-padding pb-12 pt-10 sm:pb-16 sm:pt-16 lg:pt-20">
        <span className="tag mb-5 inline-block">{t("builder.hero.kicker")}</span>
        <h1 className="max-w-[18ch] font-display font-bold uppercase leading-[0.95] tracking-[-0.02em] text-fg text-[clamp(2.2rem,6vw,4rem)]">
          {t("builder.hero.title1")}
          <br />
          <span className="text-accent">{t("builder.hero.title2")}</span>
        </h1>
        <p className="mt-6 max-w-[52ch] font-display text-lg leading-[1.7] text-fg-3 sm:text-xl">
          {t("builder.hero.intro")}
        </p>

        <div className="reveal mt-10 inline-flex flex-col border border-border bg-surface px-6 py-5 sm:px-8">
          <p className="font-mono text-[0.675rem] uppercase tracking-[0.2em] text-accent">
            {t("builder.hero.countdownLabel")}
          </p>
          <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-fg-4">
            {t("builder.hero.countdownWhen")}
          </p>
          <div className="mt-3">
            <CountdownTimer targetIso={BUILDER_COUNTDOWN_ISO} legible animate={false} />
          </div>
        </div>
      </div>

      <nav
        aria-label={t("builder.hero.kicker")}
        className="sticky top-0 z-30 border-y border-border-faint bg-bg"
      >
        <ul className="mx-auto flex max-w-[1400px] snap-x gap-1 overflow-x-auto section-padding py-2.5 sm:gap-2 sm:py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ANCHORS.map(({ id, labelKey }) => (
            <li key={id} className="shrink-0 snap-start">
              <a
                href={`#${id}`}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToBuilderSection(id);
                }}
                className="inline-flex items-center rounded-none border border-transparent px-3 py-1.5 font-mono text-[0.725rem] uppercase tracking-[0.12em] text-fg-4 no-underline transition-colors hover:border-accent/40 hover:text-accent sm:px-4 sm:text-sm"
              >
                {t(labelKey)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
