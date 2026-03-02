import React from "react";
import { PersonCard } from "./brief/person-card";
import type { PersonCardData } from "./brief/person-card";
import { sortPeopleByName } from "../utils/sort-people";

const organizers: PersonCardData[] = [
  {
    initials: "OM",
    name: "Oscar Morales",
    photo: "/staff/oscar.jpeg",
    role: "Lead Organizer",
    blurb:
      "Founding AI Engineer en Finny, startup que mejora el bienestar financiero en LatAm; fundador de the502project, comunidad de +300 builders y founders en Guatemala. Cursor Ambassador, creador de contenido en CL y Notion — conectando talento tech y emprendedores en toda la región. Builder y community founder comprometido con hacer crecer el ecosistema de IA en Centroamérica.",
    hasCursorBadge: true,
  },
  {
    initials: "WM",
    name: "Walter Morales",
    photo: "/staff/walter.png",
    role: "Lead Organizer",
    blurb:
      "Fundador de AI Labs SV, comunidad de 500+ builders en El Salvador. Cursor Ambassador para El Salvador y Centroamérica — organiza eventos, talleres universitarios y hackathons en toda la región. 6+ años como software engineer en SOUTHWORKS (partner de AWS y Microsoft); colabora con universidades de El Salvador para elevar la educación tech en Centroamérica.",
    hasCursorBadge: true,
  },
];

const invitados: PersonCardData[] = [
  {
    initials: "DH",
    name: "Daniela Huezo",
    photo: "/staff/daniela.jpeg",
    role: "Tech Lead",
    company: "Community Builder",
    blurb: "Embajadora de Cursor y líder en tecnología; community builder estratégica con 5+ años liderando desarrollo de software y equipos de alto impacto.",
    hasCursorBadge: true,
  },
  {
    initials: "DC",
    name: "Diego Andrés Cum",
    photo: "/staff/diego-cum.jpeg",
    role: "Tech Lead",
    company: "DDR Innova",
    blurb: "Tech Lead y cofundador de DDR Innova; creador de AgentsGT/ConvoFlow; especializado en cloud, IA y sistemas escalables.",
    hasCursorBadge: true,
  },
  {
    initials: "DR",
    name: "Diego Rosales",
    photo: "/staff/diego-rosales.jpeg",
    role: "Mentor",
    company: "Energía verde · Alemania",
    blurb: "Desarrollador enfocado en sistemas distribuidos y descentralizados; trabajando en energía verde en Alemania.",
    hasCursorBadge: true,
  },
  {
    initials: "EK",
    name: "Edwin Kestler",
    photo: "/staff/edwin.jpeg",
    role: "CTO",
    company: "Flatbox",
    blurb: "CTO y cofundador de Flatbox; pionero IoT en Guatemala (GSMA/WMC 2017); background en seguridad informática.",
  },
  {
    initials: "EM",
    name: "Eleanor Menchú",
    photo: "/staff/eleanor.jpeg",
    role: "Founder",
    company: "We Solve",
    blurb: "Fundadora de We Solve; trabaja en educación y talento; apoya comunidades y hackathons como Cursor Ambassador en Guatemala.",
    hasCursorBadge: true,
  },
  {
    initials: "FC",
    name: "Frank Calderón",
    photo: "/staff/frank-calderon.jpeg",
    role: "Consultor IA",
    company: "LatAm",
    blurb: "Full‑Stack, consultor en IA y community builder con 15+ años creando soluciones en LatAm.",
  },
  {
    initials: "JA",
    name: "José Luis Antúnez Sales",
    photo: "/staff/jose-luis.jpeg",
    role: "Mentor",
    company: "SIT Guatemala",
    blurb: "Ingeniero en electrónica con 30+ años en telecom; asesor técnico en SIT Guatemala; enfocado en transformación digital, IA y redes comunitarias.",
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
      "Founder especializado en Insurtech y Estratega de Contenido para grandes corporaciones. Lidera proyectos donde la IA y la humanización de marcas se encuentran para generar resultados de negocio reales. Impulsando el ecosistema de innovación como Chapter Director en Startup Grind.",
  },
];

export function PeopleSection() {
  return (
    <section
      id="people"
      className="relative py-24 sm:py-32 section-padding bg-bg"
    >
      <div className="h-rule mb-16 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="reveal mb-16">
          <span className="tag mb-4 inline-block">// equipo & invitados</span>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="font-bold uppercase leading-none font-display text-[clamp(1.8rem,4vw,2.8rem)] text-fg tracking-[-0.02em]">
              LAS PERSONAS<br />DETRÁS DEL EVENTO
            </h2>
            <p className="font-display text-sm text-fg-3 leading-[1.7] max-w-[360px] sm:text-right">
              El equipo organizador y los invitados que harán posible el Cursor Hackathon Guatemala.
            </p>
          </div>
        </div>

        {/* Organizers */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-[0.58rem] tracking-[0.2em] text-accent uppercase">Organizadores</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {sortPeopleByName(organizers).map((person, i) => (
              <PersonCard key={person.name} {...person} size="lg" index={i} />
            ))}
          </div>
        </div>

        {/* Invitados */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-[0.58rem] tracking-[0.2em] text-accent uppercase">Invitados</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {sortPeopleByName(invitados).map((person, i) => (
              <PersonCard key={person.name} {...person} size="sm" index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
