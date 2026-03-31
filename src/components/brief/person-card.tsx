import { CursorBadge } from "./cursor-badge";

export interface PersonCardData {
  initials: string;
  name: string;
  role: string;
  company?: string;
  /** When set, company is rendered as an external link */
  companyHref?: string;
  blurb?: string;
  photo?: string;
  hasCursorBadge?: boolean;
  placeholder?: boolean;
}

interface PersonCardProps extends PersonCardData {
  index?: number;
  size?: "sm" | "lg";
}

export function PersonCard({
  initials,
  name,
  role,
  company,
  companyHref,
  blurb,
  photo,
  hasCursorBadge,
  placeholder,
  index = 0,
  size = "sm",
}: PersonCardProps) {
  const isLg = size === "lg";

  return (
    <article
      className="reveal group relative border border-border bg-surface overflow-hidden transition-all duration-500 hover:border-accent/30"
      style={{ "--delay": `${index * 0.1}s` } as React.CSSProperties}
    >
      {/* Diagonal accent line - top right corner */}
      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[1px] h-28 bg-gradient-to-b from-accent/60 via-accent/20 to-transparent origin-top-right rotate-45 translate-x-10 -translate-y-2" />
      </div>

      {/* Main layout */}
      <div className={`flex ${isLg ? "flex-col sm:flex-row" : "flex-row"} ${isLg ? "sm:items-stretch" : "items-stretch"}`}>
        {/* Photo container with overlay effects */}
        <div
          className={`relative shrink-0 overflow-hidden ${
            isLg
              ? "w-full sm:w-44 h-44 sm:h-full sm:min-h-[200px]"
              : "w-28 h-28"
          }`}
        >
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(to right, var(--accent) 1px, transparent 1px),
                linear-gradient(to bottom, var(--accent) 1px, transparent 1px)
              `,
              backgroundSize: isLg ? "22px 22px" : "14px 14px",
              maskImage: "linear-gradient(135deg, black 0%, transparent 60%)",
              WebkitMaskImage: "linear-gradient(135deg, black 0%, transparent 60%)",
            }}
          />

          {/* Photo or initials */}
          {photo ? (
            <>
              <img
                src={photo}
                alt=""
                className="absolute inset-0 h-full w-full object-cover grayscale-[20%] contrast-[1.05] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.03]"
              />
              {/* Gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-tr from-bg/60 via-transparent to-transparent opacity-60" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-accent/[0.03]">
              <span
                className={`font-mono tracking-[0.2em] uppercase ${
                  placeholder
                    ? "text-fg-7 text-xs"
                    : "text-accent/30 text-lg"
                }`}
              >
                {initials}
              </span>
            </div>
          )}

          {/* Index number - bottom left of photo */}
          <div className="absolute bottom-2 left-2 z-20">
            <span className="font-mono text-[0.6rem] tracking-[0.15em] text-fg/40">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Content area */}
        <div
          className={`relative flex flex-col flex-1 min-w-0 ${
            isLg ? "p-5 sm:p-6" : "p-3 sm:p-4"
          }`}
        >
          {/* Cursor badge - top right */}
          {hasCursorBadge && (
            <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3">
              <CursorBadge />
            </div>
          )}

          {/* Name */}
          <h3
            className={`font-display font-bold uppercase tracking-[-0.01em] leading-tight ${
              isLg ? "text-lg sm:text-xl" : "text-sm sm:text-base"
            } ${placeholder ? "text-fg-5" : "text-fg"} ${
              hasCursorBadge ? "pr-16" : ""
            }`}
          >
            {name}
          </h3>

          {/* Role with accent bar */}
          <div className="flex items-center gap-2 mt-2">
            <span className="w-4 h-[2px] bg-accent shrink-0" />
            <span
              className={`font-mono text-[0.6rem] tracking-[0.14em] uppercase ${
                role === "—" ? "text-fg-7" : "text-accent"
              }`}
            >
              {role}
            </span>
          </div>

          {/* Company */}
          {company && company !== "—" && (
            <div className="mt-1.5">
              {companyHref ? (
                <a
                  href={companyHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[0.55rem] tracking-[0.1em] uppercase text-fg-4 underline decoration-border underline-offset-2 transition-colors hover:text-accent hover:decoration-accent/50"
                >
                  {company}
                </a>
              ) : (
                <span className="font-mono text-[0.55rem] tracking-[0.1em] uppercase text-fg-4">{company}</span>
              )}
            </div>
          )}

          {/* Blurb */}
          {blurb && (
            <p
              className={`font-display text-fg-3 leading-[1.65] mt-3 ${
                isLg ? "text-[0.8rem] sm:text-[0.85rem]" : "text-[0.72rem]"
              }`}
            >
              {blurb}
            </p>
          )}

          {/* Decorative corner */}
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-border-faint opacity-50 group-hover:border-accent/30 transition-colors duration-500" />
        </div>
      </div>

      {/* Bottom accent line on hover */}
      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-500 group-hover:w-full" />
    </article>
  );
}
