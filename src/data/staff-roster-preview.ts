import type { EventPersonRosterEntry } from "../types/event-person-roster";
import { isIrlMentor } from "../lib/mentor-irl-filter";
import { resolveMentorCompanySponsor } from "./sponsor-assets";
import {
  STAFF_PHOTO_SLUGS,
  staffPhoto,
  type StaffPhotoSlug,
} from "./staff-photos";

/** Calendly / Cal.com / Google Calendar links for remote mentors. */
const REMOTE_MENTOR_BOOKING_BY_SLUG: Partial<Record<StaffPhotoSlug, string>> = {
  "bruno-calderon": "https://cal.com/bruno-calderon/cursor-buildathon-sv",
  "carlos-amador": "https://cal.com/carlos-amador/cursor-buildathon-sv",
  "eduardo-amador": "https://cal.com/eduardo-amador/cursor-buildathon-sv",
  "jennifer-villalobos": "https://cal.com/jennifer-villalobos/cursor-buildathon-sv",
  "karla-perez-alonzo": "https://cal.com/karla-perez-alonzo/cursor-buildathon-sv",
  reno: "https://cal.com/reno/cursor-buildathon-sv",
  "sho-villalba": "https://cal.com/sho-villalba/cursor-buildathon-sv",
  "sofia-rocher": "https://cal.com/sofia-rocher/cursor-buildathon-sv",
  "victor-villalobos": "https://cal.com/victor-villalobos/cursor-buildathon-sv",
};

/** Strip Notion markdown / HTML to plain card copy. */
function cleanNotionText(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;

  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\\+\|/g, " · ")
    .replace(/\s+/g, " ")
    .trim();
}

interface MentorNotionRecord {
  name: string;
  role: string;
  bio?: string;
  company?: string;
  companyHref?: string;
  companyLogo?: string;
  presence?: "onsite" | "remote";
  bookingUrl?: string;
}

/**
 * Mentor copy synced from Notion — Buildathon SV Mentors database.
 * `role` maps to the card title line; `bio` is shown when present.
 */
const MENTOR_NOTION_BY_SLUG: Record<StaffPhotoSlug, MentorNotionRecord> = {
  "walter-morales": {
    name: "Walter Morales",
    role: "Regional Lead at Cursor",
    company: "Cursor",
  },
  "daniela-huezo": {
    name: "Daniela Huezo",
    role: "Co-founder at Ai Labs",
    company: "Ai Labs",
  },
  "andre-mendez": {
    name: "André Mendez",
    role: "CEO & Founder at Hualy, Chapter Director SG",
    company: "Hualy",
  },
  "oscar-morales": {
    name: "Oscar Morales",
    role: "desarrollador y emprendedor guatemalteco",
    bio: "Founder de Open2, la comunidad de startups y builders más grande de Guatemala, y Founding AI Engineer en una Fintech. Con un enfoque en el desarrollo de agentes autónomos e infraestructura de contexto, colabora de forma activa como embajador de Cursor y Notion.",
    company: "Open2",
  },
  "frank-calderon": {
    name: "Frank Calderón",
    role: "Consultor Tecnológico y de IA Aplicada, Desarrollador Full Stack y fundador de MentorIA Labs",
    bio: "Con más de 15 años de experiencia, ayuda a profesionales y organizaciones a adoptar tecnología, automatización e inteligencia artificial para trabajar de forma más eficiente. Es docente, conferencista internacional y líder de la comunidad WordPress Guatemala.",
    company: "MentorIA Labs",
  },
  "ben-kim": {
    name: "Ben Kim",
    role: "Regional Lead at Cursor",
    company: "Cursor",
  },
  "jaime-garcia": {
    name: "Jaime Garcia",
    role: "Data Engineer Lead & IEEE Computer Society Chair",
    bio: "Apasionado por la tecnología, con experiencia y algunas certificaciones en el ecosistema de Datos e Inteligencia Artificial. ¡Listo para ayudar a los equipos a construir y aprender juntos en este evento!",
    company: "IEEE Computer Society",
  },
  "pablo-gomez": {
    name: "Pablo Gomez",
    role: "Tech Lead @ Scalaty Solutions",
    bio: "Aerospace engineer building AI Infrastructure for LatAm",
    company: "Scalaty Solutions",
  },
  "fernando-melendez": {
    name: "Fernando Meléndez",
    role: "Fullstack Engineer at Boxful",
    bio: "Tengo casi 3 años de experiencia desarrollando backend y soluciones con Gen AI, siendo estos años en una startup en la que fui de los primeros integrantes del equipo, y ahora estamos en expansion en 5 paises.",
    company: "Boxful",
  },
  "nestor-recinos": {
    name: "Néstor Recinos",
    role: "Head of Development at Boxful",
    bio: "Tengo 5 años de experiencia desarrollando mayormente backend, y los últimos tres en una startup en la que fui de los primeros integrantes del equipo, y ahora estamos en 5 países.",
    company: "Boxful",
  },
  "carol-monroe": {
    name: "Carol Monroe",
    role: "Co-founder at Simov Labs",
    bio: "Con más de 15 años en estrategia, Carol Monroe es AI Strategist y Creative Builder. Es founder de Moonshot, su lab creativo donde construye y shippea productos, y co-founder de Simov Labs, donde automatiza procesos y diseña sistemas de AI para empresas. Lovable Champion y Supabase Contributor, ha acompañado a más de 1,000 builders en su camino.",
    company: "Simov Labs",
  },
  "carlos-amador": {
    name: "Carlos Amador",
    role: "CEO & Founder, Volcano Labs",
    bio: "CEO & Founder at Volcano Labs, a digital transformation agency based in Nicaragua specializing in software development, cloud infrastructure, and tech solutions across Latin America. Experienced engineer and technology consultant with a strong background in designing scalable, secure, and automated systems using cloud computing. Passionate about building tech products that solve real-world problems and help businesses grow.",
    company: "Volcano Labs",
  },
  "bruno-calderon": {
    name: "Bruno Calderon",
    role: "CTO at Livestack",
    company: "Livestack",
  },
  reno: {
    name: "reno",
    role: "co-founder · indies.la",
    bio: "Lleva una comunidad de emprendedores en indies.la, regala plata en amigos.sh. dev con 4 años de experiencia en startups de salud, ha ganado +10k USD en hackathones. fundo el club de open source en la universidad de santiago. college dropout. hizo sus primeros 500 dolares vendiendo cuentas de minecraft con nombres de 3 letras a las 13 años. top #2 de catan (juego de mesa) en chile.",
    company: "indies.la",
    companyHref: "https://indies.la",
  },
  "nelson-zepeda": {
    name: "Nelson Zepeda",
    role: "Founder at Simov Labs",
    bio: "Fundador de Simov Labs, ingeniero de datos y experto en IA con más de 16 años en el sector tecnológico. Especialista en Snowflake, MLOps y LLMs, ha liderado proyectos de transformación digital para empresas internacionales. Diseña arquitecturas de datos escalables, automatiza procesos con orquestadores modernos y desarrolla soluciones de IA generativa que resuelven problemas reales. Estudió Big Data en el Politécnico de Milán y hoy trabaja con clientes a nivel internacional y como fractional CDO.",
    company: "Simov Labs",
  },
  "gabriel-navarro": {
    name: "Gabriel Navarro",
    role: "Tecnología y gestión de proyectos · Co-fundador de GadDev",
    bio: "Especialista en gestión de proyectos, product management y seguridad de la información — ayuda a convertir ideas en productos que escalan. Co-fundador y líder técnico de GadDev, con amplia trayectoria en gestión de proyectos, metodologías ágiles, product management, desarrollo de software y liderazgo de equipos tecnológicos. Como mentor aporta una mirada de producto y de negocio, más allá del código. Bilingüe (ES/EN).",
    company: "GadDev",
  },
  "eduardo-amador": {
    name: "Eduardo Amador",
    role: "Creative Director, Volcano Labs",
    bio: "Co-Founder & Creative Director at Volcano Labs. Building brands, digital products, and new ventures from Central America. Focused on branding, UX/UI, and innovation-driven experiences that help businesses grow and adapt in a digital-first world.",
    company: "Volcano Labs",
  },
  "victor-villalobos": {
    name: "Victor Villalobos",
    role: "Founder & CEO at zavu.dev",
    company: "zavu.dev",
  },
  "maria-jose-navarro": {
    name: "María José Navarro",
    role: "Diseñadora Gráfica y estratega de marca · Co-fundadora de GadDev",
    bio: "Diseñadora Gráfica y estratega de marca, co-fundadora de GadDev. Licenciada en Diseño Gráfico, con amplia experiencia en branding, estrategia de marca, marketing digital e identidad visual. Como mentora ayuda a los equipos a construir la identidad y la narrativa de su producto: naming, posicionamiento, comunicación y cómo presentar su proyecto de forma clara y memorable.",
    company: "GadDev",
  },
  "sofia-rocher": {
    name: "Sofía Rocher",
    role: "Product Engineer at Fuse Finance",
    company: "Fuse Finance",
  },
  "jennifer-villalobos": {
    name: "Jennifer Villalobos",
    role: "Co-Founder at Zavu.dev",
    company: "Zavu.dev",
  },
  "cristian-correa": {
    name: "Cristian Correa",
    role: "Product Engineering at Crafter Station",
    company: "Crafter Station",
  },
  "karla-perez-alonzo": {
    name: "Karla Pérez Alonzo",
    role: "Business Transformation Consultant at Volcano Labs · Project Management · Commercial Strategy",
    bio: "Helping businesses scale through process optimization, operational excellence, and digital transformation initiatives that drive measurable results.",
    company: "Volcano Labs",
  },
  "sho-villalba": {
    name: "Sho Villalba",
    role: "Founder & Academic Director at Interface School",
    company: "Interface School",
  },
  "daniel-izquierdo": {
    name: "Daniel Izquierdo",
    role: "Principal Data Architect at DIAL Studio",
    company: "DIAL Studio",
  },
};

const LEAD_MENTOR_SLUGS = ["walter-morales", "daniela-huezo"] as const satisfies readonly StaffPhotoSlug[];

function buildMentorEntry(slug: StaffPhotoSlug): EventPersonRosterEntry {
  const notion = MENTOR_NOTION_BY_SLUG[slug];
  const bio = cleanNotionText(notion.bio);
  const company = cleanNotionText(notion.company);
  const sponsor = company ? resolveMentorCompanySponsor(company) : undefined;
  const companyHref = notion.companyHref ?? sponsor?.href;
  const companyLogo = notion.companyLogo ?? sponsor?.logo;
  const draft: EventPersonRosterEntry = {
    id: `mentor-${slug}`,
    name: notion.name,
    title: cleanNotionText(notion.role) ?? notion.role,
    photo: staffPhoto(slug),
    presence: notion.presence ?? "onsite",
    ...(bio ? { bio } : {}),
    ...(company ? { company } : {}),
    ...(companyHref ? { companyHref } : {}),
    ...(companyLogo ? { companyLogo } : {}),
    ...(notion.bookingUrl ? { bookingUrl: notion.bookingUrl } : {}),
  };

  if (!isIrlMentor(draft)) {
    draft.presence = "remote";
    draft.bookingUrl = notion.bookingUrl ?? REMOTE_MENTOR_BOOKING_BY_SLUG[slug];
  }

  return draft;
}

const otherMentorSlugs = STAFF_PHOTO_SLUGS.filter(
  (slug) => !(LEAD_MENTOR_SLUGS as readonly string[]).includes(slug),
).sort((a, b) =>
  MENTOR_NOTION_BY_SLUG[a].name.localeCompare(MENTOR_NOTION_BY_SLUG[b].name, "es", {
    sensitivity: "base",
  }),
);

/** Confirmed onsite mentors from `/public/staff` headshots + Notion copy. */
export const STAFF_ROSTER_MENTOR_PREVIEW: EventPersonRosterEntry[] = [
  ...LEAD_MENTOR_SLUGS.map(buildMentorEntry),
  ...otherMentorSlugs.map(buildMentorEntry),
];

/** Judges still pending confirmation. */
export const STAFF_ROSTER_JUDGE_PREVIEW: EventPersonRosterEntry[] = [
  {
    id: "judge-tba-1",
    name: "Judge TBA",
    title: "—",
    placeholder: true,
  },
  {
    id: "judge-tba-2",
    name: "Judge TBA",
    title: "—",
    placeholder: true,
  },
  {
    id: "judge-tba-3",
    name: "Judge TBA",
    title: "—",
    placeholder: true,
  },
];
