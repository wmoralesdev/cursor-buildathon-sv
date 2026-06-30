import type { ProjectSubmitFormValues } from "../pages/project-submit-types";
import type { BuilderTeam } from "../hooks/use-builder-team";
import { ProjectSubmitFlow } from "./project-submit-flow";

type ProjectSubmitFormProps = {
  onSuccess: (teamName: string) => void;
  team: BuilderTeam;
  leaderSessionId: string;
};

export function ProjectSubmitForm({ onSuccess, team, leaderSessionId }: ProjectSubmitFormProps) {
  return <ProjectSubmitFlow onSuccess={onSuccess} team={team} leaderSessionId={leaderSessionId} />;
}

export type { ProjectSubmitFormValues };
