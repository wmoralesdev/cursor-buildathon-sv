import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Check, Copy } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useHubProfile } from "../../hooks/use-hub-profile";
import { useHubQueryReady } from "../../hooks/use-hub-query-ready";
import { useTranslation } from "../../context/language-context";
import { HubButton, HubCard, HubError, HubField, HubInput } from "./hub-ui-primitives";

export function HubTeamCard() {
  const { t } = useTranslation();
  const profile = useHubProfile();
  const hubReady = useHubQueryReady();
  const team = useQuery(api.hub.teams.getMyTeam, hubReady ? {} : "skip");
  const createTeam = useMutation(api.hub.teams.createTeam);
  const joinByCode = useMutation(api.hub.teams.joinByCode);
  const leaveTeam = useMutation(api.hub.teams.leaveTeam);

  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function copyInviteCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

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
      <div id="hub-team" className="scroll-mt-24">
      <HubCard title={t("hub.team.title")} tag={t("hub.team.tag")}>
        <div className="h-8 w-40 animate-pulse bg-border-faint" />
      </HubCard>
      </div>
    );
  }

  if (!team) {
    return (
      <div id="hub-team" className="scroll-mt-24">
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
              onClick={() => run(() => createTeam({ name: teamName.trim(), ...profile }))}
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
              onClick={() =>
                run(() => joinByCode({ inviteCode: inviteCode.trim(), ...profile }))
              }
            >
              {t("hub.team.joinCta")}
            </HubButton>
          </div>
        </div>
        <HubError message={error} />
      </HubCard>
      </div>
    );
  }

  return (
    <div id="hub-team">
    <HubCard title={team.name} tag={t("hub.team.tag")}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border border-accent/30 bg-bg-raised/40 p-4">
        <div>
          <p className="font-mono text-[0.675rem] uppercase tracking-[0.14em] text-fg-4">
            {t("hub.team.inviteCode")}
          </p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-[0.3em] text-fg">
            {team.inviteCode}
          </p>
          <p className="mt-2 max-w-[36ch] font-display text-[0.875rem] leading-[1.5] text-fg-3">
            {t("hub.team.shareHint")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void copyInviteCode(team.inviteCode)}
          className="inline-flex items-center gap-2 rounded-none border border-border-faint px-3 py-2 font-mono text-[0.675rem] uppercase tracking-[0.12em] text-fg-3 transition-colors hover:border-accent/50 hover:text-accent"
        >
          {copied ? (
            <Check className="size-3.5" strokeWidth={2} aria-hidden />
          ) : (
            <Copy className="size-3.5" strokeWidth={2} aria-hidden />
          )}
          {copied ? t("hub.team.copied") : t("hub.team.copy")}
        </button>
      </div>

      <p className="mb-5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-fg-3">
        {t("hub.team.members")}: {team.members.length}/5
      </p>

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
    </div>
  );
}
