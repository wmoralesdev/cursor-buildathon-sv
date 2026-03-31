import {
  EVENT_END_ISO,
  EVENT_START_ISO,
  EVENT_VENUE_FULL,
} from "../constants";

function siteBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_SITE_URL?.replace(/\/+$/, "");
  if (fromEnv) return fromEnv;
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:5173";
}

export function SeoJsonLd() {
  const base = siteBaseUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Cursor Buildathon El Salvador 2026",
    startDate: EVENT_START_ISO,
    endDate: EVENT_END_ISO,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url: `${base}/`,
    image: `${base}/og.png`,
    location: {
      "@type": "Place",
      name: EVENT_VENUE_FULL,
      address: {
        "@type": "PostalAddress",
        addressLocality: "San Salvador",
        addressCountry: "SV",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
