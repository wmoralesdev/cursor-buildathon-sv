import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import type { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useTranslation } from "../../context/language-context";

const MIN_MEMBERS = 2;
const MAX_MEMBERS = 4;

type Member = { name: string; email: string };

const inputBase =
  "px-4 py-2.5 bg-bg border border-border text-fg font-display placeholder:text-fg-5 focus:outline-none focus:border-accent/60 transition-colors";

function getInitialValues(team: Doc<"teams"> | null) {
  if (team) {
    return {
      teamName: team.name,
      members:
        team.members.length >= MIN_MEMBERS
          ? team.members.map((m) => ({ name: m.name, email: m.email ?? "" }))
          : [
              { name: "", email: "" },
              { name: "", email: "" },
            ],
      leaderIndex:
        team.leaderIndex >= 0 && team.leaderIndex < team.members.length
          ? team.leaderIndex
          : 0,
    };
  }
  return {
    teamName: "",
    members: [
      { name: "", email: "" },
      { name: "", email: "" },
    ],
    leaderIndex: 0,
  };
}

function TeamFormTabInner({ team }: { team: Doc<"teams"> | null }) {
  const { t } = useTranslation();
  const upsertTeam = useMutation(api.teams.upsert);
  const initial = getInitialValues(team);

  const [teamName, setTeamName] = useState(initial.teamName);
  const [members, setMembers] = useState<Member[]>(initial.members);
  const [leaderIndex, setLeaderIndex] = useState(initial.leaderIndex);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function addMember() {
    if (members.length < MAX_MEMBERS) {
      setMembers([...members, { name: "", email: "" }]);
    }
  }

  function removeMember(index: number) {
    if (members.length > MIN_MEMBERS) {
      const next = members.filter((_, i) => i !== index);
      setMembers(next);
      setLeaderIndex((prev) =>
        prev >= next.length ? next.length - 1 : prev === index ? 0 : prev > index ? prev - 1 : prev
      );
    }
  }

  function updateMember(index: number, field: "name" | "email", value: string) {
    setMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = teamName.trim();
    if (!trimmedName) {
      setStatus("error");
      return;
    }

    const validMembers = members
      .map((m) => ({ name: m.name.trim(), email: m.email.trim() || undefined }))
      .filter((m) => m.name);

    if (validMembers.length < MIN_MEMBERS || validMembers.length > MAX_MEMBERS) {
      setStatus("error");
      return;
    }

    if (leaderIndex < 0 || leaderIndex >= validMembers.length) {
      setStatus("error");
      return;
    }

    setStatus("saving");
    try {
      await upsertTeam({
        name: trimmedName,
        members: validMembers,
        leaderIndex,
      });
      setStatus("saved");
      setMembers(
        validMembers.length >= MIN_MEMBERS
          ? validMembers.map((m) => ({ name: m.name, email: m.email ?? "" }))
          : [
              ...validMembers.map((m) => ({ name: m.name, email: m.email ?? "" })),
              ...Array(MIN_MEMBERS - validMembers.length)
                .fill(null)
                .map(() => ({ name: "", email: "" })),
            ]
      );
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="teamName"
          className="block font-mono text-[0.65rem] tracking-[0.15em] text-fg-3 uppercase mb-2"
        >
          {t("dashboard.teamForm.teamName")} <span className="text-accent">*</span>
        </label>
        <input
          id="teamName"
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder={t("dashboard.teamForm.teamNamePlaceholder")}
          required
          className={`w-full py-3 ${inputBase}`}
        />
      </div>

      <div className="h-rule" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="font-mono text-[0.65rem] tracking-[0.15em] text-fg-3 uppercase">
            {t("dashboard.teamForm.members")} <span className="text-accent">*</span>
          </label>
          {members.length < MAX_MEMBERS && (
            <button
              type="button"
              onClick={addMember}
              className="font-mono text-[0.6rem] tracking-wider text-accent hover:text-accent-dim uppercase transition-colors"
            >
              + Add member
            </button>
          )}
        </div>

        <div className="space-y-4">
          {members.map((member, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row gap-3 sm:grid sm:grid-cols-[1fr_1fr_auto]"
            >
              <input
                type="text"
                value={member.name}
                onChange={(e) => updateMember(index, "name", e.target.value)}
                placeholder={`${t("dashboard.teamForm.memberName")} ${index + 1}`}
                className={`text-[0.85rem] ${inputBase}`}
              />
              <input
                type="email"
                value={member.email}
                onChange={(e) => updateMember(index, "email", e.target.value)}
                placeholder={t("dashboard.teamForm.memberEmail")}
                className={`text-[0.85rem] ${inputBase}`}
              />
              <div className="flex justify-end sm:justify-start">
                {members.length > MIN_MEMBERS ? (
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    className="font-mono text-[0.6rem] text-fg-4 hover:text-accent uppercase transition-colors"
                  >
                    Remove
                  </button>
                ) : (
                  <span className="invisible" aria-hidden />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="leader"
          className="block font-mono text-[0.65rem] tracking-[0.15em] text-fg-3 uppercase mb-2"
        >
          {t("dashboard.teamForm.leader")} <span className="text-accent">*</span>
        </label>
        <select
          id="leader"
          value={leaderIndex}
          onChange={(e) => setLeaderIndex(Number(e.target.value))}
          className={`w-full py-3 text-[0.9rem] ${inputBase} appearance-none cursor-pointer`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23787878' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 1rem center",
            paddingRight: "2.5rem",
          }}
        >
          {members.map((m, i) => (
            <option key={i} value={i}>
              {m.name.trim() || `${t("dashboard.teamForm.memberName")} ${i + 1}`}
            </option>
          ))}
        </select>
      </div>

      <div className="h-rule pt-2" />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "saving"}
          className="btn-phosphor text-sm px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "saving" ? "..." : t("dashboard.teamForm.submit")}
        </button>
        {status === "saved" && (
          <span className="font-mono text-[0.7rem] text-accent uppercase tracking-wider">
            Saved
          </span>
        )}
        {status === "error" && (
          <span className="font-mono text-[0.7rem] text-accent uppercase tracking-wider">
            {t("dashboard.teamForm.required")}
          </span>
        )}
      </div>
    </form>
  );
}

export function TeamFormTab() {
  const { t } = useTranslation();
  const team = useQuery(api.teams.getByCurrentUser);

  if (team === undefined) {
    return (
      <p className="font-display text-[0.9rem] text-fg-3">
        {t("dashboard.teamForm.loading")}
      </p>
    );
  }

  return (
    <TeamFormTabInner key={team ? team._id : "new"} team={team} />
  );
}
