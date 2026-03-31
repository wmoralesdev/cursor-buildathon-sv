const requirements = [
  {
    code: "R-01",
    text: "Construido durante la ventana oficial del buildathon (detalle de horas por anunciar)",
  },
  {
    code: "R-02",
    text: "Demo o presentación en vivo según formato que publiquen los organizadores",
  },
  {
    code: "R-03",
    text: "El proyecto debe usar Cursor como herramienta principal de desarrollo",
  },
  {
    code: "R-04",
    text: "Código accesible al finalizar: repositorio o enlace compartido con organizadores",
  },
  {
    code: "R-05",
    text: "No se permiten proyectos completos preexistentes; lineamientos finos se publicarán antes del evento",
  },
];

export function RequirementsSection() {
  return (
    <section
      id="requirements"
      className="relative py-24 sm:py-32 section-padding bg-bg-alt"
    >
      <div className="h-rule mb-16 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4 reveal">
            <span className="tag mb-4 inline-block">// entrega</span>
            <h2 className="font-bold uppercase leading-none font-display text-[clamp(1.8rem,4vw,2.8rem)] text-fg tracking-[-0.02em]">
              REQUISITOS DE<br />ENTREGA
            </h2>
            <p className="mt-4 font-display text-[0.875rem] text-fg-3 leading-[1.7]">
              Borrador orientativo; la lista definitiva se alineará con el reglamento publicado antes del buildathon.
            </p>
          </div>

          <div className="lg:col-span-8">
            {requirements.map((req, i) => (
              <div
                key={req.code}
                className="reveal flex items-start gap-6 py-5 border-b border-border-faint"
                style={{ "--delay": `${i * 0.07}s` } as React.CSSProperties}
              >
                <span className="font-mono text-[0.6rem] tracking-[0.15em] text-accent uppercase shrink-0 mt-1 min-w-[40px]">
                  {req.code}
                </span>
                <p className="font-display text-[0.9rem] text-fg-2 leading-[1.7] flex-1">
                  {req.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
