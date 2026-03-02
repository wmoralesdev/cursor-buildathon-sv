import { useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useTranslation } from "../context/language-context";
import { PitchTimer } from "../components/pitch-timer";

type Track = "ai_consumer" | "fintech_web3";
type SaveStatus = "idle" | "saving" | "saved" | "error";

const CRITERION_WEIGHTS = [0.25, 0.2, 0.25, 0.2, 0.1] as const;

function computeWeightedTotal(scores: number[]): number {
  return Math.round(
    scores.reduce((sum, s, i) => sum + s * CRITERION_WEIGHTS[i], 0) * 20
  );
}

type Criteria = {
  nameKey: string;
  questionKey: string;
  anchor1Key: string;
  anchor3Key: string;
  anchor5Key: string;
};

const CRITERIA_BY_TRACK: Record<Track, Criteria[]> = {
  ai_consumer: [
    { nameKey: "admin.ac.c1.name", questionKey: "admin.ac.c1.question", anchor1Key: "admin.ac.c1.anchor1", anchor3Key: "admin.ac.c1.anchor3", anchor5Key: "admin.ac.c1.anchor5" },
    { nameKey: "admin.ac.c2.name", questionKey: "admin.ac.c2.question", anchor1Key: "admin.ac.c2.anchor1", anchor3Key: "admin.ac.c2.anchor3", anchor5Key: "admin.ac.c2.anchor5" },
    { nameKey: "admin.ac.c3.name", questionKey: "admin.ac.c3.question", anchor1Key: "admin.ac.c3.anchor1", anchor3Key: "admin.ac.c3.anchor3", anchor5Key: "admin.ac.c3.anchor5" },
    { nameKey: "admin.ac.c4.name", questionKey: "admin.ac.c4.question", anchor1Key: "admin.ac.c4.anchor1", anchor3Key: "admin.ac.c4.anchor3", anchor5Key: "admin.ac.c4.anchor5" },
    { nameKey: "admin.ac.c5.name", questionKey: "admin.ac.c5.question", anchor1Key: "admin.ac.c5.anchor1", anchor3Key: "admin.ac.c5.anchor3", anchor5Key: "admin.ac.c5.anchor5" },
  ],
  fintech_web3: [
    { nameKey: "admin.fw.c1.name", questionKey: "admin.fw.c1.question", anchor1Key: "admin.fw.c1.anchor1", anchor3Key: "admin.fw.c1.anchor3", anchor5Key: "admin.fw.c1.anchor5" },
    { nameKey: "admin.fw.c2.name", questionKey: "admin.fw.c2.question", anchor1Key: "admin.fw.c2.anchor1", anchor3Key: "admin.fw.c2.anchor3", anchor5Key: "admin.fw.c2.anchor5" },
    { nameKey: "admin.fw.c3.name", questionKey: "admin.fw.c3.question", anchor1Key: "admin.fw.c3.anchor1", anchor3Key: "admin.fw.c3.anchor3", anchor5Key: "admin.fw.c3.anchor5" },
    { nameKey: "admin.fw.c4.name", questionKey: "admin.fw.c4.question", anchor1Key: "admin.fw.c4.anchor1", anchor3Key: "admin.fw.c4.anchor3", anchor5Key: "admin.fw.c4.anchor5" },
    { nameKey: "admin.fw.c5.name", questionKey: "admin.fw.c5.question", anchor1Key: "admin.fw.c5.anchor1", anchor3Key: "admin.fw.c5.anchor3", anchor5Key: "admin.fw.c5.anchor5" },
  ],
};

const SCORE_ANCHOR_COLORS: Record<number, string> = {
  1: "text-fg-4",
  3: "text-fg-2",
  5: "text-accent",
};

function ScoreButton({
  value,
  selected,
  onClick,
}: {
  value: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`Score ${value}`}
      className={`
        flex-1 h-12 font-display font-bold text-base transition-all duration-150
        border focus:outline-none focus:ring-1 focus:ring-accent/40
        ${selected
          ? "bg-accent text-[#080808] border-accent"
          : "bg-bg border-border text-fg-4 hover:border-fg-5 hover:text-fg-2"
        }
      `}
    >
      {value}
    </button>
  );
}

function CriterionRow({
  index,
  criterion,
  value,
  onChange,
}: {
  index: number;
  criterion: Criteria;
  value: number;
  onChange: (v: number) => void;
}) {
  const { t } = useTranslation();
  const anchorKey =
    value === 1 ? criterion.anchor1Key : value === 3 ? criterion.anchor3Key : value === 5 ? criterion.anchor5Key : null;
  const color = SCORE_ANCHOR_COLORS[value as 1 | 3 | 5];

  return (
    <div className="border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="font-mono text-[0.55rem] tracking-[0.15em] text-fg-5 uppercase mb-0.5">
            {String(index + 1).padStart(2, "0")}
          </div>
          <p className="font-display font-semibold text-[0.85rem] text-fg uppercase tracking-[0.02em]">
            {t(criterion.nameKey as Parameters<typeof t>[0])}
          </p>
          <p className="font-display text-[0.75rem] text-fg-3 mt-0.5">
            {t(criterion.questionKey as Parameters<typeof t>[0])}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <span className="font-display font-bold text-[1.6rem] leading-none text-fg">{value}</span>
          <span className="font-mono text-[0.5rem] block text-fg-5">/5</span>
        </div>
      </div>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((v) => (
          <ScoreButton key={v} value={v} selected={value === v} onClick={() => onChange(v)} />
        ))}
      </div>

      {anchorKey && color && (
        <p className={`font-mono text-[0.58rem] tracking-widest mt-2 ${color}`}>
          {t(anchorKey as Parameters<typeof t>[0])}
        </p>
      )}
    </div>
  );
}

function TrackBadge({ track }: { track: Track }) {
  const { t } = useTranslation();
  return (
    <span
      className={`font-mono text-[0.55rem] tracking-[0.15em] uppercase px-2 py-0.5 border ${
        track === "ai_consumer"
          ? "border-accent/40 text-accent"
          : "border-fg-6 text-fg-4"
      }`}
    >
      {t(
        track === "ai_consumer"
          ? "admin.track.ai_consumer"
          : "admin.track.fintech_web3"
      )}
    </span>
  );
}

type AdminProject = NonNullable<
  ReturnType<typeof useQuery<typeof api.admin.listProjectsForAdmin>>
>[number];

function ProjectCard({
  project,
  isEvaluated,
  onSelect,
}: {
  project: AdminProject;
  isEvaluated: boolean;
  onSelect: () => void;
}) {
  const { t } = useTranslation();
  const teamName = project.team?.name ?? "—";
  const leaderIdx = project.team?.leaderIndex ?? 0;
  const members = project.team?.members ?? [];

  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full text-left border border-border bg-surface p-4 transition-all duration-200 hover:border-fg-6 active:scale-[0.99] group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <TrackBadge track={project.track} />
        <span
          className={`font-mono text-[0.55rem] tracking-[0.15em] uppercase px-2 py-0.5 border ${
            isEvaluated
              ? "border-accent/40 text-accent"
              : "border-border text-fg-5"
          }`}
        >
          {isEvaluated ? t("admin.evaluated") : t("admin.pending")}
        </span>
      </div>

      <h3 className="font-display font-bold text-[0.95rem] text-fg uppercase tracking-[0.01em] mt-2 mb-1 group-hover:text-accent transition-colors">
        {project.name}
      </h3>

      <div className="flex items-center gap-1.5 mt-1">
        <span className="font-mono text-[0.6rem] tracking-widest text-fg-4 uppercase">
          {teamName}
        </span>
        {members[leaderIdx] && (
          <>
            <span className="text-fg-6">·</span>
            <span className="font-mono text-[0.6rem] tracking-widest text-fg-5">
              {members[leaderIdx].name}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <span className="font-mono text-[0.58rem] tracking-widest text-fg-5">
          {members.length} {t("admin.members").toLowerCase()}
        </span>
        <span className="font-mono text-[0.58rem] tracking-widest text-accent opacity-0 group-hover:opacity-100 transition-opacity">
          tap to evaluate →
        </span>
      </div>
    </button>
  );
}

type ExistingScore = {
  criterion1: number;
  criterion2: number;
  criterion3: number;
  criterion4: number;
  criterion5?: number;
};

function ProjectDetail({
  project,
  existingScore,
  onBack,
  onSaved,
  onNextPending,
  hasNextPending,
}: {
  project: AdminProject;
  existingScore: ExistingScore | null;
  onBack: () => void;
  onSaved: () => void;
  onNextPending: () => void;
  hasNextPending: boolean;
}) {
  const { t } = useTranslation();
  const submit = useMutation(api.admin.submitScore);

  const [scores, setScores] = useState(() => [
    existingScore?.criterion1 ?? 3,
    existingScore?.criterion2 ?? 3,
    existingScore?.criterion3 ?? 3,
    existingScore?.criterion4 ?? 3,
    existingScore?.criterion5 ?? 3,
  ]);
  const [status, setStatus] = useState<SaveStatus>("idle");

  const setScore = useCallback((idx: number, val: number) => {
    setScores((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
    if (status === "saved") setStatus("idle");
  }, [status]);

  async function handleSubmit() {
    setStatus("saving");
    try {
      await submit({
        projectId: project._id,
        criterion1: scores[0],
        criterion2: scores[1],
        criterion3: scores[2],
        criterion4: scores[3],
        criterion5: scores[4],
      });
      setStatus("saved");
      setTimeout(() => onSaved(), 800);
    } catch {
      setStatus("error");
    }
  }

  const criteria = CRITERIA_BY_TRACK[project.track];
  const totalScore = computeWeightedTotal(scores);
  const teamName = project.team?.name ?? "—";
  const members = project.team?.members ?? [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 bg-bg border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBack}
              className="font-mono text-[0.62rem] tracking-[0.15em] text-fg-3 hover:text-fg uppercase flex items-center gap-1.5 transition-colors"
            >
              <span className="text-accent">←</span>
              {t("admin.back")}
            </button>

            <div className="flex items-center gap-2">
              <span className="font-display text-[0.75rem] text-fg-5">
                {t("admin.criteria.hint1")}&nbsp;·&nbsp;
                {t("admin.criteria.hint3")}&nbsp;·&nbsp;
                {t("admin.criteria.hint5")}
              </span>
            </div>
          </div>
          <PitchTimer />
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full px-4 pt-5 pb-32 space-y-4">
        {/* Project header */}
        <div className="border border-border bg-surface p-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <TrackBadge track={project.track} />
            <div className="text-right">
              <span className="font-display font-bold text-[1.4rem] leading-none text-accent">
                {totalScore}
              </span>
              <span className="font-mono text-[0.5rem] block text-fg-5">/100</span>
            </div>
          </div>

          <h2 className="font-display font-bold text-[1.15rem] text-fg uppercase tracking-[-0.01em] leading-tight mb-2">
            {project.name}
          </h2>

          <div className="space-y-1">
            <div className="flex gap-2 items-baseline">
              <span className="font-mono text-[0.55rem] tracking-[0.12em] text-fg-5 uppercase w-14 shrink-0">
                {t("admin.team")}
              </span>
              <span className="font-display text-[0.8rem] text-fg-2">{teamName}</span>
            </div>
            <div className="flex gap-2 items-baseline">
              <span className="font-mono text-[0.55rem] tracking-[0.12em] text-fg-5 uppercase w-14 shrink-0">
                {t("admin.members")}
              </span>
              <span className="font-display text-[0.75rem] text-fg-3">
                {members.map((m) => m.name).join(", ")}
              </span>
            </div>
          </div>
        </div>

        {/* Project info */}
        {[
          { key: "admin.description", value: project.description },
          { key: "admin.pitchSummary", value: project.pitchSummary },
          { key: "admin.techStack", value: project.techStack },
          { key: "admin.teamRoles", value: project.teamRoles },
        ].map(({ key, value }) => (
          <div key={key} className="border border-border-dim p-3">
            <p className="font-mono text-[0.55rem] tracking-[0.15em] text-fg-5 uppercase mb-1.5">
              {t(key as Parameters<typeof t>[0])}
            </p>
            <p className="font-display text-[0.8rem] text-fg-2 leading-[1.65]">{value}</p>
          </div>
        ))}

        {(project.repoLink || project.demoLink) && (
          <div className="flex gap-2 flex-wrap">
            {project.repoLink && (
              <a
                href={project.repoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[0.6rem] tracking-[0.12em] text-accent hover:text-accent-dim uppercase border border-accent/30 px-3 py-1.5 transition-colors"
              >
                {t("admin.repo")} ↗
              </a>
            )}
            {project.demoLink && (
              <a
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[0.6rem] tracking-[0.12em] text-fg-3 hover:text-fg uppercase border border-border px-3 py-1.5 transition-colors"
              >
                {t("admin.demo")} ↗
              </a>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="h-rule" />

        {/* Scoring section */}
        <div>
          <p className="font-mono text-[0.62rem] tracking-[0.15em] text-fg-4 uppercase mb-3">
            {t("admin.criteria.label")}
          </p>
          <div className="space-y-3">
            {criteria.map((c, i) => (
              <CriterionRow
                key={i}
                index={i}
                criterion={c}
                value={scores[i]}
                onChange={(v) => setScore(i, v)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sticky bottom save bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-bg px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2">
            <span className="font-display text-[0.78rem] text-fg-4">
              {t("admin.criteria.hint1")} · {t("admin.criteria.hint3")} · {t("admin.criteria.hint5")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {status === "saved" && (
              <span className="font-mono text-[0.65rem] tracking-wider text-accent uppercase">
                {t("admin.saved")}
              </span>
            )}
            {status === "error" && (
              <span className="font-mono text-[0.65rem] tracking-wider text-red-400 uppercase">
                {t("admin.scoreError")}
              </span>
            )}
            {hasNextPending && (
              <button
                type="button"
                onClick={onNextPending}
                className="font-mono text-[0.65rem] tracking-wider uppercase border border-border px-3 py-2 text-fg-3 hover:text-fg hover:border-fg-5 transition-colors"
              >
                {t("admin.nextPending")}
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={status === "saving"}
              className="btn-phosphor text-sm px-6 py-3 disabled:opacity-50"
            >
              {status === "saving" ? t("admin.saving") : existingScore ? t("admin.editScore") : t("admin.saveScore")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type TrackFilter = "all" | "ai_consumer" | "fintech_web3";

function RankingsView({ isAdmin }: { isAdmin: boolean }) {
  const { t } = useTranslation();
  const [trackFilter, setTrackFilter] = useState<TrackFilter>("all");
  const rankings = useQuery(api.admin.getRankings, isAdmin ? {} : "skip");

  if (rankings === undefined) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-8 text-center font-mono text-[0.65rem] text-fg-5 uppercase">
        {t("admin.loading")}
      </div>
    );
  }

  const filtered =
    trackFilter === "all"
      ? rankings
      : rankings.filter((r) => r.project.track === trackFilter);
  const ranked = filtered.filter((r) => r.jurorCount > 0);
  const unranked = filtered.filter((r) => r.jurorCount === 0);

  if (rankings.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-8 text-center font-mono text-[0.65rem] text-fg-5 uppercase">
        {t("admin.noProjects")}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-5 pb-16 space-y-2">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <p className="font-mono text-[0.62rem] tracking-[0.15em] text-fg-5 uppercase">
          {t("admin.rankings.title")}
        </p>
        <div className="flex gap-1 border border-border">
          {(["all", "ai_consumer", "fintech_web3"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setTrackFilter(f)}
              className={`px-3 py-1.5 font-mono text-[0.6rem] tracking-wider uppercase transition-colors ${
                trackFilter === f
                  ? "bg-accent text-[#080808]"
                  : "text-fg-4 hover:text-fg hover:bg-surface"
              }`}
            >
              {f === "all"
                ? t("admin.rankings.allTracks")
                : t(f === "ai_consumer" ? "admin.track.ai_consumer" : "admin.track.fintech_web3")}
            </button>
          ))}
        </div>
      </div>

      {ranked.length === 0 && (
        <p className="font-mono text-[0.62rem] text-fg-5 uppercase text-center py-6">
          {t("admin.rankings.noScores")}
        </p>
      )}

      {ranked.map((item, idx) => (
        <div
          key={item.project._id}
          className={`border p-4 flex items-center gap-4 ${
            idx === 0 ? "border-accent/50 bg-accent/3" : "border-border bg-surface"
          }`}
        >
          <div className="shrink-0 w-8 text-center">
            <span
              className={`font-display font-bold text-[1.1rem] leading-none ${
                idx === 0 ? "text-accent" : idx === 1 ? "text-fg-2" : "text-fg-5"
              }`}
            >
              #{idx + 1}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-[0.85rem] text-fg uppercase tracking-[0.01em] truncate">
              {item.project.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <TrackBadge track={item.project.track} />
              <span className="font-mono text-[0.55rem] text-fg-5">
                {item.team?.name ?? "—"}
              </span>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <span
              className={`font-display font-bold text-[1.4rem] leading-none ${
                idx === 0 ? "text-accent" : "text-fg"
              }`}
            >
              {item.averageTotal.toFixed(1)}
            </span>
            <span className="font-mono text-[0.5rem] block text-fg-5">
              {item.jurorCount} {t("admin.rankings.jurors")}
            </span>
          </div>
        </div>
      ))}

      {unranked.length > 0 && (
        <>
          <div className="h-rule mt-4 mb-3" />
          <p className="font-mono text-[0.55rem] tracking-[0.15em] text-fg-6 uppercase">
            {t("admin.pending")} ({unranked.length})
          </p>
          {unranked.map((item) => (
            <div key={item.project._id} className="border border-border-dim p-3 opacity-50">
              <p className="font-display text-[0.8rem] text-fg-3 uppercase truncate">
                {item.project.name}
              </p>
              <p className="font-mono text-[0.55rem] text-fg-5 mt-0.5">
                {item.team?.name ?? "—"}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export function AdminPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { t } = useTranslation();
  const admin = useQuery(api.admin.isAdmin);

  // Only subscribe to these queries once we know the user is an admin.
  // Passing "skip" prevents them from running (and throwing) before auth resolves.
  const isAdminConfirmed = !!admin;
  const projects = useQuery(api.admin.listProjectsForAdmin, isAdminConfirmed ? {} : "skip");
  const myScores = useQuery(api.admin.getScoresByCurrentUser, isAdminConfirmed ? {} : "skip");

  const [activeTab, setActiveTab] = useState<"projects" | "rankings">("projects");
  const [selectedId, setSelectedId] = useState<Id<"projects"> | null>(null);

  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/login" replace />;

  // isAdmin resolves to null (not admin) or an object (admin) — never throws.
  // Show access denied as soon as we know, without waiting for skipped queries.
  if (admin === null) {
    return (
      <main className="relative min-h-screen bg-bg flex flex-col items-center justify-center section-padding">
        <div className="max-w-sm w-full border border-border bg-surface px-7 py-8 text-center">
          <span className="tag mb-5 inline-block">// acceso</span>
          <h1 className="font-display font-bold text-[1.8rem] uppercase text-fg leading-none mb-3">
            {t("admin.accessDenied")}
          </h1>
          <p className="font-display text-[0.8rem] text-fg-3">
            {t("admin.accessDeniedDesc")}
          </p>
        </div>
      </main>
    );
  }

  if (admin === undefined || projects === undefined || myScores === undefined) {
    return (
      <main className="relative min-h-screen bg-bg flex items-center justify-center">
        <span className="font-mono text-[0.65rem] tracking-[0.15em] text-fg-5 uppercase animate-pulse">
          {t("admin.loading")}
        </span>
      </main>
    );
  }

  const evaluatedIds = new Set(myScores.map((s) => s.projectId));
  const evaluatedCount = (projects ?? []).filter((p) => evaluatedIds.has(p._id)).length;
  const totalCount = projects?.length ?? 0;

  const selectedProject = selectedId
    ? (projects ?? []).find((p) => p._id === selectedId) ?? null
    : null;
  const existingScore = selectedId
    ? myScores.find((s) => s.projectId === selectedId) ?? null
    : null;

  return (
    <main className="relative min-h-screen bg-bg">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg border-b border-border">
        <div className="max-w-2xl mx-auto px-4 pt-5 pb-3 flex items-center justify-between">
          <div>
            <span className="tag inline-block mb-1">// jurado</span>
            <h1 className="font-display font-bold text-[1.3rem] uppercase text-fg tracking-[-0.02em] leading-none">
              {t("admin.title")}
            </h1>
          </div>
          <div className="text-right">
            <span className="font-display font-bold text-[1.6rem] leading-none text-accent">
              {evaluatedCount}
            </span>
            <span className="font-display text-[0.75rem] text-fg-5 block">
              {t("admin.of")} {totalCount} {t("admin.progress")}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-border">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: totalCount > 0 ? `${(evaluatedCount / totalCount) * 100}%` : "0%" }}
          />
        </div>

        {!selectedProject && (
          <div className="max-w-2xl mx-auto flex border-b border-border px-4 mt-1">
            {(["projects", "rankings"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 font-mono text-[0.65rem] tracking-wider uppercase transition-colors ${
                  activeTab === tab
                    ? "text-accent border-b-2 border-accent -mb-px"
                    : "text-fg-4 hover:text-fg"
                }`}
              >
                {t(tab === "projects" ? "admin.tabs.projects" : "admin.tabs.rankings")}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      {selectedProject ? (
        <ProjectDetail
          key={selectedId}
          project={selectedProject}
          existingScore={existingScore}
          onBack={() => setSelectedId(null)}
          onSaved={() => {
            const next = (projects ?? []).find(
              (p) => p._id !== selectedId && !evaluatedIds.has(p._id)
            );
            setSelectedId(next?._id ?? null);
          }}
          onNextPending={() => {
            const next = (projects ?? []).find(
              (p) => p._id !== selectedId && !evaluatedIds.has(p._id)
            );
            setSelectedId(next?._id ?? null);
          }}
          hasNextPending={
            (projects ?? []).some(
              (p) => p._id !== selectedId && !evaluatedIds.has(p._id)
            )
          }
        />
      ) : activeTab === "projects" ? (
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-16 space-y-2">
          {projects.length === 0 ? (
            <p className="font-mono text-[0.62rem] text-fg-5 uppercase text-center py-8">
              {t("admin.noProjects")}
            </p>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                isEvaluated={evaluatedIds.has(project._id)}
                onSelect={() => setSelectedId(project._id)}
              />
            ))
          )}
        </div>
      ) : (
        <RankingsView isAdmin={isAdminConfirmed} />
      )}
    </main>
  );
}
