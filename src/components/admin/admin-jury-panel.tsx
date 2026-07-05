import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { HUB_SCORING_RUBRIC } from "../../data/hub-scoring-rubric";
import { HubButton, HubCard, HubField, HubInput, HubTextarea } from "../hub/hub-ui-primitives";

export function AdminJuryPanel() {
  const teams = useQuery(api.hub.adminJury.listTeamsForScoring, {});
  const rankings = useQuery(api.hub.adminJury.getRankings, {});
  const submitScore = useMutation(api.hub.adminJury.submitScore);

  const [selectedTeamId, setSelectedTeamId] = useState<Id<"hub_teams"> | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");

  const selectedTeam = teams?.find((team) => team._id === selectedTeamId) ?? teams?.[0] ?? null;

  function loadTeamScores(team: NonNullable<typeof selectedTeam>) {
    if (team.myScore) {
      setScores({
        criterion1: team.myScore.criterion1,
        criterion2: team.myScore.criterion2,
        criterion3: team.myScore.criterion3,
        criterion4: team.myScore.criterion4,
        criterion5: team.myScore.criterion5,
      });
      setComment(team.myScore.comment ?? "");
      return;
    }
    setScores({});
    setComment("");
  }

  async function handleSubmit() {
    if (!selectedTeam) return;
    await submitScore({
      teamId: selectedTeam._id,
      criterion1: scores.criterion1 ?? 3,
      criterion2: scores.criterion2 ?? 3,
      criterion3: scores.criterion3 ?? 3,
      criterion4: scores.criterion4 ?? 3,
      criterion5: scores.criterion5 ?? 3,
      comment,
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <HubCard title="Score teams">
        <div className="mb-4 flex flex-wrap gap-2">
          {(teams ?? []).map((team) => (
            <HubButton
              key={team._id}
              variant={selectedTeam?._id === team._id ? "primary" : "ghost"}
              onClick={() => {
                setSelectedTeamId(team._id);
                loadTeamScores(team);
              }}
            >
              {team.name}
            </HubButton>
          ))}
        </div>

        {selectedTeam ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-fg">{selectedTeam.project?.name ?? "No project"}</p>
              <p className="mt-2 text-sm text-fg-2">{selectedTeam.project?.description}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                {selectedTeam.project?.url ? (
                  <a href={selectedTeam.project.url} target="_blank" rel="noreferrer" className="text-accent">
                    Live app
                  </a>
                ) : null}
                {(selectedTeam.project?.repoUrls ?? []).map((repoUrl) => (
                  <a key={repoUrl} href={repoUrl} target="_blank" rel="noreferrer" className="text-accent">
                    Repo
                  </a>
                ))}
                {selectedTeam.deliverables?.slidesUrl ? (
                  <a href={selectedTeam.deliverables.slidesUrl} target="_blank" rel="noreferrer" className="text-accent">
                    Slides
                  </a>
                ) : null}
                {selectedTeam.deliverables?.videoPlaybackUrl || selectedTeam.deliverables?.videoUrl ? (
                  <a
                    href={selectedTeam.deliverables.videoPlaybackUrl ?? selectedTeam.deliverables.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent"
                  >
                    Video
                  </a>
                ) : null}
              </div>
              <p className="mt-3 text-xs text-fg-3">
                Sponsor feedback complete: {selectedTeam.feedbackComplete ? "Yes" : "No"}
              </p>
            </div>

            {HUB_SCORING_RUBRIC.map((criterion) => (
              <HubField key={criterion.key} label={criterion.label}>
                <HubInput
                  type="number"
                  min={1}
                  max={5}
                  value={scores[criterion.key] ?? selectedTeam.myScore?.[criterion.key] ?? 3}
                  onChange={(e) =>
                    setScores((current) => ({
                      ...current,
                      [criterion.key]: Number(e.target.value),
                    }))
                  }
                />
              </HubField>
            ))}

            <HubField label="Comment">
              <HubTextarea value={comment} onChange={(e) => setComment(e.target.value)} />
            </HubField>

            <HubButton onClick={handleSubmit}>Save score</HubButton>
          </div>
        ) : null}
      </HubCard>

      <HubCard title="Rankings">
        <ol className="space-y-2 text-sm">
          {(rankings ?? []).map((row, index) => (
            <li key={row.teamId} className="flex justify-between border border-border-faint px-3 py-2">
              <span>
                #{index + 1} {row.teamName}
              </span>
              <span>
                {row.averageTotal.toFixed(1)} ({row.jurorCount})
              </span>
            </li>
          ))}
        </ol>
      </HubCard>
    </div>
  );
}
