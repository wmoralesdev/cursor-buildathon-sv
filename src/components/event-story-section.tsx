import { useMemo, type ComponentType } from "react";
import { Mic2, Sparkles, Users } from "lucide-react";

import { AI_LABS_LINKS_URL } from "../constants";
import { useTranslation } from "../context/language-context";
import type { TranslationKey } from "../i18n/translations";

interface StoryDef {
  code: string;
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
}

const STORY_DEFS: StoryDef[] = [
  {
    code: "01",
    Icon: Users,
    titleKey: "eventStory.b1.title",
    bodyKey: "eventStory.b1.body",
  },
  {
    code: "02",
    Icon: Sparkles,
    titleKey: "eventStory.b2.title",
    bodyKey: "eventStory.b2.body",
  },
  {
    code: "03",
    Icon: Mic2,
    titleKey: "eventStory.b3.title",
    bodyKey: "eventStory.b3.body",
  },
];

export function EventStorySection() {
  const { t } = useTranslation();

  const stories = useMemo(
    () => STORY_DEFS.map((s) => ({ ...s, title: t(s.titleKey), body: t(s.bodyKey) })),
    [t],
  );

  return (
    <section
      id="story"
      className="relative py-24 sm:py-32 lg:py-40 section-padding bg-bg-alt"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-start">
          <div className="lg:col-span-5 reveal lg:sticky lg:top-24">
            <span className="tag mb-6 inline-block">{t("eventStory.tag")}</span>
            <h2 className="font-display font-medium text-fg tracking-[-0.02em] leading-[1] text-[clamp(2rem,4.4vw,3.4rem)]">
              {t("eventStory.title1")}
              <br />
              <span className="text-accent">{t("eventStory.title2")}</span>
            </h2>
            <p className="mt-7 max-w-[44ch] font-display text-base text-fg-2 leading-[1.75]">
              {t("eventStory.intro")}
            </p>

            <a
              href={AI_LABS_LINKS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.18em] uppercase text-accent border-b border-accent/40 pb-1 transition-colors duration-200 hover:border-accent"
            >
              {t("eventStory.cta")}
            </a>
          </div>

          <ol className="lg:col-span-7 grid gap-3">
            {stories.map((story, i) => {
              const Icon = story.Icon;
              return (
                <li
                  key={story.code}
                  className="reveal group relative grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border border-border bg-surface px-6 py-7 sm:px-8 sm:py-8 transition-[border-color,background] duration-300 hover:border-accent/35 hover:bg-accent/[0.02]"
                  style={{ "--delay": `${i * 0.08}s` } as React.CSSProperties}
                >
                  <span
                    aria-hidden
                    className="absolute top-0 left-0 h-0.5 w-12 bg-accent/70 transition-all duration-300 group-hover:w-20"
                  />

                  <div className="flex flex-col items-center gap-3 pt-1.5">
                    <span className="font-mono text-[0.7rem] tracking-[0.18em] text-accent tabular-nums">
                      {story.code}
                    </span>
                    <Icon
                      className="h-4 w-4 text-fg-4 transition-colors duration-300 group-hover:text-accent"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-display text-base sm:text-lg font-semibold text-fg tracking-[-0.005em]">
                      {story.title}
                    </h3>
                    <p className="mt-2 max-w-[60ch] font-display text-sm text-fg-3 leading-[1.7]">
                      {story.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
