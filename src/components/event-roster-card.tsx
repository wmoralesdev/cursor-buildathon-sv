import { useEffect, useRef, useState, type CSSProperties } from "react";

import { useTranslation } from "../context/language-context";

export interface RosterCardProps {
  kind: "mentors" | "judges";
  index: number;
  name: string;
  role: string;
  initials: string;
  company?: string;
  companyHref?: string;
  companyLogo?: string;
  brief?: string;
  photo?: string;
  placeholder?: boolean;
  confirmedLabel: string;
  incomingLabel: string;
  unconfirmedRoleLabel: string;
  /** Slightly larger type for builder hub readability */
  legible?: boolean;
}

const RECORD_CODE: Record<RosterCardProps["kind"], string> = {
  mentors: "MTR",
  judges: "JDG",
};

export function EventRosterCard({
  kind,
  index,
  name,
  role,
  initials,
  company,
  companyHref,
  companyLogo,
  brief,
  photo,
  placeholder = false,
  confirmedLabel,
  incomingLabel,
  unconfirmedRoleLabel,
  legible = false,
}: RosterCardProps) {
  const recordCode = RECORD_CODE[kind];
  const recordNum = String(index + 1).padStart(2, "0");
  const hasRole = !placeholder && role !== "—" && role.trim().length > 0;
  const hasCompany = !placeholder && Boolean(company);
  const hasBrief = !placeholder && Boolean(brief && brief.trim().length > 0);
  const micro = legible ? "text-[0.675rem]" : "text-[0.6rem]";
  const nano = legible ? "text-[0.625rem]" : "text-[0.55rem]";
  const recordId = legible ? "text-[0.65rem]" : "text-[0.58rem]";
  const status = legible ? "text-[0.575rem]" : "text-[0.5rem]";
  const nameSize = legible
    ? "text-[1.0625rem] sm:text-[1.15rem]"
    : "text-[1rem] sm:text-[1.08rem]";
  const briefSize = legible ? "text-[0.85rem]" : "text-[0.78rem]";
  const companySize = legible ? "text-[0.9rem]" : "text-[0.82rem]";
  const bioToggleSize = legible ? "text-[0.675rem]" : "text-[0.6rem]";

  return (
    <article
      className="roster-card reveal group relative flex flex-col border border-border bg-surface overflow-hidden transition-colors duration-400 hover:border-accent/40"
      style={{ "--delay": `${index * 0.07}s` } as CSSProperties}
    >
      {/* ── Portrait / signal zone ────────────────────────── */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-deep/40">
        {/* tactical grid sits behind the cut-out subject so it reads on the bg */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-accent) 1px, transparent 1px), linear-gradient(to bottom, var(--color-accent) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage: "radial-gradient(ellipse 80% 75% at 50% 35%, black 25%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 75% at 50% 35%, black 25%, transparent 80%)",
          }}
        />

        {photo ? (
          <img
            src={photo}
            alt={name}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="absolute inset-0 z-[1] h-full w-full object-contain object-bottom grayscale contrast-[1.05] drop-shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition-[filter,transform] duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 z-[1] flex items-center justify-center">
            <span
              className={`font-mono uppercase ${
                placeholder
                  ? `text-fg-7 ${micro} tracking-[0.4em]`
                  : "text-accent/25 text-2xl tracking-[0.2em]"
              }`}
            >
              {placeholder ? "no signal" : initials}
            </span>
          </div>
        )}

        {placeholder && (
          <div
            className="absolute inset-x-0 top-0 z-[2] h-12 pointer-events-none roster-scan-line"
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--color-accent-glow) 50%, transparent)",
            }}
          />
        )}

        {/* top scrim keeps the record id + status legible over any photo */}
        <div className="absolute inset-x-0 top-0 z-[3] h-14 bg-gradient-to-b from-bg/70 to-transparent pointer-events-none" />

        {/* record id */}
        <span className={`absolute top-2.5 left-3 z-20 font-mono tracking-[0.16em] ${recordId}`}>
          <span className="text-accent">{recordCode}</span>
          <span className="text-fg/40">·{recordNum}</span>
        </span>

        {/* status */}
        <span
          className={`absolute top-2.5 right-3 z-20 flex items-center gap-1.5 border border-border bg-bg/65 px-1.5 py-0.5 font-mono uppercase tracking-[0.14em] ${status} ${
            placeholder ? "text-fg-4" : "text-fg-2"
          }`}
        >
          <span
            className={`block size-[5px] rounded-full ${
              placeholder
                ? "bg-fg-5 animate-pulse"
                : "bg-accent shadow-[0_0_7px_var(--color-accent-glow)]"
            }`}
          />
          {placeholder ? incomingLabel : confirmedLabel}
        </span>

        <span className="absolute bottom-2 right-2 z-20 h-3 w-3 border-b border-r border-accent/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      {/* ── Identity ──────────────────────────────────────── */}
      <div className="relative flex flex-1 flex-col gap-2 p-4">
        <h3
          className={`font-display font-bold uppercase leading-[1.1] tracking-[-0.01em] ${nameSize} ${
            placeholder ? "text-fg-5" : "text-fg"
          }`}
        >
          {name}
        </h3>

        <div className="flex items-center gap-2">
          <span className={`h-[2px] w-3.5 shrink-0 ${hasRole ? "bg-accent" : "bg-fg-6"}`} />
          <span
            className={`truncate font-mono uppercase tracking-[0.12em] ${micro} ${
              hasRole ? "text-accent" : "text-fg-6"
            }`}
          >
            {hasRole ? role : unconfirmedRoleLabel}
          </span>
        </div>

        {/* brief */}
        {hasBrief ? (
          <RosterBrief
            key={brief}
            brief={brief!}
            legible={legible}
            briefSize={briefSize}
            bioToggleSize={bioToggleSize}
          />
        ) : (
          !hasRole && (
            <div className="flex flex-col gap-1.5 py-0.5" aria-hidden>
              <span className="h-[3px] w-full bg-fg-7/70" />
              <span className="h-[3px] w-4/5 bg-fg-7/55" />
              <span className="h-[3px] w-2/5 bg-fg-7/40" />
            </div>
          )
        )}

        {/* company plate */}
        <div className="mt-auto flex min-h-[1.75rem] items-center border-t border-border-faint pt-3">
          {hasCompany ? (
            <CompanyMark
              company={company!}
              companyHref={companyHref}
              companyLogo={companyLogo}
              companySize={companySize}
            />
          ) : (
            <span className={`font-mono uppercase leading-none tracking-[0.16em] text-fg-6 ${nano}`}>
              org &mdash;&mdash;&mdash;
            </span>
          )}
        </div>
      </div>

      <span className="absolute bottom-0 left-0 z-30 h-px w-0 bg-accent transition-[width] duration-400 group-hover:w-full" />
    </article>
  );
}

function RosterBrief({
  brief,
  legible,
  briefSize,
  bioToggleSize,
}: {
  brief: string;
  legible: boolean;
  briefSize: string;
  bioToggleSize: string;
}) {
  const { t } = useTranslation();
  const [bioExpanded, setBioExpanded] = useState(false);
  const [bioTruncated, setBioTruncated] = useState(false);
  const briefRef = useRef<HTMLParagraphElement>(null);
  const bioLikelyTruncated = brief.length > 140 || brief.split(/\s+/).length > 22;

  useEffect(() => {
    if (legible) return;
    const el = briefRef.current;
    if (!el) return;

    const measure = () => {
      if (bioExpanded) return;
      setBioTruncated(el.scrollHeight > el.clientHeight + 1);
    };

    const frame = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [brief, bioExpanded, legible]);

  const showBioToggle = legible ? bioLikelyTruncated || bioExpanded : bioTruncated || bioExpanded;

  return (
    <div className="min-w-0">
      <p
        ref={briefRef}
        className={`font-display leading-[1.5] text-fg-3 ${briefSize} ${
          bioExpanded ? "" : "line-clamp-3"
        }`}
      >
        {brief}
      </p>
      {showBioToggle && (
        <button
          type="button"
          onClick={() => setBioExpanded((open) => !open)}
          aria-expanded={bioExpanded}
          className={`mt-1.5 font-mono uppercase tracking-[0.12em] text-accent transition-colors hover:text-fg ${bioToggleSize}`}
        >
          {bioExpanded ? t("roster.readLess") : t("roster.readMore")}
        </button>
      )}
    </div>
  );
}

function CompanyMark({
  company,
  companyHref,
  companyLogo,
  companySize,
}: {
  company: string;
  companyHref?: string;
  companyLogo?: string;
  companySize: string;
}) {
  const inner = companyLogo ? (
    <img
      src={companyLogo}
      alt={company}
      className="logo-img block h-5 w-auto max-w-[7rem] shrink-0 object-contain"
    />
  ) : (
    <span className={`truncate font-display font-semibold uppercase leading-none tracking-tight text-fg-2 transition-colors group-hover:text-fg ${companySize}`}>
      {company}
    </span>
  );

  if (companyHref) {
    return (
      <a
        href={companyHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={company}
        className="flex min-w-0 items-center"
      >
        {inner}
      </a>
    );
  }
  return <div className="flex min-w-0 items-center">{inner}</div>;
}
