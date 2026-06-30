import { useState } from "react";
import { useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";
import { isConvexConfigured } from "../lib/convex-client";
import { getOrCreateSessionId } from "../lib/builder-team-session";

import type { TrackPrizeId } from "../data/prizes";
import type { CompetitionTrackId } from "../data/competition-tracks";

export type BuilderTeamMember = {
  name: string;
  xProfile: string;
  linkedInProfile: string;
  isLeader: boolean;
  isYou: boolean;
};

export type BuilderTeam = {
  teamId: string;
  name: string;
  inviteCode: string | null;
  sponsorTrack: TrackPrizeId | null;
  competitionTrack: CompetitionTrackId | null;
  isLeader: boolean;
  submitted: boolean;
  memberCount: number;
  maxMembers: number;
  members: BuilderTeamMember[];
};

const MIN_SUBMIT_MEMBERS = 4;

export function useBuilderTeam() {
  const [sessionId] = useState(() => getOrCreateSessionId());

  const team = useQuery(
    api.eventTeams.getTeamBySession,
    isConvexConfigured && sessionId ? { sessionId } : "skip",
  ) as BuilderTeam | null | undefined;

  const isLoading = isConvexConfigured && sessionId !== "" && team === undefined;
  const canSubmit =
    Boolean(team) &&
    team!.isLeader &&
    !team!.submitted &&
    team!.memberCount >= MIN_SUBMIT_MEMBERS;

  return {
    sessionId,
    team: team ?? null,
    isLoading,
    canSubmit,
    minSubmitMembers: MIN_SUBMIT_MEMBERS,
  };
}
