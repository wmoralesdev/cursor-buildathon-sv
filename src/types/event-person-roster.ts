export interface EventPersonRosterEntry {
  id: string;
  name: string;
  title: string;
  photo?: string;
  /** Employer / org the person represents. */
  company?: string;
  /** When set, the company name + logo link out. */
  companyHref?: string;
  /** Path to the company logo (mono SVG/PNG works best; tinted to fit the card). */
  companyLogo?: string;
  bio?: string;
  placeholder?: boolean;
  /** How the mentor is available during the event. Defaults to on-site. */
  presence?: "onsite" | "remote";
  /** Booking link for remote mentors. */
  bookingUrl?: string;
}
