import { useTheme } from "next-themes";

const LUMA_URL = "https://lu.ma/935r7zp6";

const navLinks = [
  { href: "#about", label: "Sobre el evento" },
  { href: "#details", label: "Detalles" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#schedule", label: "Agenda" },
  { href: "#faq", label: "FAQ" },
];

const hosts = [
  { name: "Oscar Morales", handle: "@theoscarvibes" },
  { name: "Walter Morales", handle: "@wmoralesdev" },
  { name: "the502project", handle: "@the502project" },
  { name: "Vudy App", handle: "@vudyme" },
];

export function FooterCTA() {
  const { resolvedTheme } = useTheme();

  return (
    <>
      {/* Final CTA Section */}
      <section className="relative py-36 sm:py-48 section-padding overflow-hidden bg-bg">
        {/* Glow behind text */}
        <div className="absolute pointer-events-none glow-center" />

        {/* Top rule */}
        <div className="h-rule mb-20 max-w-7xl mx-auto" />

        <div className="max-w-7xl mx-auto text-center reveal">
          <span className="tag mb-8 inline-block">// registro abierto</span>
          <h2 className="font-bold uppercase mb-6 font-display text-[clamp(3rem,10vw,8rem)] text-fg tracking-[-0.03em] leading-[0.9]">
            ¿LISTO PARA<br />
            <span className="text-accent">CONSTRUIR?</span>
          </h2>
          <p className="mx-auto mb-12 font-display text-[1.05rem] text-fg-3 leading-[1.7] max-w-[480px]">
            El cupo es limitado. Asegura tu lugar y construye el futuro de Centroamérica con IA.
          </p>

          <a
            href={LUMA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-phosphor inline-block text-base px-14 py-[18px]"
          >
            Registrate en Luma →
          </a>

          <div className="mt-8 font-mono text-[0.65rem] text-fg-5 tracking-[0.1em] uppercase">
            07 / 03 / 2026 &nbsp;·&nbsp; UVG Z15, Ciudad de Guatemala
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-24 section-padding border-t border-border bg-bg-deep">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 mb-12">
            {/* Brand */}
            <div>
              <div className="mb-5">
                <img
                  src={resolvedTheme === "light" ? "/lockup-light.png" : "/lockup-dark.png"}
                  alt="Cursor"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <p className="font-mono text-[0.65rem] text-fg-4 tracking-[0.06em] leading-[1.8]">
                Un evento de la Cursor Community.<br />
                Ciudad de Guatemala, 2026.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <p className="font-mono text-[0.55rem] text-fg-4 tracking-[0.2em] uppercase mb-3.5">
                Navegación
              </p>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="footer-nav-link font-display text-[0.82rem] text-fg-3 no-underline tracking-[0.04em] transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hosts */}
            <div>
              <p className="font-mono text-[0.55rem] text-fg-4 tracking-[0.2em] uppercase mb-3.5">
                Organizadores
              </p>
              <ul className="space-y-2">
                {hosts.map((host) => (
                  <li key={host.name} className="flex flex-col">
                    <span className="font-display text-[0.82rem] text-fg-2 tracking-[0.04em]">
                      {host.name}
                    </span>
                    <span className="font-mono text-[0.6rem] text-fg-4 tracking-[0.06em]">
                      {host.handle}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border-dim pt-5">
            <span className="font-mono text-[0.6rem] text-fg-5 tracking-[0.08em]">
              © 2026 Cursor Hackathon Guatemala · Presentado por Cursor Community
            </span>
            <a
              href={LUMA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[0.6rem] text-accent tracking-[0.12em] uppercase no-underline"
            >
              lu.ma/935r7zp6 →
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
