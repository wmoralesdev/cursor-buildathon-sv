export const HUB_CHECKPOINTS = [
  { id: "cp_12pm", label: "12:00 PM", hour: 12, minute: 0 },
  { id: "cp_3pm", label: "3:00 PM", hour: 15, minute: 0 },
  { id: "cp_9pm", label: "9:00 PM", hour: 21, minute: 0 },
  { id: "cp_12am", label: "12:00 AM", hour: 0, minute: 0 },
  { id: "cp_4am", label: "4:00 AM", hour: 4, minute: 0 },
  { id: "cp_6am", label: "6:00 AM", hour: 6, minute: 0 },
] as const;

export type HubCheckpointId = (typeof HUB_CHECKPOINTS)[number]["id"];

export const HUB_CHECKPOINT_IDS: readonly HubCheckpointId[] = HUB_CHECKPOINTS.map(
  (checkpoint) => checkpoint.id,
);

const checkpointLabelById = Object.fromEntries(
  HUB_CHECKPOINTS.map((checkpoint) => [checkpoint.id, checkpoint.label]),
) as Record<HubCheckpointId, string>;

export function checkpointLabel(id: string): string {
  return checkpointLabelById[id as HubCheckpointId] ?? id;
}

/** Event day in America/El_Salvador — adjust if needed */
export const HUB_EVENT_TIMEZONE = "America/El_Salvador";
