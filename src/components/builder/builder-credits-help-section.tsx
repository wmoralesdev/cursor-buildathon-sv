import { useCallback, useMemo, useState } from "react";
import { SignInButton, useAuth } from "@clerk/react";
import {
  CodexLogo,
  CognitionLogo,
  CursorLockup,
  DatamcpLogo,
  ElevenLabsLogo,
  ExaLogo,
  FalLogo,
  FirecrawlLogo,
  N8nLogo,
  WisprLogo,
  ZavuLogo,
} from "../sponsor-logos";
import { BUILDER_PERK_DEFS, type BuilderPerkId, type BuilderPerkLogoId } from "../../data/builder-perks";
import { CREDITS_TOTAL } from "../../data/prizes";
import { getBuilderPerkSocialLinks } from "../../data/builder-perk-social-links";
import { useMyPerks, type MyPerkEntry } from "../../hooks/use-my-perks";
import { useTranslation } from "../../context/language-context";
import type { TranslationKey } from "../../i18n/translations";
import { IconBrandGlobe, IconBrandLinkedin, IconBrandX } from "../social-brand-icons";
import { HubButton } from "../hub/hub-ui-primitives";
import { BuilderSectionHeader } from "./builder-section-header";

const PERK_LOGO_CLASS = "h-4 w-auto max-w-[6rem] shrink-0 object-contain";

type MyPerk = MyPerkEntry;

function PerkMark({
  logo,
  sponsor,
}: {
  logo: BuilderPerkLogoId;
  sponsor: string;
}) {
  switch (logo) {
    case "cursor":
      return <CursorLockup alt={sponsor} className={PERK_LOGO_CLASS} />;
    case "codex":
      return (
        <CodexLogo
          alt={sponsor}
          className="h-4.5 w-auto max-w-[6.5rem] shrink-0 object-contain"
        />
      );
    case "elevenlabs":
      return <ElevenLabsLogo alt={sponsor} className={PERK_LOGO_CLASS} />;
    case "n8n":
      return <N8nLogo alt={sponsor} className={PERK_LOGO_CLASS} />;
    case "zavu":
      return <ZavuLogo alt={sponsor} className={PERK_LOGO_CLASS} />;
    case "firecrawl":
      return <FirecrawlLogo alt={sponsor} className={PERK_LOGO_CLASS} />;
    case "datamcp":
      return <DatamcpLogo alt={sponsor} className={PERK_LOGO_CLASS} />;
    case "cognition":
      return (
        <CognitionLogo
          alt={sponsor}
          className="h-12 w-auto max-w-[18rem] shrink-0 object-contain"
        />
      );
    case "exa":
      return <ExaLogo alt={sponsor} className={PERK_LOGO_CLASS} />;
    case "wispr":
      return <WisprLogo alt={sponsor} className={PERK_LOGO_CLASS} />;
    case "fal":
      return <FalLogo alt={sponsor} className={PERK_LOGO_CLASS} />;
    default: {
      const _exhaustive: never = logo;
      return _exhaustive;
    }
  }
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [value]);

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className="shrink-0 border border-border px-2.5 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.1em] text-fg-3 transition-colors hover:border-accent hover:text-accent"
    >
      {copied ? "✓" : label}
    </button>
  );
}

function PerkSecretRow({
  label,
  secret,
  isLink,
  copyLabel,
}: {
  label: string;
  secret: string;
  isLink: boolean;
  copyLabel: string;
}) {
  return (
    <div className="flex flex-col gap-2 border border-border-faint bg-bg/40 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-fg-4">
          {label}
        </p>
        <p className="mt-1 break-all font-mono text-[0.8rem] leading-relaxed text-fg">
          {secret}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <CopyButton value={secret} label={copyLabel} />
        {isLink ? (
          <a
            href={secret}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-accent/40 px-2.5 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.1em] text-accent transition-colors hover:bg-accent/10"
          >
            →
          </a>
        ) : null}
      </div>
    </div>
  );
}

function PerkSocialLinks({ perkId }: { perkId: BuilderPerkId }) {
  const { t } = useTranslation();
  const links = getBuilderPerkSocialLinks(perkId);

  const items = [
    { href: links.website, label: t("builder.perks.social.website"), icon: IconBrandGlobe },
    { href: links.linkedin, label: t("builder.perks.social.linkedin"), icon: IconBrandLinkedin },
    { href: links.x, label: t("builder.perks.social.x"), icon: IconBrandX },
  ] as const;

  return (
    <div className="mt-4 flex flex-wrap gap-2 border-t border-border-faint pt-4">
      {items.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 border border-border px-2.5 py-1 font-mono text-[0.625rem] font-bold uppercase tracking-[0.1em] text-fg-3 transition-colors hover:border-accent/40 hover:text-accent"
        >
          <Icon size={12} className="shrink-0" />
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
}

function PerkStatusMessage({
  status,
  scope,
}: {
  status: MyPerk["status"];
  scope: MyPerk["scope"];
}) {
  const { t } = useTranslation();

  if (status === "ready") {
    return null;
  }

  let key: TranslationKey = "builder.perks.status.unavailable";
  if (status === "locked") {
    key = "builder.perks.status.locked";
  } else if (status === "pending") {
    key = "builder.perks.status.pending";
  } else if (status === "needs_team") {
    key = "builder.perks.status.needsTeam";
  }

  return (
    <p className="font-display text-[0.875rem] leading-relaxed text-fg-3">
      {t(key)}
      {scope === "team" && status === "needs_team" ? ` ${t("builder.perks.perTeamHint")}` : null}
    </p>
  );
}

function PersonalizedPerkCard({
  perkDef,
  entries,
  index,
}: {
  perkDef: (typeof BUILDER_PERK_DEFS)[number];
  entries: MyPerk[];
  index: number;
}) {
  const { t } = useTranslation();
  const copyLabel = t("builder.perks.copy");

  const readyEntries = entries.filter((entry) => entry.status === "ready");
  const worstStatus = entries.reduce<MyPerk["status"]>((acc, entry) => {
    const order: MyPerk["status"][] = [
      "locked",
      "unavailable",
      "needs_team",
      "pending",
      "ready",
    ];
    return order.indexOf(entry.status) < order.indexOf(acc) ? entry.status : acc;
  }, "ready");
  const isLocked = entries.every((entry) => entry.status === "locked");

  const primaryStatus = entries.length === 1 ? entries[0]!.status : worstStatus;
  const scope = entries[0]?.scope ?? "user";

  return (
    <article
      className={`reveal flex min-w-0 flex-col border border-border bg-surface p-5 sm:p-6${isLocked ? " opacity-60" : ""}`}
      style={{ "--delay": `${index * 0.04}s` } as React.CSSProperties}
    >
      <div className="flex items-start justify-between gap-3 border-b border-border-faint pb-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <PerkMark logo={perkDef.logo} sponsor={perkDef.sponsor} />
            {perkDef.perTeam ? (
              <span className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-accent">
                {t("builder.perks.perTeamBadge")}
              </span>
            ) : null}
          </div>
          <p className="mt-2 font-display text-[0.925rem] leading-[1.45] text-fg-3">
            {t(perkDef.descriptionKey)}
          </p>
        </div>
        <span className="shrink-0 font-display text-[1.025rem] font-bold tabular-nums text-accent">
          {perkDef.value}
        </span>
      </div>

      <p className="mt-4 font-display text-[0.9rem] leading-[1.5] text-fg-2">
        {t(perkDef.instructionKey)}
      </p>

      <div className="mt-4 space-y-2.5">
        {readyEntries.length > 0 ? (
          readyEntries.map((entry) => {
            if (entry.deliveryMode === "discord" && entry.channelUrl) {
              return (
                <div key={entry.entryId} className="space-y-2">
                  <a
                    href={entry.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex border border-accent/40 px-3 py-2 font-mono text-[0.7rem] font-bold uppercase tracking-[0.1em] text-accent transition-colors hover:bg-accent/10"
                  >
                    {t("builder.perks.discordCta")}
                  </a>
                </div>
              );
            }

            if (entry.secret) {
              const isLink =
                entry.deliveryMode === "unique_link" ||
                entry.deliveryMode === "shared_link";
              const variantLabel =
                entry.variant !== "default"
                  ? t(entry.labelKey as TranslationKey)
                  : perkDef.sponsor;

              return (
                <PerkSecretRow
                  key={entry.entryId}
                  label={
                    entries.length > 1
                      ? variantLabel
                      : isLink
                        ? t("builder.perks.yourLink")
                        : t("builder.perks.yourCode")
                  }
                  secret={entry.secret}
                  isLink={isLink}
                  copyLabel={copyLabel}
                />
              );
            }

            return null;
          })
        ) : (
          <PerkStatusMessage status={primaryStatus} scope={scope} />
        )}
      </div>

      <PerkSocialLinks perkId={perkDef.id} />
    </article>
  );
}

function GuestPerkCard({
  perkDef,
  index,
}: {
  perkDef: (typeof BUILDER_PERK_DEFS)[number];
  index: number;
}) {
  const { t } = useTranslation();

  return (
    <article
      className="reveal flex min-w-0 flex-col border border-border bg-surface p-5 sm:p-6 opacity-90"
      style={{ "--delay": `${index * 0.04}s` } as React.CSSProperties}
    >
      <div className="flex items-start justify-between gap-3 border-b border-border-faint pb-4">
        <div className="min-w-0">
          <PerkMark logo={perkDef.logo} sponsor={perkDef.sponsor} />
          <p className="mt-2 font-display text-[0.925rem] leading-[1.45] text-fg-3">
            {t(perkDef.descriptionKey)}
          </p>
        </div>
        <span className="shrink-0 font-display text-[1.025rem] font-bold tabular-nums text-accent">
          {perkDef.value}
        </span>
      </div>
      <p className="mt-4 font-display text-[0.9rem] leading-[1.5] text-fg-3">
        {t("builder.perks.signInToReveal")}
      </p>

      <PerkSocialLinks perkId={perkDef.id} />
    </article>
  );
}

export function BuilderCreditsHelpSection() {
  const { t } = useTranslation();
  const { isSignedIn } = useAuth();
  const { perks, eligible, eligibilityReason, isLoading } = useMyPerks();

  const perksBySponsor = useMemo(() => {
    const map = new Map<BuilderPerkId, MyPerk[]>();
    if (!perks) return map;
    for (const perk of perks) {
      const sponsorId = perk.sponsorId as BuilderPerkId;
      const existing = map.get(sponsorId) ?? [];
      existing.push(perk);
      map.set(sponsorId, existing);
    }
    return map;
  }, [perks]);

  return (
    <section id="credits" className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40 bg-bg">
      <BuilderSectionHeader
        id="credits"
        tagKey="builder.credits.tag"
        title1Key="builder.credits.title1"
        title2Key="builder.credits.title2"
        asideKey="builder.credits.aside"
        asideReplacements={{ amount: CREDITS_TOTAL }}
      />

      <div className="reveal mb-10 border border-accent/30 bg-accent/[0.04] px-5 py-4 sm:px-6">
        <p className="font-display text-[1rem] leading-[1.65] text-fg-2">
          {t(isSignedIn ? "builder.credits.introSignedIn" : "builder.credits.introGuest")}
        </p>
        {!isSignedIn ? (
          <div className="mt-4">
            <SignInButton mode="modal">
              <HubButton>{t("builder.credits.signInCta")}</HubButton>
            </SignInButton>
          </div>
        ) : null}
      </div>

      {isSignedIn && !isLoading && eligibilityReason && !eligible ? (
        <div className="reveal mb-8 border border-border bg-surface px-5 py-4 sm:px-6">
          <p className="font-display text-[0.95rem] leading-relaxed text-fg-2">
            {t(
              eligibilityReason === "list_pending"
                ? "builder.perks.eligibility.listPending"
                : "builder.perks.eligibility.notEligible",
            ).replace("{amount}", CREDITS_TOTAL)}
          </p>
        </div>
      ) : null}

      {!isSignedIn ? (
        <ol className="reveal mb-12 grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <li key={i} className="border border-border bg-surface p-5">
              <span className="font-mono text-[0.675rem] font-bold uppercase tracking-[0.14em] text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 font-display text-[0.95rem] font-semibold leading-[1.35] text-fg">
                {t(`builder.credits.general.i${i}.title` as TranslationKey)}
              </p>
              <p className="mt-1.5 font-display text-[0.9rem] leading-[1.55] text-fg-3">
                {t(`builder.credits.general.i${i}.body` as TranslationKey)}
              </p>
            </li>
          ))}
        </ol>
      ) : null}

      {isSignedIn && isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
          {BUILDER_PERK_DEFS.map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse border border-border bg-surface"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
          {BUILDER_PERK_DEFS.map((perkDef, i) => {
            if (isSignedIn && perks) {
              const entries = perksBySponsor.get(perkDef.id) ?? [];
              return (
                <PersonalizedPerkCard
                  key={perkDef.id}
                  perkDef={perkDef}
                  entries={entries}
                  index={i}
                />
              );
            }
            return <GuestPerkCard key={perkDef.id} perkDef={perkDef} index={i} />;
          })}
        </div>
      )}

      <p className="reveal mt-6 font-mono text-[0.675rem] leading-relaxed text-fg-4">
        {t("builder.credits.footer")}
      </p>
    </section>
  );
}
