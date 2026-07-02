export const HUB_SCORING_RUBRIC = [
  { key: "criterion1", label: "Innovation", weight: 0.25 },
  { key: "criterion2", label: "Technical execution", weight: 0.2 },
  { key: "criterion3", label: "Design & UX", weight: 0.25 },
  { key: "criterion4", label: "Impact", weight: 0.2 },
  { key: "criterion5", label: "Presentation", weight: 0.1 },
] as const;

export type HubScoringCriterionKey = (typeof HUB_SCORING_RUBRIC)[number]["key"];

export function computeHubWeightedTotal(scores: Record<HubScoringCriterionKey, number>): number {
  const weighted = HUB_SCORING_RUBRIC.reduce(
    (sum, criterion) => sum + scores[criterion.key] * criterion.weight,
    0,
  );
  return Math.round(weighted * 20);
}
