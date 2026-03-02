const details = [
  {
    glyph: "01",
    label: "Fecha",
    value: "07/03/2026",
    sub: "Sábado",
    accent: false,
  },
  {
    glyph: "02",
    label: "Horario",
    value: "10AM — 5PM",
    sub: "7 horas de hackathon",
    accent: true,
  },
  {
    glyph: "03",
    label: "Sede",
    value: "UVG Z15",
    sub: "Universidad del Valle de Guatemala",
    accent: false,
  },
  {
    glyph: "04",
    label: "Ciudad",
    value: "Guatemala",
    sub: "Ciudad de Guatemala, GT",
    accent: false,
  },
];

export function DetailsSection() {
  return (
    <section
      id="details"
      className="relative py-28 sm:py-36 lg:py-48 section-padding bg-bg-alt"
    >
      {/* Top rule */}
      <div className="h-rule mb-20 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 reveal">
          <div>
            <span className="tag mb-4 inline-block">// detalles</span>
            <h2 className="font-bold uppercase leading-none font-display text-[clamp(2rem,5vw,3.5rem)] text-fg tracking-[-0.02em]">
              DÓNDE &amp; CUÁNDO
            </h2>
          </div>
          <p className="font-mono text-[0.7rem] text-fg-2 tracking-[0.1em] max-w-[240px] text-right leading-[1.6]">
            Asistencia presencial<br />requerida para participar
          </p>
        </div>

        {/* Detail cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {details.map((d, i) => (
            <div
              key={d.glyph}
              className={`reveal py-9 px-7 relative overflow-hidden border ${d.accent ? "border-accent/50 bg-accent/[0.06]" : "border-border bg-bg-raised"}`}
              style={{ "--delay": `${i * 0.08}s` } as React.CSSProperties}
            >
              {/* Index glyph */}
              <span
                className={`absolute top-4 right-4 font-mono text-[0.55rem] tracking-[0.1em] ${d.accent ? "text-accent/50" : "text-fg-6"}`}
              >
                {d.glyph}
              </span>

              {/* Corner accent for highlighted card */}
              {d.accent && (
                <div className="absolute top-0 left-0 w-0.5 h-10 bg-accent" />
              )}

              <p
                className={`font-mono text-[0.6rem] tracking-[0.18em] uppercase mb-3 ${d.accent ? "text-accent" : "text-fg-3"}`}
              >
                {d.label}
              </p>

              <p
                className={`font-display text-[clamp(1.3rem,3vw,1.8rem)] font-bold leading-[1.1] mb-2 ${d.accent ? "text-accent tracking-normal" : "text-fg tracking-[-0.02em]"}`}
              >
                {d.value}
              </p>

              <p className="font-mono text-[0.65rem] text-fg-4 tracking-[0.05em] leading-[1.5]">
                {d.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Map reference bar */}
        <div className="reveal mt-6 flex items-center justify-between flex-wrap gap-3 py-6 px-8 border border-border bg-bg-raised">
          <div className="flex items-center gap-4">
            <span className="text-accent text-[0.9rem]">◎</span>
            <span className="font-mono text-[0.7rem] text-fg-2 tracking-[0.08em]">
              18 Av. 11-95 Zona 15 Vista Hermosa III, Ciudad de Guatemala
            </span>
          </div>
          <a
            href="https://maps.google.com/?q=Universidad+del+Valle+de+Guatemala"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.65rem] text-accent tracking-[0.12em] uppercase no-underline border-b border-accent/30 pb-px transition-[border-color] duration-200 hover:border-accent"
          >
            Ver en mapa →
          </a>
        </div>
      </div>
    </section>
  );
}
