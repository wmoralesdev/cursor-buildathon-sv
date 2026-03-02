import React from "react";

/*
const tracksReal = [
  {
    code: "T-01",
    name: "AI Consumer",
    description:
      "Apps y herramientas donde la IA hace algo útil por el usuario: responde, sugiere, crea o decide. No necesitas ser experto en modelos — si tu producto resuelve un problema real usando inteligencia artificial, este es tu track.",
    examples: [
      "chatbot que ayuda a estudiar para un examen",
      "app que genera recetas según lo que hay en tu refri",
      "asistente que explica contratos en lenguaje simple",
      "herramienta que resume reuniones y manda tareas por WhatsApp",
      "app de bienestar que te da rutinas personalizadas",
    ],
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden>
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 14v12M14 20h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="20" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    code: "T-02",
    name: "Fintech & Web3",
    description:
      "Productos que hacen más fácil mover, ahorrar o entender el dinero. Fiat o cripto, para personas o negocios — lo que importa es que resuelvas un problema financiero real. Si tu app toca pagos, remesas, ahorro o cualquier cosa relacionada con plata, este es tu lugar.",
    examples: [
      "app para que negocios del mercado acepten pagos digitales",
      "herramienta para que familias gestionen mejor sus remesas",
      "app de ahorro entre amigos con metas compartidas",
      "dashboard simple para freelancers que cobran en varias monedas",
      "calculadora de gastos para estudiantes universitarios",
    ],
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden>
        <rect x="4" y="12" width="32" height="20" rx="1.5" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <rect x="4" y="12" width="32" height="8" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="27" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 27h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];
*/

const tracks = [
  {
    code: "T-01",
    name: "???",
    description: "???",
    examples: ["???"],
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden>
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 14v12M14 20h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="20" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    code: "T-02",
    name: "???",
    description: "???",
    examples: ["???"],
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden>
        <rect x="4" y="12" width="32" height="20" rx="1.5" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <rect x="4" y="12" width="32" height="8" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="27" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 27h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function TracksSection() {
  return (
    <section
      id="tracks"
      className="relative py-24 sm:py-32 section-padding bg-bg"
    >
      <div className="h-rule mb-16 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="reveal mb-16">
          <span className="tag mb-4 inline-block">// 03 — categorías</span>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="font-bold uppercase leading-none font-display text-[clamp(1.8rem,4vw,2.8rem)] text-fg tracking-[-0.02em]">
              TRACKS DEL<br />HACKATHON
            </h2>
            <p className="font-display text-sm text-fg-3 leading-[1.7] max-w-[360px] sm:text-right">
              Dos tracks, un objetivo: construir algo real. Los equipos eligen su categoría al registrar su proyecto.
            </p>
          </div>
        </div>

        {/* Track cards — 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border">
          {tracks.map((track, i) => (
            <div
              key={track.code}
              className="reveal group relative bg-bg flex flex-col gap-8 p-8 sm:p-10 overflow-hidden transition-colors duration-300 hover:bg-accent/[0.02]"
              style={{ "--delay": `${i * 0.1}s` } as React.CSSProperties}
            >
              {/* Corner accent — top-right */}
              <span className="absolute top-0 right-0 w-8 h-8 border-t border-r border-accent/20 transition-colors duration-300 group-hover:border-accent/50" />
              <span className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-border transition-colors duration-300 group-hover:border-accent/20" />

              {/* Top row: code + icon */}
              <div className="flex items-start justify-between">
                <span className="font-mono text-[0.6rem] tracking-[0.2em] text-accent uppercase">
                  {track.code}
                </span>
                <div className="text-fg-3 transition-colors duration-300 group-hover:text-accent/60">
                  {track.icon}
                </div>
              </div>

              {/* Track name */}
              <div>
                <h3 className="font-display text-[clamp(1.4rem,2.5vw,1.9rem)] font-bold text-fg uppercase tracking-[-0.01em] leading-[1.1] mb-4">
                  {track.name}
                </h3>
                <p className="font-display text-[0.875rem] text-fg-3 leading-[1.75]">
                  {track.description}
                </p>
              </div>

              {/* Examples */}
              <div className="mt-auto pt-6 border-t border-border">
                <p className="font-mono text-[0.55rem] tracking-[0.18em] text-fg-4 uppercase mb-3">
                  Ejemplos →
                </p>
                <div className="flex flex-wrap gap-2">
                  {track.examples.map((ex) => (
                    <span
                      key={ex}
                      className="font-mono text-[0.58rem] tracking-[0.06em] text-fg-3 uppercase border border-border px-2.5 py-1 leading-none transition-colors duration-200 group-hover:border-border"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
