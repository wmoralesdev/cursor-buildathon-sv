/**
 * Staff headshots in `/public/staff`.
 * Filenames follow `{firstname}-{lastname}.{ext}` (or `{firstname}.{ext}` for single names).
 */
export const STAFF_PHOTOS = {
  "andre-mendez": "/staff/andre-mendez.jpeg",
  "ben-kim": "/staff/ben-kim.jpeg",
  "bruno-calderon": "/staff/bruno-calderon.jpeg",
  "carlos-amador": "/staff/carlos-amador.jpeg",
  "carol-monroe": "/staff/carol-monroe.jpeg",
  "cristian-correa": "/staff/cristian-correa.jpeg",
  "daniel-izquierdo": "/staff/daniel-izquierdo.jpeg",
  "daniela-huezo": "/staff/daniela-huezo.jpeg",
  "eduardo-amador": "/staff/eduardo-amador.jpeg",
  "fernando-melendez": "/staff/fernando-melendez.jpeg",
  "frank-calderon": "/staff/frank-calderon.jpg",
  "gabriel-navarro": "/staff/gabriel-navarro.png",
  "jaime-garcia": "/staff/jaime-garcia.jpeg",
  "jennifer-villalobos": "/staff/jennifer-villalobos.jpeg",
  "karla-perez-alonzo": "/staff/karla-perez-alonzo.jpeg",
  "maria-jose-navarro": "/staff/maria-jose-navarro.jpeg",
  "nelson-zepeda": "/staff/nelson-zepeda.JPG",
  "nestor-recinos": "/staff/nestor-recinos.jpeg",
  "oscar-morales": "/staff/oscar-morales.jpeg",
  "pablo-gomez": "/staff/pablo-gomez.jpeg",
  reno: "/staff/reno.jpeg",
  "sho-villalba": "/staff/sho-villalba.jpeg",
  "sofia-rocher": "/staff/sofia-rocher.jpeg",
  "victor-villalobos": "/staff/victor-villalobos.jpeg",
  "walter-morales": "/staff/walter-morales.jpeg",
} as const;

export type StaffPhotoSlug = keyof typeof STAFF_PHOTOS;

export const STAFF_PHOTO_SLUGS = Object.keys(STAFF_PHOTOS) as StaffPhotoSlug[];

export function staffPhoto(slug: StaffPhotoSlug): string {
  return STAFF_PHOTOS[slug];
}

export function staffNameFromSlug(slug: StaffPhotoSlug): string {
  if (slug === "reno") return "Reno";
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
