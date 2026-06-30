import { useState } from "react";
import { Crown, UserPlus } from "lucide-react";

import { BuilderTeamLeaderForm } from "./builder-team-leader-form";
import { BuilderTeamJoinForm } from "./builder-team-join-form";
import { useTranslation } from "../../context/language-context";

type Props = {
  sessionId: string;
};

type Mode = "choose" | "leader" | "member";

export function BuilderTeamOnboarding({ sessionId }: Props) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("choose");

  return (
    <div className="border border-border bg-surface p-6 sm:p-8">
      {mode === "choose" ? (
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-xl font-semibold tracking-tight text-fg sm:text-2xl">
              {t("builder.team.onboarding.title")}
            </h3>
            <p className="mt-2 max-w-[48ch] font-display text-[1.025rem] leading-[1.6] text-fg-3">
              {t("builder.team.onboarding.intro")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <RoleCard
              icon={<Crown className="size-5 text-accent" strokeWidth={1.75} aria-hidden />}
              title={t("builder.team.role.leader.title")}
              body={t("builder.team.role.leader.body")}
              onClick={() => setMode("leader")}
            />
            <RoleCard
              icon={<UserPlus className="size-5 text-accent" strokeWidth={1.75} aria-hidden />}
              title={t("builder.team.role.member.title")}
              body={t("builder.team.role.member.body")}
              onClick={() => setMode("member")}
            />
          </div>
        </div>
      ) : mode === "leader" ? (
        <BuilderTeamLeaderForm sessionId={sessionId} onBack={() => setMode("choose")} />
      ) : (
        <BuilderTeamJoinForm sessionId={sessionId} onBack={() => setMode("choose")} />
      )}
    </div>
  );
}

function RoleCard({
  icon,
  title,
  body,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-start gap-3 border border-border bg-bg-raised/40 p-5 text-left transition-colors hover:border-accent/50"
    >
      <span className="flex size-10 items-center justify-center border border-border-faint bg-bg-raised">
        {icon}
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-fg group-hover:text-accent">
        {title}
      </span>
      <span className="font-display text-[0.925rem] leading-[1.5] text-fg-3">{body}</span>
    </button>
  );
}
