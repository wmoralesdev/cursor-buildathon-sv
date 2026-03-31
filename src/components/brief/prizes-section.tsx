const prizes = [
  {
    place: "01",
    label: "1er Lugar",
    icon: "▲",
    accent: "#ff4b00",
    description: "Premio mayor para el equipo ganador",
  },
  {
    place: "02",
    label: "2do Lugar",
    icon: "▲",
    accent: "#cc3d00",
    description: "Premio para el segundo lugar",
  },
  {
    place: "03",
    label: "3er Lugar",
    icon: "▲",
    accent: "#883000",
    description: "Premio para el tercer lugar",
  },
];

const specialAwards = [
  { label: "Mejor Diseño", description: "Proyecto con la UX/UI más destacada" },
  { label: "Mayor Impacto Social", description: "Solución con mayor potencial de impacto en la comunidad" },
];

export function PrizesSection() {
  return (
    <section
      id="prizes"
      className="relative py-24 sm:py-32 section-padding bg-bg"
    >
      <div className="h-rule mb-16 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="reveal mb-12">
          <span className="tag mb-4 inline-block">// 03 — premios</span>
          <h2 className="font-display font-bold uppercase leading-none text-[clamp(1.8rem,4vw,2.8rem)] text-fg tracking-[-0.02em]">
            PREMIOS
          </h2>
          <p className="font-display mt-4 text-[0.875rem] text-fg-3 leading-[1.7] max-w-[440px]">
            Los premios serán anunciados próximamente. Sigue nuestras redes y el canal de WhatsApp para estar al tanto.
          </p>
        </div>

        {/* Main prizes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {prizes.map((prize, i) => (
            <div
              key={prize.place}
              className={`reveal relative overflow-hidden p-8 border ${i === 0 ? "border-accent/30 bg-accent/[0.03]" : "border-border bg-surface"}`}
              style={{ "--delay": `${i * 0.1}s` } as React.CSSProperties}
            >
              {i === 0 && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />
              )}

              <div className="font-mono text-[0.6rem] tracking-[0.15em] text-fg-5 uppercase mb-5">
                {prize.place}
              </div>

              <div
                className={`font-display text-[0.95rem] font-semibold uppercase tracking-[0.05em] mb-4 ${
                  prize.place === "01" ? "text-accent" : prize.place === "02" ? "text-accent-dim" : "text-prize-3"
                }`}
              >
                {prize.label}
              </div>

              <div className="font-display text-[1.4rem] font-bold text-fg-5 tracking-[0.1em] mb-3">
                PRÓXIMAMENTE
              </div>

              <p className="font-display text-[0.78rem] text-fg-4 leading-[1.6]">
                {prize.description}
              </p>
            </div>
          ))}
        </div>

        {/* Special awards */}
        <div className="reveal border border-border p-7 px-8">
          <div className="flex items-center gap-3 mb-6 border-b border-border-faint pb-4">
            <span className="font-mono text-[0.6rem] tracking-[0.15em] text-accent uppercase">
              //
            </span>
            <h3 className="font-display text-[0.85rem] font-semibold text-fg-2 tracking-[0.05em] uppercase">
              Premios Especiales (TBD)
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {specialAwards.map((award) => (
              <div key={award.label} className="flex items-start gap-3">
                <span className="font-mono text-[0.65rem] text-accent mt-[3px] shrink-0">
                  →
                </span>
                <div>
                  <div className="font-display text-[0.875rem] font-semibold text-fg-2 mb-1">
                    {award.label}
                  </div>
                  <div className="font-display text-[0.78rem] text-fg-4 leading-[1.6]">
                    {award.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
