import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useTranslation } from "../../context/language-context";
import { isConvexConfigured } from "../../lib/convex-client";
import { HubButton, HubCard, HubError, HubField, HubInput } from "./hub-ui-primitives";

export function HubTeamCard() {
  const { t } = useTranslation();
  const team = useQuery(api.hub.teams.getMyTeam, isConvexConfigured ? {} : "skip");
  const createTeam = useMutation(api.hub.teams.createTeam);
  const joinByCode = useMutation(api.hub.teams.joinByCode);
  const leaveTeam = useMutation(api.hub.teams.leaveTeam);

  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("hub.error.generic"));
    } finally {
      setBusy(false);
    }
  }

  if (team === undefined) {
    return (
      <HubCard title={t("hub.team.title")} tag={t("hub.team.tag")}>
        <div className="h-8 w-40 animate-pulse bg-border-faint" />
      </HubCard>
    );
  }

  if (!team) {
    return (
      <HubCard title={t("hub.team.title")} tag={t("hub.team.tag")}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <HubField label={t("hub.team.createName")}>
              <HubInput
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder={t("hub.team.createPlaceholder")}
              />
            </HubField>
            <HubButton
              disabled={busy || teamName.trim().length < 2}
              onClick={() => run(() => createTeam({ name: teamName.trim() }))}
            >
              {t("hub.team.createCta")}
            </HubButton>
          </div>
          <div>
            <HubField label={t("hub.team.joinCode")}>
              <HubInput
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
              />
            </HubField>
            <HubButton
              variant="ghost"
              disabled={busy || inviteCode.trim().length < 4}
              onClick={() => run(() => joinByCode({ inviteCode: inviteCode.trim() }))}
            >
              {t("hub.team.joinCta")}
            </HubButton>
          </div>
        </div>
        <HubError message={error} />
      </HubCard>
    );
  }

  return (
    <HubCard title={team.name} tag={t("hub.team.tag")}>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-fg-3">
          {t("hub.team.inviteCode")}: <strong className="text-accent">{team.inviteCode}</strong>
        </span>
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-fg-3">
          {t("hub.team.members")}: {team.members.length}/5
        </span>
      </div>

      <ul className="mb-6 space-y-2">
        {team.members.map((member) => (
          <li
            key={member.userId}
            className="flex items-center justify-between border border-border-faint px-3 py-2"
          >
            <span className="font-display text-[0.925rem] text-fg">
              {member.name}
              {member.isCaptain ? ` · ${t("hub.team.captain")}` : ""}
            </span>
            <span className="font-mono text-[0.65rem] text-fg-3">{member.email}</span>
          </li>
        ))}
      </ul>

      <HubButton variant="ghost" disabled={busy} onClick={() => run(() => leaveTeam({}))}>
        {t("hub.team.leave")}
      </HubButton>
      <HubError message={error} />
    </HubCard>
  );
}
