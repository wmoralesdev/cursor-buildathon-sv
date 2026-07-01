import { Link } from "react-router-dom";

import { BuilderSectionHeader } from "./builder-section-header";
import { useBuilderTeam } from "../../hooks/use-builder-team";
import { BUILDER_TEAM_SECTION_ENABLED } from "../../constants";
import { isConvexConfigured } from "../../lib/convex-client";
import { useTranslation } from "../../context/language-context";
import type { TranslationKey } from "../../i18n/translations";

const ELIGIBILITY_KEYS: TranslationKey[] = [
  "builder.submit.eligibility.i0",
  "builder.submit.eligibility.i1",
  "builder.submit.eligibility.i2",
  "builder.submit.eligibility.i3",
  "builder.submit.eligibility.i4",
];

const RULE_KEYS: TranslationKey[] = [
  "builder.submit.rules.i0",
  "builder.submit.rules.i1",
  "builder.submit.rules.i2",
  "builder.submit.rules.i3",
  "builder.submit.rules.i4",
  "builder.submit.rules.i5",
];

const CHECKLIST_KEYS: TranslationKey[] = [
  "builder.submit.checklist.i0",
  "builder.submit.checklist.i1",
  "builder.submit.checklist.i2",
  "builder.submit.checklist.i3",
  "builder.submit.checklist.i4",
];

export function BuilderSubmitSection() {
  const { t } = useTranslation();

  return (
    <section id="submit" className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40 section-padding bg-bg-alt">
      <div className="max-w-[1400px] mx-auto">
        <BuilderSectionHeader
          id="submit"
          tagKey="builder.submit.tag"
          title1Key="builder.submit.title1"
          title2Key="builder.submit.title2"
          asideKey="builder.submit.aside"
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <RulePanel marker="A." titleKey="builder.submit.eligibilityTitle" itemKeys={ELIGIBILITY_KEYS} />
          <RulePanel
            marker="B."
            titleKey="builder.submit.rulesTitle"
            itemKeys={RULE_KEYS}
            className="reveal-delay-1"
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="reveal border border-border bg-surface p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3 border-b border-border-faint pb-4">
              <span className="font-mono text-[0.675rem] uppercase tracking-[0.15em] text-accent">C.</span>
              <h3 className="font-display text-[0.925rem] font-semibold uppercase tracking-[0.05em] text-fg">
                {t("builder.submit.checklistTitle")}
              </h3>
            </div>
            <ol className="m-0 list-none p-0">
              {CHECKLIST_KEYS.map((key, i) => (
                <li
                  key={key}
                  className={`flex items-start gap-4 ${i < CHECKLIST_KEYS.length - 1 ? "mb-4" : ""}`}
                >
                  <span className="mt-[1px] shrink-0 font-mono text-[0.775rem] tabular-nums text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[0.975rem] leading-[1.6] text-fg-2">{t(key)}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="reveal reveal-delay-1 flex flex-col justify-between gap-6 border border-accent/30 bg-surface p-6 sm:p-8">
            <p className="font-display text-[1.025rem] leading-[1.6] text-fg-3">
              {t("builder.submit.ctaHint")}
            </p>
            <SubmitCta />
          </div>
        </div>
      </div>
    </section>
  );
}

function SubmitCta() {
  if (!BUILDER_TEAM_SECTION_ENABLED) {
    return <SubmitCtaDisabled />;
  }
  return <SubmitCtaWithTeam />;
}

function SubmitCtaDisabled() {
  const { t } = useTranslation();
  return (
    <span className="btn-phosphor inline-flex cursor-default justify-center opacity-60 pointer-events-none">
      {t("builder.submit.cta")}
    </span>
  );
}

function SubmitCtaWithTeam() {
  const { t } = useTranslation();
  const { team, canSubmit, isLoading } = useBuilderTeam();

  const ctaClass = "btn-phosphor inline-flex justify-center no-underline";

  if (!isConvexConfigured || isLoading) {
    return (
      <a href="#team" className={ctaClass}>
        {t("builder.submit.cta")}
      </a>
    );
  }

  if (!team) {
    return (
      <a href="#team" className={ctaClass}>
        {t("builder.submit.cta.noTeam")}
      </a>
    );
  }

  if (team.submitted) {
    return (
      <a href="#team" className={ctaClass}>
        {t("builder.submit.cta.submitted")}
      </a>
    );
  }

  if (!team.isLeader) {
    return (
      <p className="font-mono text-[0.775rem] uppercase tracking-[0.12em] text-fg-4">
        {t("builder.submit.cta.notLeader")}
      </p>
    );
  }

  if (!canSubmit) {
    return (
      <a href="#team" className={ctaClass}>
        {t("builder.submit.cta.needMore")}
      </a>
    );
  }

  return (
    <Link to="/submit" className={ctaClass}>
      {t("builder.submit.cta")}
    </Link>
  );
}

function RulePanel({
  marker,
  titleKey,
  itemKeys,
  className = "",
}: {
  marker: string;
  titleKey: TranslationKey;
  itemKeys: TranslationKey[];
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <div className={`reveal border border-border bg-surface p-6 sm:p-8 ${className}`}>
      <div className="mb-6 flex items-center gap-3 border-b border-border-faint pb-4">
        <span className="font-mono text-[0.675rem] uppercase tracking-[0.15em] text-accent">{marker}</span>
        <h3 className="font-display text-[0.925rem] font-semibold uppercase tracking-[0.05em] text-fg">
          {t(titleKey)}
        </h3>
      </div>
      <ul className="m-0 list-none p-0">
        {itemKeys.map((key, i) => (
          <li
            key={key}
            className={`flex items-start gap-3 ${i < itemKeys.length - 1 ? "mb-4" : ""}`}
          >
            <span className="mt-[3px] shrink-0 font-mono text-[0.725rem] text-accent">→</span>
            <span className="font-display text-[0.95rem] leading-[1.6] text-fg-2">{t(key)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
