import { useTheme } from "next-themes";

import { AnchorHeading } from "./anchor-heading";
import { SPONSOR_MAILTO } from "../constants";
import { useTranslation } from "../context/language-context";

export function SponsorsSection() {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <section id="sponsors" className="group relative py-28 sm:py-36 lg:py-48 section-padding bg-bg-alt">
      <div className="max-w-7xl mx-auto">
        <div className="reveal mb-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="tag mb-4 inline-block">{t("sponsorsPage.hostTag")}</span>
              <AnchorHeading id="sponsors">
                <h2 className="font-bold uppercase font-display text-[clamp(2rem,5vw,3rem)] text-fg tracking-[-0.02em] leading-[0.95]">
                  {t("sponsorsPage.hostTitle")}
                </h2>
              </AnchorHeading>
            </div>
            <p className="font-mono text-[0.65rem] text-fg-3 tracking-[0.08em] leading-[1.6] max-w-[220px] text-right sm:text-right">
              {t("sponsorsPage.hostAside")}
            </p>
          </div>

          <div
            className="relative flex items-center justify-center border border-accent/30 bg-bg-raised overflow-hidden min-h-[100px] transition-[border-color,background] duration-300 cursor-default"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,75,0,0.7)";
              (e.currentTarget as HTMLDivElement).style.background = "rgba(255,75,0,0.03)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,75,0,0.3)";
              (e.currentTarget as HTMLDivElement).style.background = "var(--bg-raised)";
            }}
          >
            <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent" />
            <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accent" />
            <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accent" />
            <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent" />

            <img
              src={resolvedTheme === "light" ? "/lockup-light.png" : "/lockup-dark.png"}
              alt="Cursor"
              className="relative z-10 w-auto object-contain h-10"
            />
          </div>
        </div>

        <div className="h-rule mb-24" />

        <div id="partners" className="scroll-mt-28">
          <div className="reveal flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-6">
            <div>
              <span className="tag mb-4 inline-block">{t("sponsorsPage.communityTag")}</span>
              <AnchorHeading id="partners">
                <h2 className="font-bold uppercase font-display text-[clamp(1.5rem,3vw,2rem)] text-fg tracking-[-0.02em] leading-[0.95]">
                  {t("sponsorsPage.communityTitle")}
                </h2>
              </AnchorHeading>
            </div>
          </div>
          <p className="font-display text-sm text-fg-3 leading-[1.7] max-w-xl">{t("sponsorsPage.communityBody")}</p>
          <a
            href={SPONSOR_MAILTO}
            className="inline-block mt-4 font-mono text-[0.65rem] text-accent tracking-[0.12em] uppercase no-underline border-b border-accent/30 pb-0.5 hover:border-accent transition-colors"
          >
            {t("sponsorsPage.contact")}
          </a>
        </div>
      </div>
    </section>
  );
}
