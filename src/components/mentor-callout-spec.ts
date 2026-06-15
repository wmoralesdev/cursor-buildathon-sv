/** ~15.3s @ 30fps — mentor recruitment callout; ends on partner wall, loops to hook. */
export const MENTOR_CALLOUT_DURATION_FRAMES = 459;

/**
 * Beat timeline in frames (30fps).
 *
 *   hook → why → what → how → cta → sponsors → loopOut
 *
 * No header/footer chrome bands — hook carries Cursor logo + copy only.
 */
export const MENTOR_CALLOUT_TIMELINE = {
  hook: { startFrame: 0, endFrame: 60 },
  why: { startFrame: 60, endFrame: 154 },
  what: { startFrame: 154, endFrame: 224 },
  how: { startFrame: 224, endFrame: 294 },
  cta: { startFrame: 294, endFrame: 339 },
  sponsorsIn: { startFrame: 339, endFrame: 419 },
  sponsorsHold: { startFrame: 419, endFrame: 444 },
  loopOut: { startFrame: 444, endFrame: 459 },
} as const;

export const MENTOR_CALLOUT_EYEBROW = "open call · remote or in person";

/** Buildathon window (local time), aligned with EVENT_START_ISO / EVENT_END_ISO. */
export const MENTOR_CALLOUT_EVENT_WINDOW = "JUL 4 · 8:00 → JUL 5 · 9:00 CST";

/** Persistent corner kicker (top-left), distinct from sponsor-spot chrome. */
export const MENTOR_CALLOUT_CORNER_EYEBROW = "Cursor Buildathon";

export const MENTOR_CALLOUT_CORNER_TITLE = "Mentor call";

/** Running beat-index spine (bottom-left). One label per content beat. */
export const MENTOR_CALLOUT_BEAT_INDEX_LABELS = [
  "Invite",
  "Why you",
  "Tracks",
  "Schedule",
  "Apply",
] as const;

export const MENTOR_CALLOUT_HOOK_LINES = ["Mentor builders.", "On your hours."] as const;

export const MENTOR_CALLOUT_WHY_HEADLINE = "Builders want your expertise.";

export const MENTOR_CALLOUT_WHY_SUB = "Shape what 200 of them ship in 24 hours.";

export const MENTOR_CALLOUT_TRACKS_EYEBROW = "what you'll mentor";

export const MENTOR_CALLOUT_TRACKS = [
  "UI / Design",
  "Engineering",
  "Product",
  "Business",
] as const;

export const MENTOR_CALLOUT_HOW_COMMAND = "mentor schedule";

export type MentorCalloutStep = {
  label: string;
  value: string;
};

export const MENTOR_CALLOUT_STEPS: MentorCalloutStep[] = [
  { label: "Set your window", value: "e.g. 2–5pm" },
  { label: "Share your booking link", value: "" },
  { label: "Teams book your slots", value: "" },
];

export const MENTOR_CALLOUT_CTA_HEADLINE = "DM us";

export const MENTOR_CALLOUT_CTA_LINE = "your area, experience + a short bio";

export const MENTOR_CALLOUT_DEADLINE = "by June 25";

export const MENTOR_CALLOUT_SPONSORS_EYEBROW = "Presented with";

export const MENTOR_CALLOUT_SPONSORS_TITLE = "Buildathon partners";
