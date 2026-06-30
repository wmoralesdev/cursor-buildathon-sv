import type { ProjectSubmitFormValues } from "../pages/project-submit-types";
import {
  isValidDescription,
  isValidHttpUrl,
  isValidLinkedInProfile,
  isValidXProfile,
} from "./project-submit-validation";

export type ProjectSubmitStepKind =
  | "cover"
  | "team-name"
  | "member"
  | "add-fifth-member"
  | "repo"
  | "description"
  | "video"
  | "social"
  | "review";

export type ProjectSubmitStep = {
  id: string;
  kind: ProjectSubmitStepKind;
  memberIndex?: number;
};

export type BuildProjectSubmitStepsOptions = {
  /** When true, team name and member steps are supplied by a registered team and skipped. */
  skipTeamSteps?: boolean;
};

export function buildProjectSubmitSteps(
  memberCount: number,
  options: BuildProjectSubmitStepsOptions = {},
): ProjectSubmitStep[] {
  const steps: ProjectSubmitStep[] = [{ id: "cover", kind: "cover" }];

  if (!options.skipTeamSteps) {
    steps.push({ id: "team-name", kind: "team-name" });

    for (let index = 0; index < memberCount; index += 1) {
      steps.push({
        id: `member-${index}`,
        kind: "member",
        memberIndex: index,
      });
    }

    if (memberCount === 4) {
      steps.push({ id: "add-fifth-member", kind: "add-fifth-member" });
    }
  }

  steps.push(
    { id: "repo", kind: "repo" },
    { id: "description", kind: "description" },
    { id: "video", kind: "video" },
    { id: "social", kind: "social" },
    { id: "review", kind: "review" },
  );

  return steps;
}

export function getProjectSubmitProgressSteps(steps: ProjectSubmitStep[]): ProjectSubmitStep[] {
  return steps.filter((step) => step.kind !== "cover");
}

export function validateProjectSubmitStep(
  step: ProjectSubmitStep,
  values: ProjectSubmitFormValues,
): boolean {
  switch (step.kind) {
    case "cover":
      return true;
    case "team-name":
      return values.teamName.trim().length > 0;
    case "member": {
      const index = step.memberIndex ?? 0;
      const member = values.members[index];
      if (!member) return false;
      return (
        member.name.trim().length > 0 &&
        isValidXProfile(member.xProfile) &&
        isValidLinkedInProfile(member.linkedInProfile)
      );
    }
    case "add-fifth-member":
      return true;
    case "repo":
      return isValidHttpUrl(values.repoUrl);
    case "description":
      return isValidDescription(values.description);
    case "video":
      return values.video !== null;
    case "social":
      return isValidHttpUrl(values.eventSocialPostUrl);
    case "review":
      return true;
    default:
      return false;
  }
}
