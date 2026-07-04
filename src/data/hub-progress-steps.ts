export {
  HUB_CHECKPOINTS,
  HUB_CHECKPOINT_IDS,
  HUB_EVENT_TIMEZONE,
  checkpointLabel,
  type HubCheckpointId,
} from "../../convex/lib/hub_checkpoints";

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
