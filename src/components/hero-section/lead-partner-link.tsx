import type { LeadPartnerEntry } from "./hero-partner-config";

export function LeadPartnerLink({ partner }: { partner: LeadPartnerEntry }) {
  const Logo = partner.Logo;
  return (
    <a
      href={partner.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-7 items-center py-0.5 opacity-90 transition-[opacity,transform] duration-300 hover:opacity-100 hover:scale-[1.02] active:scale-[0.98]"
      aria-label={`${partner.label} — product partner`}
    >
      <Logo alt={partner.label} className={partner.className} />
    </a>
  );
}
