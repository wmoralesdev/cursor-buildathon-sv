import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { CursorBadge } from "../components/brief/cursor-badge";
import { sortPeopleByName } from "../utils/sort-people";

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────

interface ScheduleItem {
  time: string;
  title: string;
  desc: string;
  highlight?: boolean;
}

const schedule: ScheduleItem[] = [
  {
    time: "09:30",
    title: "Puertas abiertas",
    desc: "Check-in, café y networking. Si llegaste sin equipo, este es el momento para encontrar el tuyo.",
  },
  {
    time: "10:00",
    title: "Kickoff oficial",
    desc: "Bienvenida, reglas del juego, criterios de evaluación y presentación de los tracks.",
    highlight: true,
  },
  {
    time: "10:30",
    title: "¡Comienza el hackathon!",
    desc: "Arranca el reloj. Tienen 5 horas para construir algo que nadie ha visto antes.",
    highlight: true,
  },
  {
    time: "13:00",
    title: "Almuerzo + mentorías",
    desc: "Pausa para comer. Los mentores estarán en ronda para orientar equipos en producto, tech y estrategia.",
  },
  {
    time: "15:30",
    title: "Congelamiento de código",
    desc: "Se cierran los editores. Tiempo para pulir el pitch y preparar la demo.",
  },
  {
    time: "16:00",
    title: "Demos y pitches",
    desc: "3 minutos por equipo frente al jurado. Producto real, impacto claro.",
    highlight: true,
  },
  {
    time: "17:00",
    title: "Premiación y cierre",
    desc: "Anuncio de ganadores, reconocimientos y celebración.",
    highlight: true,
  },
];

const tracks = [
  {
    code: "T-01",
    name: "AI Consumer",
    tagline: "IA que hace algo útil por el usuario.",
    description:
      "Apps y herramientas donde la inteligencia artificial responde, sugiere, crea o decide en nombre del usuario. No necesitas ser experto en modelos — si tu producto resuelve un problema real usando IA, este es tu track.",
    examples: [
      "chatbot que ayuda a estudiar para un examen",
      "app que genera recetas según lo que hay en tu refri",
      "asistente que explica contratos en lenguaje simple",
      "herramienta que resume reuniones y manda tareas por WhatsApp",
      "app de bienestar que te da rutinas personalizadas",
    ],
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden>
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.3"
        />
        <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M20 14v12M14 20h12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="20" cy="20" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    code: "T-02",
    name: "Fintech & Web3",
    tagline: "Tecnología que cambia cómo se mueve el dinero.",
    description:
      "Productos que hacen más fácil mover, ahorrar o entender el dinero. Fiat o cripto, para personas o negocios — lo que importa es que resuelvas un problema financiero real. Si tu app toca pagos, remesas, ahorro o cualquier cosa relacionada con plata, este es tu lugar.",
    examples: [
      "app para que negocios del mercado acepten pagos digitales",
      "herramienta para que familias gestionen mejor sus remesas",
      "app de ahorro entre amigos con metas compartidas",
      "dashboard para freelancers que cobran en varias monedas",
      "calculadora de gastos para estudiantes universitarios",
    ],
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden>
        <rect
          x="4"
          y="12"
          width="32"
          height="20"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.3"
        />
        <rect
          x="4"
          y="12"
          width="32"
          height="8"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="27" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M20 27h8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

// Criteria mirrored from /admin source of truth (src/i18n/translations.ts).
// Criteria 1, 2, 4, 5 are shared across tracks.
// Criterion 3 is track-specific: AI Consumer uses "Valor de IA y productización",
// Fintech & Web3 uses "Confianza y corrección".
const sharedCriteria = [
  {
    code: "01",
    weight: "25%",
    name: "Problema e impacto",
    description: "¿Hay un problema real? ¿La solución genera impacto significativo?",
  },
  {
    code: "02",
    weight: "20%",
    name: "Originalidad",
    description: "¿El enfoque es creativo y diferenciado?",
  },
];

const trackCriterion3 = {
  ai_consumer: {
    code: "03",
    weight: "25%",
    name: "Valor de IA y productización",
    description: "¿La IA aporta valor real? ¿Está listo como producto?",
    track: "AI Consumer",
  },
  fintech_web3: {
    code: "03",
    weight: "25%",
    name: "Confianza y corrección",
    description: "¿Es confiable y correcto? ¿Maneja casos límite?",
    track: "Fintech & Web3",
  },
};

const sharedCriteria45 = [
  {
    code: "04",
    weight: "20%",
    name: "Ejecución y demo",
    description: "¿Funciona en la demo? ¿Qué tan completo está?",
  },
  {
    code: "05",
    weight: "10%",
    name: "Pitch y claridad",
    description: "¿Se comunicó con claridad y efectividad?",
  },
];

const prizes = [
  {
    place: "01",
    label: "1er Lugar",
    amount: "$250",
    description: "Premio en efectivo al equipo ganador.",
  },
  {
    place: "02",
    label: "2do Lugar",
    amount: "$150",
    description: "Premio en efectivo al segundo lugar.",
  },
  {
    place: "03",
    label: "3er Lugar",
    amount: "$100",
    description: "Premio en efectivo al tercer lugar.",
  },
];

interface PersonCardData {
  initials: string;
  name: string;
  photo?: string;
  role: string;
  company?: string;
  blurb?: string;
  hasCursorBadge?: boolean;
}

const mentors: PersonCardData[] = [
  {
    initials: "DH",
    name: "Daniela Huezo",
    photo: "/staff/daniela.jpeg",
    role: "Tech Lead",
    company: "Community Builder",
    blurb:
      "Embajadora de Cursor y líder en tecnología; community builder estratégica con 5+ años liderando desarrollo de software y equipos de alto impacto.",
    hasCursorBadge: true,
  },
  {
    initials: "DC",
    name: "Diego Andrés Cum",
    photo: "/staff/diego-cum.jpeg",
    role: "Tech Lead",
    company: "DDR Innova",
    blurb:
      "Tech Lead y cofundador de DDR Innova; creador de AgentsGT/ConvoFlow; especializado en cloud, IA y sistemas escalables.",
    hasCursorBadge: true,
  },
  {
    initials: "DR",
    name: "Diego Rosales",
    photo: "/staff/diego-rosales.jpeg",
    role: "Mentor",
    company: "Energía verde · Alemania",
    blurb:
      "Desarrollador enfocado en sistemas distribuidos y descentralizados; trabajando en energía verde en Alemania.",
    hasCursorBadge: true,
  },
  {
    initials: "EK",
    name: "Edwin Kestler",
    photo: "/staff/edwin.jpeg",
    role: "CTO",
    company: "Flatbox",
    blurb:
      "CTO y cofundador de Flatbox; pionero IoT en Guatemala (GSMA/WMC 2017); background en seguridad informática.",
  },
  {
    initials: "EM",
    name: "Eleanor Menchú",
    photo: "/staff/eleanor.jpeg",
    role: "Founder",
    company: "We Solve",
    blurb:
      "Fundadora de We Solve; trabaja en educación y talento; apoya comunidades y hackathons como Cursor Ambassador en Guatemala.",
    hasCursorBadge: true,
  },
  {
    initials: "FC",
    name: "Frank Calderón",
    photo: "/staff/frank-calderon.jpeg",
    role: "Consultor IA",
    company: "LatAm",
    blurb:
      "Full-Stack, consultor en IA y community builder con 15+ años creando soluciones en LatAm.",
  },
  {
    initials: "FS",
    name: "Francis Sanchinelli",
    photo: "/staff/francis.webp",
    role: "CEO",
    company: "U3Tech y Vudy · Presidente Asociación Blockchain Guatemala",
    blurb:
      "Emprendedor tecnológico con más de 15 años construyendo empresas. Participa como emprendedor en MIT REAP Guatemala y fue fundador de Ethereum Guatemala.",
  },
  {
    initials: "JA",
    name: "José Luis Antúnez Sales",
    photo: "/staff/jose-luis.jpeg",
    role: "Mentor",
    company: "SIT Guatemala",
    blurb:
      "Ingeniero en electrónica con 30+ años en telecom; asesor técnico en SIT Guatemala; enfocado en transformación digital, IA y redes comunitarias.",
  },
  {
    initials: "JB",
    name: "Jose Bustamante",
    photo: "/staff/jose.webp",
    role: "COO",
    company: "Vudy · MBA en Finanzas",
    blurb:
      "Profesional orientado a la tecnología con más de 6 años en gestión de proyectos, finanzas y operaciones. MBA en Finanzas con experiencia en gestión comercial y crecimiento estratégico.",
  },
  {
    initials: "AL",
    name: "Andrea de Leon",
    photo: "/staff/andrea.webp",
    role: "COO",
    company: "PAQ · Especialista en Fintech",
    blurb:
      "Especialista en fintech con más de 5 años en remesas y soluciones de wallets. Experta en expansión de agentes y estrategias de crecimiento sostenible.",
  },
  {
    initials: "AM",
    name: "André Mendez",
    photo: "/staff/andre.webp",
    role: "Founder",
    company: "Insurtech · Startup Grind",
    blurb:
      "Founder especializado en Insurtech y Estratega de Contenido para grandes corporaciones. Chapter Director en Startup Grind.",
  },
];

const rules = [
  "El código del proyecto debe escribirse durante el hackathon. No se admite código preescrito.",
  "Equipos de 2 a 4 personas. Participación individual no habilitada.",
  "Todos los proyectos deben registrarse en el track correspondiente antes del cierre de código.",
  "La demo es en vivo. 3 minutos por equipo — sin presentaciones pregrabadas.",
  "El uso de herramientas de IA (incluyendo Cursor) es obligatorio y celebrado.",
];

interface GuideStep {
  step: number;
  title: string;
  body: string | React.ReactNode;
}

const cursorCreditsGuide: GuideStep[] = [
  {
    step: 1,
    title: "Requisito de cuenta",
    body: "Necesitas una cuenta personal de Cursor. Las cuentas de equipo (team) y las cuentas estudiantiles no califican.",
  },
  {
    step: 2,
    title: "Escanea el QR",
    body: "Escanea el código QR disponible en el evento. El crédito de $20 USD se aplica automáticamente a tu cuenta.",
  },
  {
    step: 3,
    title: "Verifica en el dashboard",
    body: "El crédito aparece en el dashboard de Cursor. Si no lo ves de inmediato, espera unos segundos y recarga.",
  },
  {
    step: 4,
    title: "Si estás en trial gratuito",
    body: "Haz upgrade a Pro usando el crédito. El sistema pedirá una tarjeta, pero el cobro debe mostrar $0 USD o $0 Q. Si aparece otro monto, no confirmes y busca a un organizador.",
  },
  {
    step: 5,
    title: "Si ya eres Pro",
    body: "El crédito se aplica a tu próxima factura mensual. No necesitas hacer nada más después de canjear el QR.",
  },
];

const v0CreditsGuide: GuideStep[] = [
  {
    step: 1,
    title: "Requisito de cuenta",
    body: "Necesitas una cuenta activa en v0.app.",
  },
  {
    step: 2,
    title: "Abre el menú de créditos",
    body: (
      <>
        En el navbar de{" "}
        <a
          href="https://v0.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent border-b border-accent/30 pb-px hover:border-accent transition-[border-color] duration-200"
        >
          v0.app
        </a>
        , busca el contador de créditos y haz clic en el botón de canjear.
      </>
    ),
  },
  {
    step: 3,
    title: "Ingresa el código",
    body: (
      <>
        Usa el código <span className="font-mono text-fg">V0-GUATEMALA</span> para
        recibir $30 USD en créditos.
      </>
    ),
  },
];

// ─────────────────────────────────────────────
// Section: Welcome Hero
// ─────────────────────────────────────────────

function EventHero() {
  return (
    <section
      id="welcome"
      className="relative min-h-[70vh] flex flex-col overflow-hidden section-padding bg-bg"
    >
      <div className="absolute inset-0 pointer-events-none bg-grid mask-radial-hero" />
      <div className="absolute pointer-events-none glow-top-center" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-7xl mx-auto w-full pt-16 pb-24">
        <div className="mb-10">
          <span className="tag">07 · 03 · 2026 &nbsp;·&nbsp; UVG Z15</span>
        </div>

        <h1 className="font-bold uppercase leading-[0.9] font-display text-[clamp(3rem,11vw,9rem)] text-fg tracking-[-0.02em] mb-6">
          HOY<br />
          <span className="text-accent">CONSTRUIMOS.</span>
        </h1>

        <p className="font-mono text-[clamp(0.8rem,1.8vw,1rem)] text-fg-3 tracking-[0.15em] uppercase max-w-[600px]">
          Bienvenidos al primer hackathon de Guatemala con IA. Tienen 7 horas.
          Úsenlas bien.
        </p>

        <div className="mt-16 flex flex-wrap gap-8 justify-center border-t border-border pt-6">
          {[
            { value: "7h", label: "De hackathon" },
            { value: "2", label: "Tracks" },
            { value: "$500+", label: "En premios" },
            { value: "UVG Z15", label: "Sede" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-[1.5rem] font-bold text-fg leading-none">
                {stat.value}
              </div>
              <div className="font-mono text-[0.6rem] tracking-[0.15em] text-fg-3 uppercase mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Section: Agenda
// ─────────────────────────────────────────────

function EventAgenda() {
  return (
    <section
      id="agenda"
      className="relative py-24 sm:py-32 section-padding bg-bg-alt"
    >
      <div className="h-rule mb-16 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          <div className="lg:col-span-4 reveal">
            <span className="tag mb-4 inline-block">// 01 — agenda</span>
            <h2 className="font-bold uppercase leading-none mb-6 font-display text-[clamp(2rem,4vw,3rem)] text-fg tracking-[-0.02em]">
              EL DÍA<br />
              <span className="text-accent">07.03</span>
            </h2>
            <p className="font-display text-[0.9rem] text-fg-3 leading-[1.7] max-w-[300px]">
              Siete horas de construcción, mentoría y demos. Este es el desglose
              de lo que viene.
            </p>

            <div className="mt-8 inline-flex flex-col border border-border px-5 py-4">
              <span className="font-mono text-[0.55rem] tracking-[0.18em] uppercase text-fg-3 mb-1.5">
                tiempo de construcción
              </span>
              <span className="font-display text-[2rem] font-bold text-accent tracking-[-0.02em] leading-none">
                5h
              </span>
            </div>
          </div>

          <div className="lg:col-span-8 relative">
            <div className="absolute left-0 top-0 bottom-0 w-px timeline-line" />
            <div className="space-y-0 pl-8">
              {schedule.map((item, i) => (
                <div
                  key={item.time}
                  className={`reveal relative ${i === 0 ? "pt-0 pb-8" : i === schedule.length - 1 ? "pt-8 pb-0" : "py-8"} ${i < schedule.length - 1 ? "border-b border-border-dim" : ""}`}
                  style={{ "--delay": `${i * 0.07}s` } as React.CSSProperties}
                >
                  <div
                    className={`absolute rounded-full timeline-dot ${item.highlight ? "timeline-dot--highlight" : ""} ${i === 0 ? "timeline-dot--first" : ""}`}
                  />
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                    <span
                      className={`font-mono text-[0.75rem] tracking-[0.08em] min-w-[52px] shrink-0 ${item.highlight ? "text-accent" : "text-fg-4"}`}
                    >
                      {item.time}
                    </span>
                    <div>
                      <h3
                        className={`font-display text-base uppercase tracking-[0.03em] mb-1 ${item.highlight ? "font-semibold text-fg" : "font-medium text-fg-2"}`}
                      >
                        {item.title}
                      </h3>
                      <p className="font-display text-[0.82rem] text-fg-4 leading-[1.6]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Section: Tracks
// ─────────────────────────────────────────────

function EventTracks() {
  return (
    <section
      id="tracks"
      className="relative py-24 sm:py-32 section-padding bg-bg"
    >
      <div className="h-rule mb-16 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="reveal mb-16">
          <span className="tag mb-4 inline-block">// 02 — tracks</span>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="font-bold uppercase leading-none font-display text-[clamp(1.8rem,4vw,2.8rem)] text-fg tracking-[-0.02em]">
              LOS TRACKS<br />DE HOY
            </h2>
            <p className="font-display text-sm text-fg-3 leading-[1.7] max-w-[360px] sm:text-right">
              Dos categorías, un objetivo: construir algo real. Elijan su track
              y regístrenlo antes del cierre de código.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border">
          {tracks.map((track, i) => (
            <div
              key={track.code}
              className="reveal group relative bg-bg flex flex-col gap-8 p-8 sm:p-10 overflow-hidden transition-colors duration-300 hover:bg-accent/[0.02]"
              style={{ "--delay": `${i * 0.1}s` } as React.CSSProperties}
            >
              <span className="absolute top-0 right-0 w-8 h-8 border-t border-r border-accent/20 transition-colors duration-300 group-hover:border-accent/50" />
              <span className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-border transition-colors duration-300 group-hover:border-accent/20" />

              <div className="flex items-start justify-between">
                <span className="font-mono text-[0.6rem] tracking-[0.2em] text-accent uppercase">
                  {track.code}
                </span>
                <div className="text-fg-3 transition-colors duration-300 group-hover:text-accent/60">
                  {track.icon}
                </div>
              </div>

              <div>
                <p className="font-mono text-[0.6rem] tracking-[0.15em] text-fg-5 uppercase mb-2">
                  {track.tagline}
                </p>
                <h3 className="font-display text-[clamp(1.4rem,2.5vw,1.9rem)] font-bold text-fg uppercase tracking-[-0.01em] leading-[1.1] mb-4">
                  {track.name}
                </h3>
                <p className="font-display text-[0.875rem] text-fg-3 leading-[1.75]">
                  {track.description}
                </p>
              </div>

              <div className="mt-auto pt-6 border-t border-border">
                <p className="font-mono text-[0.55rem] tracking-[0.18em] text-fg-4 uppercase mb-3">
                  Ejemplos →
                </p>
                <div className="flex flex-wrap gap-2">
                  {track.examples.map((ex) => (
                    <span
                      key={ex}
                      className="font-mono text-[0.58rem] tracking-[0.06em] text-fg-3 uppercase border border-border px-2.5 py-1 leading-none"
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

// ─────────────────────────────────────────────
// Section: Prizes
// ─────────────────────────────────────────────

function EventPrizes() {
  return (
    <section
      id="premios"
      className="relative py-24 sm:py-32 section-padding bg-bg-alt"
    >
      <div className="h-rule mb-16 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="reveal mb-12">
          <span className="tag mb-4 inline-block">// 03 — premios</span>
          <h2 className="font-display font-bold uppercase leading-none text-[clamp(1.8rem,4vw,2.8rem)] text-fg tracking-[-0.02em]">
            LO QUE SE<br />LLEVAN
          </h2>
          <p className="font-display mt-4 text-[0.875rem] text-fg-3 leading-[1.7] max-w-[520px]">
            Más de $500 en premios en efectivo para los tres primeros lugares.
            Además, todos los equipos reciben créditos de Cursor para seguir
            construyendo después del evento.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
                  prize.place === "01"
                    ? "text-accent"
                    : prize.place === "02"
                      ? "text-accent-dim"
                      : "text-prize-3"
                }`}
              >
                {prize.label}
              </div>

              <div className="font-display text-[2.8rem] font-bold text-fg tracking-[-0.02em] leading-none mb-3">
                {prize.amount}
              </div>

              <p className="font-display text-[0.78rem] text-fg-4 leading-[1.6]">
                {prize.description}
              </p>
            </div>
          ))}
        </div>

        {/* Cursor credits for all teams */}
        <div className="reveal border border-accent/20 bg-accent/[0.02] p-7 px-8">
          <div className="flex items-start gap-4">
            <span className="font-mono text-[0.65rem] text-accent mt-[3px] shrink-0">→</span>
            <div>
              <div className="font-display text-[0.95rem] font-semibold text-fg mb-2">
                Créditos de Cursor para todos los equipos
              </div>
              <p className="font-display text-[0.82rem] text-fg-3 leading-[1.7]">
                Sin importar el lugar, todos los equipos participantes reciben
                créditos de Cursor al finalizar el hackathon. Úsalos para seguir
                construyendo. Ver la guía de canje más abajo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Section: Judging Criteria
// ─────────────────────────────────────────────

function EventJudging() {
  const allCriteria = [
    ...sharedCriteria,
    { ...trackCriterion3.ai_consumer, altName: trackCriterion3.fintech_web3.name, altDescription: trackCriterion3.fintech_web3.description },
    ...sharedCriteria45,
  ];

  return (
    <section
      id="evaluacion"
      className="relative py-24 sm:py-32 section-padding bg-bg"
    >
      <div className="h-rule mb-16 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="reveal mb-12">
          <span className="tag mb-4 inline-block">// 04 — evaluación</span>
          <h2 className="font-bold uppercase leading-none font-display text-[clamp(1.8rem,4vw,2.8rem)] text-fg tracking-[-0.02em]">
            CRITERIOS DE<br />EVALUACIÓN
          </h2>
          <p className="mt-4 font-display text-[0.875rem] text-fg-3 leading-[1.7] max-w-[520px]">
            El jurado puntúa de 1 a 5 en cada criterio. 3 minutos por equipo,
            sin excepción. El criterio 3 varía según el track del proyecto.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {allCriteria.map((c, i) => {
            const isTrackSpecific = c.code === "03";
            return (
              <div
                key={c.code}
                className={`reveal relative overflow-hidden border p-7 ${isTrackSpecific ? "border-accent/20 bg-accent/[0.015]" : "border-border bg-surface"}`}
                style={{ "--delay": `${i * 0.08}s` } as React.CSSProperties}
              >
                <div
                  aria-hidden="true"
                  className="absolute -bottom-4 -right-2 font-display text-[5rem] font-bold leading-none select-none pointer-events-none text-[rgba(255,75,0,0.04)]"
                >
                  {c.weight}
                </div>

                <div className="font-mono text-[0.6rem] tracking-[0.15em] text-fg-5 uppercase mb-3">
                  {c.code}
                </div>

                <div className="font-display text-[2.5rem] font-bold text-accent leading-none mb-3">
                  {c.weight}
                </div>

                {isTrackSpecific ? (
                  <div className="space-y-4">
                    <div>
                      <p className="font-mono text-[0.5rem] tracking-[0.15em] text-accent uppercase mb-1">
                        AI Consumer
                      </p>
                      <h3 className="font-display text-sm font-semibold text-fg uppercase tracking-[0.03em] mb-1">
                        {c.name}
                      </h3>
                      <p className="font-display text-[0.75rem] text-fg-3 leading-[1.6]">
                        {c.description}
                      </p>
                    </div>
                    <div className="border-t border-border pt-4">
                      <p className="font-mono text-[0.5rem] tracking-[0.15em] text-fg-4 uppercase mb-1">
                        Fintech & Web3
                      </p>
                      <h3 className="font-display text-sm font-semibold text-fg uppercase tracking-[0.03em] mb-1">
                        {"altName" in c ? c.altName : ""}
                      </h3>
                      <p className="font-display text-[0.75rem] text-fg-3 leading-[1.6]">
                        {"altDescription" in c ? c.altDescription : ""}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-display text-base font-semibold text-fg uppercase tracking-[0.03em] mb-3">
                      {c.name}
                    </h3>
                    <p className="font-display text-[0.8rem] text-fg-3 leading-[1.7]">
                      {c.description}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="reveal mt-4 flex items-center justify-between gap-4 flex-wrap border border-border py-5 px-7">
          <span className="font-mono text-[0.65rem] tracking-[0.15em] text-fg-5 uppercase">
            // puntaje total
          </span>
          <span className="font-display text-[1.2rem] font-bold text-fg">
            100%
          </span>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Mentor card (inline, no dep on brief component)
// ─────────────────────────────────────────────

function MentorCard({ mentor, index }: { mentor: PersonCardData; index: number }) {
  return (
    <article
      className="reveal group relative border border-border bg-surface overflow-hidden transition-all duration-500 hover:border-accent/30"
      style={{ "--delay": `${index * 0.07}s` } as React.CSSProperties}
    >
      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[1px] h-28 bg-gradient-to-b from-accent/60 via-accent/20 to-transparent origin-top-right rotate-45 translate-x-10 -translate-y-2" />
      </div>

      <div className="flex flex-row items-stretch">
        {/* Photo */}
        <div className="relative shrink-0 overflow-hidden w-28 h-28">
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-30"
            style={{
              backgroundImage: `linear-gradient(to right, var(--accent) 1px, transparent 1px), linear-gradient(to bottom, var(--accent) 1px, transparent 1px)`,
              backgroundSize: "14px 14px",
              maskImage: "linear-gradient(135deg, black 0%, transparent 60%)",
              WebkitMaskImage: "linear-gradient(135deg, black 0%, transparent 60%)",
            }}
          />
          {mentor.photo ? (
            <>
              <img
                src={mentor.photo}
                alt=""
                className="absolute inset-0 h-full w-full object-cover grayscale-[20%] contrast-[1.05] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-bg/60 via-transparent to-transparent opacity-60" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-accent/[0.03]">
              <span className="font-mono tracking-[0.2em] uppercase text-accent/30 text-lg">
                {mentor.initials}
              </span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 z-20">
            <span className="font-mono text-[0.6rem] tracking-[0.15em] text-fg/40">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative flex flex-col flex-1 min-w-0 p-3 sm:p-4">
          {mentor.hasCursorBadge && (
            <div className="absolute top-2.5 right-2.5">
              <CursorBadge />
            </div>
          )}
          <h3 className={`font-display font-bold uppercase tracking-[-0.01em] leading-tight text-sm sm:text-base text-fg ${mentor.hasCursorBadge ? "pr-16" : ""}`}>
            {mentor.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-4 h-[2px] bg-accent shrink-0" />
            <span className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-accent">
              {mentor.role}
            </span>
          </div>
          {mentor.company && (
            <div className="mt-1.5">
              <span className="font-mono text-[0.55rem] tracking-[0.1em] uppercase text-fg-4">
                {mentor.company}
              </span>
            </div>
          )}
          {mentor.blurb && (
            <p className="font-display text-fg-3 leading-[1.65] mt-3 text-[0.72rem]">
              {mentor.blurb}
            </p>
          )}
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-border-faint opacity-50 group-hover:border-accent/30 transition-colors duration-500" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-500 group-hover:w-full" />
    </article>
  );
}

// ─────────────────────────────────────────────
// Section: Mentors
// ─────────────────────────────────────────────

function EventMentors() {
  const mentorAreas = [
    { area: "Producto & UX", desc: "Diseño de experiencia y validación de ideas" },
    { area: "Ingeniería", desc: "Arquitectura, IA y uso avanzado de Cursor" },
    { area: "Negocio", desc: "Modelo de negocio, mercado y pitching" },
    { area: "Industria", desc: "Expertise sectorial por track" },
  ];

  return (
    <section
      id="mentores"
      className="relative py-24 sm:py-32 section-padding bg-bg-alt"
    >
      <div className="h-rule mb-16 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-14">
          <div className="lg:col-span-5 reveal">
            <span className="tag mb-4 inline-block">// 05 — mentores</span>
            <h2 className="font-bold uppercase leading-none font-display text-[clamp(1.8rem,4vw,2.8rem)] text-fg tracking-[-0.02em]">
              NO ESTÁN<br />SOLOS
            </h2>
            <p className="mt-4 font-display text-sm text-fg-3 leading-[1.7]">
              Tienen acceso a mentores durante todo el hackathon. No esperen
              hasta que estén bloqueados — búsquenlos desde temprano.
            </p>
          </div>

          <div className="lg:col-span-7 reveal reveal-delay-1 flex items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {mentorAreas.map((area) => (
                <div
                  key={area.area}
                  className="flex items-start gap-3 border border-border-faint p-4"
                >
                  <span className="font-mono text-[0.65rem] text-accent mt-0.5 shrink-0">→</span>
                  <div>
                    <div className="font-display text-[0.8rem] font-semibold text-fg-2 mb-0.5">
                      {area.area}
                    </div>
                    <div className="font-display text-[0.75rem] text-fg-4 leading-[1.5]">
                      {area.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {sortPeopleByName(mentors).map((mentor, i) => (
            <MentorCard key={mentor.name} mentor={mentor} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Section: Rules
// ─────────────────────────────────────────────

function EventRules() {
  return (
    <section
      id="reglas"
      className="relative py-24 sm:py-32 section-padding bg-bg"
    >
      <div className="h-rule mb-16 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 reveal">
            <span className="tag mb-4 inline-block">// 06 — reglas</span>
            <h2 className="font-bold uppercase leading-none font-display text-[clamp(1.8rem,4vw,2.8rem)] text-fg tracking-[-0.02em]">
              REGLAS<br />ESENCIALES
            </h2>
            <p className="mt-4 font-display text-sm text-fg-3 leading-[1.7] max-w-[340px]">
              Pocas reglas, claras. El objetivo es construir — no navegar
              burocracia.
            </p>
          </div>

          <div className="lg:col-span-7 reveal reveal-delay-1">
            <ul className="space-y-0">
              {rules.map((rule, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-4 py-5 ${i < rules.length - 1 ? "border-b border-border-dim" : ""}`}
                >
                  <span className="font-mono text-[0.6rem] tracking-[0.15em] text-accent shrink-0 mt-[3px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-display text-[0.875rem] text-fg-2 leading-[1.7]">
                    {rule}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Section: Credits Guide
// ─────────────────────────────────────────────

function EventCreditsGuide() {
  const { resolvedTheme } = useTheme();

  return (
    <section
      id="creditos"
      className="relative py-24 sm:py-32 section-padding bg-bg-alt"
    >
      <div className="h-rule mb-16 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-4 reveal">
            <span className="tag mb-4 inline-block">// 07 — créditos</span>
            <h2 className="font-bold uppercase leading-none font-display text-[clamp(1.8rem,4vw,2.8rem)] text-fg tracking-[-0.02em]">
              GUÍA DE<br />CANJE
            </h2>
            <p className="mt-4 font-display text-[0.85rem] text-fg-3 leading-[1.7] max-w-[280px]">
              Créditos de Cursor y v0 disponibles hoy. Sigue estos pasos para
              activarlos.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 border border-border px-4 py-3">
                <img
                  src={resolvedTheme === "light" ? "/lockup-light.png" : "/lockup-dark.png"}
                  alt="Cursor"
                  className="h-6 w-auto object-contain"
                />
                <span className="font-display text-[0.8rem] text-fg-3">$20 USD · QR en el evento</span>
              </div>
              <div className="flex items-center gap-3 border border-border px-4 py-3">
                <img src="/v0.png" alt="v0" className="h-6 w-auto object-contain" />
                <span className="font-display text-[0.8rem] text-fg-3">$30 USD · código V0-GUATEMALA</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-12">
            {/* Cursor guide */}
            <div className="reveal">
              <span className="font-mono text-[0.55rem] tracking-[0.2em] text-accent uppercase block mb-4">
                // Cursor Credits
              </span>
              <ol className="space-y-0">
                {cursorCreditsGuide.map((item, i) => (
                  <li
                    key={`cursor-${i}`}
                    className={`flex items-start gap-4 py-5 ${i < cursorCreditsGuide.length - 1 ? "border-b border-border-dim" : ""}`}
                    style={{ "--delay": `${i * 0.05}s` } as React.CSSProperties}
                  >
                    <span className="font-mono text-[0.6rem] tracking-[0.15em] text-accent shrink-0 mt-[3px] w-6">
                      {String(item.step).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-[0.9rem] font-semibold text-fg uppercase tracking-[0.03em] mb-1.5">
                        {item.title}
                      </h3>
                      <div className="font-display text-[0.82rem] text-fg-3 leading-[1.7]">
                        {item.body}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* v0 guide */}
            <div className="reveal">
              <span className="font-mono text-[0.55rem] tracking-[0.2em] text-fg-4 uppercase block mb-4">
                // v0 Credits
              </span>
              <ol className="space-y-0">
                {v0CreditsGuide.map((item, i) => (
                  <li
                    key={`v0-${i}`}
                    className={`flex items-start gap-4 py-5 ${i < v0CreditsGuide.length - 1 ? "border-b border-border-dim" : ""}`}
                    style={{ "--delay": `${i * 0.05}s` } as React.CSSProperties}
                  >
                    <span className="font-mono text-[0.6rem] tracking-[0.15em] text-fg-4 shrink-0 mt-[3px] w-6">
                      {String(item.step).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-[0.9rem] font-semibold text-fg uppercase tracking-[0.03em] mb-1.5">
                        {item.title}
                      </h3>
                      <div className="font-display text-[0.82rem] text-fg-3 leading-[1.7]">
                        {item.body}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Section: Closing Rally
// ─────────────────────────────────────────────

function EventClose() {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <section
        id="cierre"
        className="relative py-36 sm:py-48 section-padding overflow-hidden bg-bg"
      >
        <div className="absolute pointer-events-none glow-center" />
        <div className="h-rule mb-20 max-w-7xl mx-auto" />

        <div className="max-w-7xl mx-auto text-center reveal">
          <span className="tag mb-8 inline-block">// a construir</span>
          <h2 className="font-bold uppercase mb-6 font-display text-[clamp(3rem,10vw,8rem)] text-fg tracking-[-0.03em] leading-[0.9]">
            TIENEN<br />
            <span className="text-accent">7 HORAS.</span>
          </h2>
          <p className="mx-auto mb-4 font-display text-[1.05rem] text-fg-3 leading-[1.7] max-w-[480px]">
            Construyan algo que nadie ha visto antes. A las 16:00 demuestran lo
            que hicieron.
          </p>
          <p className="mx-auto font-display text-[0.875rem] text-fg-5 leading-[1.7] max-w-[420px]">
            Usen a los mentores, usen Cursor, usen la IA. Para eso están aquí.
          </p>

          <div className="mt-10 font-mono text-[0.65rem] text-fg-5 tracking-[0.1em] uppercase">
            07 · 03 · 2026 &nbsp;·&nbsp; UVG Z15 &nbsp;·&nbsp; Ciudad de
            Guatemala
          </div>
        </div>
      </section>

      <footer className="relative py-16 section-padding border-t border-border bg-bg-deep">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="mb-3">
              <img
                src={
                  resolvedTheme === "light"
                    ? "/lockup-light.png"
                    : "/lockup-dark.png"
                }
                alt="Cursor Hackathon Guatemala"
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="font-mono text-[0.6rem] text-fg-5 tracking-[0.08em]">
              © 2026 Cursor Hackathon Guatemala · Ciudad de Guatemala
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
            <Link
              to="/"
              className="font-mono text-[0.65rem] tracking-[0.12em] text-fg-3 no-underline uppercase transition-colors duration-200 hover:text-fg"
            >
              ← Sitio principal
            </Link>
            <Link
              to="/brief"
              className="font-mono text-[0.65rem] tracking-[0.12em] text-fg-3 no-underline uppercase transition-colors duration-200 hover:text-fg"
            >
              Brief →
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export function EventPage() {
  return (
    <main>
      <EventHero />
      <EventAgenda />
      <EventTracks />
      <EventPrizes />
      <EventJudging />
      <EventMentors />
      <EventRules />
      <EventCreditsGuide />
      <EventClose />
    </main>
  );
}
