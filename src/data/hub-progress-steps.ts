export const HUB_PROGRESS_STEPS = [
  { id: "team_formed", labelKey: "hub.progress.teamFormed", auto: true },
  { id: "project_started", labelKey: "hub.progress.projectStarted", auto: true },
  { id: "social_posted", labelKey: "hub.progress.socialPosted", auto: true },
  { id: "checkpoint_midday", labelKey: "hub.progress.checkpointMidday", auto: false },
  { id: "deliverables_ready", labelKey: "hub.progress.deliverablesReady", auto: true },
  { id: "feedback_complete", labelKey: "hub.progress.feedbackComplete", auto: true },
  { id: "final_submitted", labelKey: "hub.progress.finalSubmitted", auto: true },
] as const;

export type HubProgressStepId = (typeof HUB_PROGRESS_STEPS)[number]["id"];

export const HUB_CHECKPOINTS = [
  { id: "cp_12pm", label: "12:00 PM", hour: 12, minute: 0 },
  { id: "cp_3pm", label: "3:00 PM", hour: 15, minute: 0 },
  { id: "cp_9pm", label: "9:00 PM", hour: 21, minute: 0 },
  { id: "cp_12am", label: "12:00 AM", hour: 0, minute: 0 },
  { id: "cp_4am", label: "4:00 AM", hour: 4, minute: 0 },
  { id: "cp_6am", label: "6:00 AM", hour: 6, minute: 0 },
] as const;

export type HubCheckpointId = (typeof HUB_CHECKPOINTS)[number]["id"];

/** Event day in America/El_Salvador — adjust if needed */
export const HUB_EVENT_TIMEZONE = "America/El_Salvador";
