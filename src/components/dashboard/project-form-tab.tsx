import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useTranslation } from "../../context/language-context";

type Track = "ai_consumer" | "fintech_web3";

const inputBase =
  "w-full px-4 py-3 bg-bg border border-border text-fg font-display placeholder:text-fg-5 focus:outline-none focus:border-accent/60 transition-colors";

interface ProjectFormTabProps {
  teamId: Id<"teams"> | null;
  onDirtyChange?: (dirty: boolean) => void;
}

function getInitialValues(project: Doc<"projects"> | null) {
  if (project) {
    return {
      name: project.name,
      track: project.track,
      description: project.description,
      repoLink: project.repoLink ?? "",
      demoLink: project.demoLink ?? "",
      pitchSummary: project.pitchSummary,
      techStack: project.techStack,
      teamRoles: project.teamRoles,
    };
  }
  return {
    name: "",
    track: "ai_consumer" as Track,
    description: "",
    repoLink: "",
    demoLink: "",
    pitchSummary: "",
    techStack: "",
    teamRoles: "",
  };
}

function ProjectFormTabInner({
  project,
  teamId,
  onDirtyChange,
}: {
  project: Doc<"projects"> | null;
  teamId: Id<"teams">;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const { t } = useTranslation();
  const upsertProject = useMutation(api.projects.upsert);
  const initial = useMemo(() => getInitialValues(project), [project]);

  const [name, setName] = useState(initial.name);
  const [track, setTrack] = useState<Track>(initial.track);
  const [description, setDescription] = useState(initial.description);
  const [repoLink, setRepoLink] = useState(initial.repoLink);
  const [demoLink, setDemoLink] = useState(initial.demoLink);
  const [pitchSummary, setPitchSummary] = useState(initial.pitchSummary);
  const [techStack, setTechStack] = useState(initial.techStack);
  const [teamRoles, setTeamRoles] = useState(initial.teamRoles);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const isDirty = useMemo(() => {
    const saved = project
      ? {
          name: project.name,
          track: project.track,
          description: project.description,
          repoLink: project.repoLink ?? "",
          demoLink: project.demoLink ?? "",
          pitchSummary: project.pitchSummary,
          techStack: project.techStack,
          teamRoles: project.teamRoles,
        }
      : {
          name: "",
          track: "ai_consumer" as Track,
          description: "",
          repoLink: "",
          demoLink: "",
          pitchSummary: "",
          techStack: "",
          teamRoles: "",
        };
    return (
      name.trim() !== saved.name.trim() ||
      track !== saved.track ||
      description.trim() !== saved.description.trim() ||
      repoLink.trim() !== saved.repoLink.trim() ||
      demoLink.trim() !== saved.demoLink.trim() ||
      pitchSummary.trim() !== saved.pitchSummary.trim() ||
      techStack.trim() !== saved.techStack.trim() ||
      teamRoles.trim() !== saved.teamRoles.trim()
    );
  }, [
    project,
    name,
    track,
    description,
    repoLink,
    demoLink,
    pitchSummary,
    techStack,
    teamRoles,
  ]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!teamId) return;
    if (!name.trim() || !description.trim() || !pitchSummary.trim() || !techStack.trim() || !teamRoles.trim()) {
      setStatus("error");
      return;
    }

    setStatus("saving");
    try {
      await upsertProject({
        teamId,
        name: name.trim(),
        track,
        description: description.trim(),
        repoLink: repoLink.trim() || undefined,
        demoLink: demoLink.trim() || undefined,
        pitchSummary: pitchSummary.trim(),
        techStack: techStack.trim(),
        teamRoles: teamRoles.trim(),
      });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-mono text-[0.65rem] tracking-[0.15em] text-fg-3 uppercase mb-2">
          {t("dashboard.projectForm.name")} <span className="text-accent">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("dashboard.projectForm.namePlaceholder")}
          className={`text-[0.9rem] ${inputBase}`}
        />
      </div>

      <div>
        <label className="block font-mono text-[0.65rem] tracking-[0.15em] text-fg-3 uppercase mb-2">
          {t("dashboard.projectForm.track")} <span className="text-accent">*</span>
        </label>
        <select
          value={track}
          onChange={(e) => setTrack(e.target.value as Track)}
          className={`text-[0.9rem] ${inputBase} appearance-none cursor-pointer`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23787878' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 1rem center",
            paddingRight: "2.5rem",
          }}
        >
          <option value="ai_consumer">{t("dashboard.projectForm.trackAiConsumer")}</option>
          <option value="fintech_web3">{t("dashboard.projectForm.trackFintech")}</option>
        </select>
      </div>

      <div>
        <label className="block font-mono text-[0.65rem] tracking-[0.15em] text-fg-3 uppercase mb-2">
          {t("dashboard.projectForm.description")} <span className="text-accent">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("dashboard.projectForm.descriptionPlaceholder")}
          rows={3}
          className={`text-[0.9rem] resize-y min-h-[80px] ${inputBase}`}
        />
      </div>

      <div>
        <label className="block font-mono text-[0.65rem] tracking-[0.15em] text-fg-3 uppercase mb-2">
          {t("dashboard.projectForm.repoLink")}
        </label>
        <input
          type="url"
          value={repoLink}
          onChange={(e) => setRepoLink(e.target.value)}
          placeholder="https://github.com/..."
          className={`text-[0.9rem] ${inputBase}`}
        />
      </div>

      <div>
        <label className="block font-mono text-[0.65rem] tracking-[0.15em] text-fg-3 uppercase mb-2">
          {t("dashboard.projectForm.demoLink")}
        </label>
        <input
          type="url"
          value={demoLink}
          onChange={(e) => setDemoLink(e.target.value)}
          placeholder="https://..."
          className={`text-[0.9rem] ${inputBase}`}
        />
      </div>

      <div>
        <label className="block font-mono text-[0.65rem] tracking-[0.15em] text-fg-3 uppercase mb-2">
          {t("dashboard.projectForm.pitchSummary")} <span className="text-accent">*</span>
        </label>
        <textarea
          value={pitchSummary}
          onChange={(e) => setPitchSummary(e.target.value)}
          placeholder={t("dashboard.projectForm.pitchPlaceholder")}
          rows={3}
          className={`text-[0.9rem] resize-y min-h-[80px] ${inputBase}`}
        />
      </div>

      <div>
        <label className="block font-mono text-[0.65rem] tracking-[0.15em] text-fg-3 uppercase mb-2">
          {t("dashboard.projectForm.techStack")} <span className="text-accent">*</span>
        </label>
        <input
          type="text"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          placeholder={t("dashboard.projectForm.techPlaceholder")}
          className={`text-[0.9rem] ${inputBase}`}
        />
      </div>

      <div>
        <label className="block font-mono text-[0.65rem] tracking-[0.15em] text-fg-3 uppercase mb-2">
          {t("dashboard.projectForm.teamRoles")} <span className="text-accent">*</span>
        </label>
        <textarea
          value={teamRoles}
          onChange={(e) => setTeamRoles(e.target.value)}
          placeholder={t("dashboard.projectForm.rolesPlaceholder")}
          rows={2}
          className={`text-[0.9rem] resize-y min-h-[60px] ${inputBase}`}
        />
      </div>

      <div className="h-rule pt-2" />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "saving"}
          className="btn-phosphor text-sm px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "saving" ? "..." : t("dashboard.projectForm.submit")}
        </button>
        {status === "saved" && (
          <span className="font-mono text-[0.7rem] text-accent uppercase tracking-wider">
            Saved
          </span>
        )}
        {status === "error" && (
          <span className="font-mono text-[0.7rem] text-accent uppercase tracking-wider">
            Required
          </span>
        )}
      </div>
    </form>
  );
}

export function ProjectFormTab({ teamId, onDirtyChange }: ProjectFormTabProps) {
  const { t } = useTranslation();
  const project = useQuery(api.projects.getByCurrentUser);

  if (!teamId) {
    return (
      <p className="font-display text-[0.9rem] text-fg-3">
        {t("dashboard.projectForm.noTeam")}
      </p>
    );
  }

  if (project === undefined) {
    return (
      <p className="font-display text-[0.9rem] text-fg-3">
        {t("dashboard.projectForm.loading")}
      </p>
    );
  }

  return (
    <ProjectFormTabInner
      key={project ? project._id : "new"}
      project={project}
      teamId={teamId}
      onDirtyChange={onDirtyChange}
    />
  );
}
