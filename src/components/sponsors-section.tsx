interface ImgLogoTileProps {
  src: string;
  alt: string;
  size?: "lg" | "sm";
  imgClassName?: string;
  noFilter?: boolean;
}

import React from "react";
import { useTheme } from "next-themes";

function tileBase(size: "lg" | "sm") {
  return `border border-border bg-bg-raised flex items-center justify-center transition-[border-color,background] duration-300 cursor-default ${size === "lg" ? "px-10 py-8 min-h-[100px]" : "px-8 py-6 min-h-[80px]"}`;
}

function hoverHandlers() {
  return {
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      el.style.borderColor = "rgba(255,75,0,0.5)";
      el.style.background = "rgba(255,75,0,0.04)";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      el.style.borderColor = "var(--border)";
      el.style.background = "var(--bg-raised)";
    },
  };
}

function LogoTile({ src, alt, size = "lg", imgClassName = "h-10", noFilter = false, fill = false }: ImgLogoTileProps & { fill?: boolean }) {
  return (
    <div className={`${tileBase(size)} ${fill ? "overflow-hidden p-0" : ""}`} {...hoverHandlers()}>
      <img
        src={src}
        alt={alt}
        className={`${fill ? "w-full h-full object-cover scale-150" : `w-auto object-contain ${imgClassName}`} ${noFilter ? "opacity-90 hover:opacity-100 transition-opacity duration-200" : "logo-img"}`}
      />
    </div>
  );
}


export function SponsorsSection() {
  const { resolvedTheme } = useTheme();

  return (
    <section id="sponsors" className="relative py-28 sm:py-36 lg:py-48 section-padding bg-bg-alt">
      <div className="max-w-7xl mx-auto">

        {/* Host — most prominent */}
        <div className="reveal mb-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="tag mb-4 inline-block">// presentado por</span>
              <h2 className="font-bold uppercase font-display text-[clamp(2rem,5vw,3rem)] text-fg tracking-[-0.02em] leading-[0.95]">
                HOST
              </h2>
            </div>
            <p className="font-mono text-[0.65rem] text-fg-3 tracking-[0.08em] leading-[1.6] max-w-[220px] text-right sm:text-right">
              La empresa detrás de las herramientas de IA que harán posible este evento
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
            {/* Corner accents */}
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

        {/* Divider */}
        <div className="h-rule mb-24" />

        {/* Sponsors */}
        <div className="mb-24">
          <div className="reveal flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="tag mb-4 inline-block">// patrocinadores</span>
              <h2 className="font-bold uppercase font-display text-[clamp(2rem,5vw,3rem)] text-fg tracking-[-0.02em] leading-[0.95]">
                SPONSORS
              </h2>
            </div>
            <p className="font-mono text-[0.65rem] text-fg-3 tracking-[0.08em] leading-[1.6] max-w-[220px] text-right">
              Hacen posible este evento
            </p>
          </div>

          <div className="reveal grid grid-cols-2 sm:grid-cols-4 gap-6">
            <LogoTile src="/uvg.png" alt="UVG" imgClassName="h-12" />
            <LogoTile src={resolvedTheme === "light" ? "/logo-vudy-dark.png" : "/logo-vudy.png"} alt="Vudy" imgClassName="h-10" noFilter />
            <LogoTile src="/paq.svg" alt="PAQ Wallet" imgClassName="h-10" />
            <LogoTile src="/v0.png" alt="v0" imgClassName="h-8" />
          </div>
        </div>

        {/* Divider */}
        <div className="h-rule mb-24" />

        {/* Partners */}
        <div>
          <div className="reveal flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="tag mb-4 inline-block">// aliados</span>
              <h2 className="font-bold uppercase font-display text-[clamp(2rem,5vw,3rem)] text-fg tracking-[-0.02em] leading-[0.95]">
                PARTNERS
              </h2>
            </div>
          </div>

          <div className="reveal grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div
              className="border border-border bg-bg-raised flex items-center justify-center px-8 py-6 min-h-[80px] h-[90px] overflow-hidden transition-[border-color,background] duration-300 cursor-default"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,75,0,0.5)";
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,75,0,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLDivElement).style.background = "var(--bg-raised)";
              }}
            >
              <img
                src="/502.png"
                alt="the502project"
                className="logo-img w-auto object-contain h-20 max-w-[100px]"
              />
            </div>
            <LogoTile src="/ailabs.svg" alt="AI Labs SV" size="sm" imgClassName="h-8 max-w-[140px]" />
            <LogoTile src="/ccti.svg" alt="CCTI" size="sm" imgClassName="h-10 max-w-[120px]" />
          </div>
        </div>

        {/* Become a sponsor CTA */}
        <div className="reveal mt-12 flex items-center justify-between flex-wrap gap-4 py-8 px-10 border border-dashed border-fg-6 bg-[rgba(255,75,0,0.02)]">
          <div>
            <p className="font-display text-base text-fg font-semibold mb-1">
              ¿Quieres ser sponsor?
            </p>
            <p className="font-mono text-[0.65rem] text-fg-3 tracking-[0.06em]">
              Conecta tu marca con los builders de Centroamérica
            </p>
          </div>
          <a
            href="mailto:wmoralesdev@gmail.com?subject=Cursor Hackathon GT - Patrocinio"
            className="btn-ghost text-sm px-6 py-2.5 inline-block no-underline"
          >
            Contáctanos →
          </a>
        </div>
      </div>
    </section>
  );
}
