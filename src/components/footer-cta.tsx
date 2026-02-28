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
  return (
    <>
      {/* Final CTA Section */}
      <section
        className="relative py-40 sm:py-48 px-8 sm:px-12 md:px-16 lg:px-24 overflow-hidden"
        style={{ background: "#080808" }}
      >
        {/* Glow behind text */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "700px",
            height: "400px",
            background: "radial-gradient(ellipse at center, rgba(255,75,0,0.1) 0%, transparent 70%)",
          }}
        />

        {/* Top rule */}
        <div className="h-rule mb-20 max-w-7xl mx-auto" />

        <div className="max-w-7xl mx-auto text-center reveal">
          <span className="tag mb-8 inline-block">// registro abierto</span>
          <h2
            className="font-bold uppercase mb-6"
            style={{
              fontFamily: "Chakra Petch, sans-serif",
              fontSize: "clamp(3rem, 10vw, 8rem)",
              color: "#f5f0e8",
              letterSpacing: "-0.03em",
              lineHeight: 0.9,
            }}
          >
            ¿LISTO PARA<br />
            <span style={{ color: "#ff4b00" }}>CONSTRUIR?</span>
          </h2>
          <p
            className="mx-auto mb-12"
            style={{
              fontFamily: "Chakra Petch, sans-serif",
              fontSize: "1.05rem",
              color: "#555555",
              lineHeight: 1.7,
              maxWidth: "480px",
            }}
          >
            El cupo es limitado. Asegura tu lugar y construye el futuro de Centroamérica con IA.
          </p>

          <a
            href={LUMA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-phosphor inline-block text-base"
            style={{ padding: "18px 56px" }}
          >
            Registrate en Luma →
          </a>

          <div
            className="mt-8"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.65rem",
              color: "#333333",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            07 / 03 / 2026 &nbsp;·&nbsp; UVG Z15, Ciudad de Guatemala
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative py-16 px-8 sm:px-12 md:px-16 lg:px-24"
        style={{
          borderTop: "1px solid #1e1e1e",
          background: "#060606",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 7L20.6 11V19L14 23L7.4 19V11L14 7Z" fill="#f5f0e8" fillOpacity="0.8" />
                </svg>
                <span
                  style={{
                    fontFamily: "Chakra Petch, sans-serif",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "#f5f0e8",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Cursor Hackathon GT
                </span>
              </div>
              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.65rem",
                  color: "#444444",
                  letterSpacing: "0.06em",
                  lineHeight: 1.8,
                }}
              >
                Un evento de la Cursor Community.<br />
                Ciudad de Guatemala, 2026.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.55rem",
                  color: "#444444",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "14px",
                }}
              >
                Navegación
              </p>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="footer-nav-link"
                      style={{
                        fontFamily: "Chakra Petch, sans-serif",
                        fontSize: "0.82rem",
                        color: "#555555",
                        textDecoration: "none",
                        letterSpacing: "0.04em",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hosts */}
            <div>
              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.55rem",
                  color: "#444444",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "14px",
                }}
              >
                Organizadores
              </p>
              <ul className="space-y-2">
                {hosts.map((host) => (
                  <li key={host.name} className="flex flex-col">
                    <span
                      style={{
                        fontFamily: "Chakra Petch, sans-serif",
                        fontSize: "0.82rem",
                        color: "#888888",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {host.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.6rem",
                        color: "#444444",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {host.handle}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ borderTop: "1px solid #111111", paddingTop: "20px" }}
          >
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.6rem",
                color: "#333333",
                letterSpacing: "0.08em",
              }}
            >
              © 2026 Cursor Hackathon Guatemala · Presentado por Cursor Community
            </span>
            <a
              href={LUMA_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.6rem",
                color: "#ff4b00",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              lu.ma/935r7zp6 →
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
