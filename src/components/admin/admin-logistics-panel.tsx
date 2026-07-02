import { Fragment, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { HUB_CHECKPOINTS } from "../../data/hub-progress-steps";
import { HubButton, HubCard, HubField, HubInput, HubTextarea } from "../hub/hub-ui-primitives";

const CHECKPOINT_LABELS = Object.fromEntries(
  HUB_CHECKPOINTS.map((cp) => [cp.id, cp.label]),
) as Record<string, string>;

const STATUS_COLORS: Record<string, string> = {
  ok: "text-accent",
  review: "text-amber-600 dark:text-amber-300",
  violation: "text-red-600 dark:text-red-300",
  unknown: "text-fg-4",
};

export function AdminLogisticsPanel() {
  const teams = useQuery(api.hub.adminLogistics.listTeamsOverview, {});
  const repoCompliance = useQuery(api.hub.adminLogistics.listTeamsRepoCompliance, {});
  const reservations = useQuery(api.hub.booths.listAllReservations, {});
  const roles = useQuery(api.hub.adminLogistics.listRoleAssignments, {});
  const mentors = useQuery(api.hub.mentors.listMentors, {});
  const configureBooths = useMutation(api.hub.booths.configureBooths);
  const postAnnouncement = useMutation(api.hub.adminLogistics.postAnnouncement);
  const upsertRole = useMutation(api.hub.adminLogistics.upsertRoleAssignment);
  const removeRole = useMutation(api.hub.adminLogistics.removeRoleAssignment);
  const upsertMentor = useMutation(api.hub.mentors.upsertMentor);

  const [expandedTeamId, setExpandedTeamId] = useState<Id<"hub_teams"> | null>(null);
  const snapshots = useQuery(
    api.hub.adminLogistics.getTeamRepoSnapshots,
    expandedTeamId ? { hubTeamId: expandedTeamId } : "skip",
  );

  const [boothJson, setBoothJson] = useState(
    '[{"name":"Booth A","location":"Main floor","sortOrder":0},{"name":"Booth B","location":"Side hall","sortOrder":1}]',
  );
  const [slotStarts, setSlotStarts] = useState("1740000000000,1740001800000,1740003600000");
  const [announcement, setAnnouncement] = useState("");
  const [roleEmail, setRoleEmail] = useState("");
  const [role, setRole] = useState<"logistics" | "mentor" | "jury">("logistics");
  const [mentorName, setMentorName] = useState("");
  const [mentorRole, setMentorRole] = useState("");
  const [mentorBookingUrl, setMentorBookingUrl] = useState("");

  return (
    <div className="space-y-6">
      <HubCard title="GitHub repo compliance">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-faint text-fg-3">
                <th className="py-2 pr-4">Team</th>
                <th className="py-2 pr-4">Repo</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Pre / Event</th>
                <th className="py-2 pr-4">Contributors</th>
                <th className="py-2 pr-4">Last sync</th>
                <th className="py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {(repoCompliance ?? []).map((team) => (
                <Fragment key={team._id}>
                  <tr className="border-b border-border-faint/60">
                    <td className="py-2 pr-4">{team.name}</td>
                    <td className="py-2 pr-4">
                      {team.repoUrl ? (
                        <a
                          href={team.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent hover:underline"
                        >
                          Link
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className={`py-2 pr-4 capitalize ${STATUS_COLORS[team.complianceStatus] ?? ""}`}>
                      {team.complianceStatus}
                      {team.complianceFlags.length > 0 ? (
                        <span className="ml-1 text-xs text-fg-4">({team.complianceFlags.length})</span>
                      ) : null}
                    </td>
                    <td className="py-2 pr-4">
                      {team.snapshot
                        ? `${team.snapshot.commitCountBeforeEvent} / ${team.snapshot.commitCountInEventWindow}`
                        : "—"}
                    </td>
                    <td className="py-2 pr-4">
                      {team.snapshot?.contributors.length
                        ? team.snapshot.contributors.join(", ")
                        : "—"}
                    </td>
                    <td className="py-2 pr-4">
                      {team.lastSyncAt
                        ? new Date(team.lastSyncAt).toLocaleTimeString()
                        : "—"}
                      {team.lastSyncStatus === "error" ? (
                        <span className="ml-1 text-red-600" title={team.lastSyncError ?? undefined}>
                          err
                        </span>
                      ) : null}
                    </td>
                    <td className="py-2">
                      <HubButton
                        variant="ghost"
                        onClick={() =>
                          setExpandedTeamId((current) => (current === team._id ? null : team._id))
                        }
                      >
                        {expandedTeamId === team._id ? "Hide" : "View"}
                      </HubButton>
                    </td>
                  </tr>
                  {expandedTeamId === team._id && snapshots ? (
                    <tr>
                      <td colSpan={7} className="border-b border-border-faint/60 bg-bg-raised/30 px-4 py-4">
                        <div className="space-y-4 text-sm">
                          {snapshots.team.complianceFlags.length > 0 ? (
                            <div>
                              <p className="mb-1 font-medium text-fg-3">Flags</p>
                              <ul className="list-inside list-disc text-fg-4">
                                {snapshots.team.complianceFlags.map((flag) => (
                                  <li key={flag}>{flag}</li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                          {snapshots.snapshots[0]?.checkpointSummaries.some((cp) => cp.commitCount > 0) ? (
                            <div>
                              <p className="mb-2 font-medium text-fg-3">Checkpoint activity</p>
                              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {snapshots.snapshots[0]!.checkpointSummaries.map((cp) => (
                                  <div
                                    key={cp.checkpointId}
                                    className="rounded-sm border border-border-faint px-3 py-2"
                                  >
                                    <p className="font-medium">
                                      {CHECKPOINT_LABELS[cp.checkpointId] ?? cp.checkpointId} · {cp.commitCount}
                                    </p>
                                    {cp.contributors.length > 0 ? (
                                      <p className="mt-1 text-xs text-fg-4">{cp.contributors.join(", ")}</p>
                                    ) : null}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}
                          {snapshots.snapshots[0]?.recentCommits.length ? (
                            <div>
                              <p className="mb-2 font-medium text-fg-3">Recent commits</p>
                              <ul className="space-y-1 text-xs text-fg-4">
                                {snapshots.snapshots[0]!.recentCommits.map((commit) => (
                                  <li key={commit.sha}>
                                    <span className="font-mono text-accent">{commit.sha}</span> {commit.message}{" "}
                                    <span className="text-fg-5">({commit.author})</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </HubCard>

      <HubCard title="Teams overview">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-faint text-fg-3">
                <th className="py-2 pr-4">Team</th>
                <th className="py-2 pr-4">Members</th>
                <th className="py-2 pr-4">Track</th>
                <th className="py-2 pr-4">Project</th>
                <th className="py-2 pr-4">Posts</th>
                <th className="py-2">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {(teams ?? []).map((team) => (
                <tr key={team._id} className="border-b border-border-faint/60">
                  <td className="py-2 pr-4">{team.name}</td>
                  <td className="py-2 pr-4">{team.memberCount}</td>
                  <td className="py-2 pr-4">{team.track ?? "—"}</td>
                  <td className="py-2 pr-4">{team.hasProject ? "Yes" : "No"}</td>
                  <td className="py-2 pr-4">{team.socialPostCount}</td>
                  <td className="py-2">{team.submitted ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </HubCard>

      <HubCard title="Configure booths">
        <HubField label="Booths JSON">
          <HubTextarea value={boothJson} onChange={(e) => setBoothJson(e.target.value)} />
        </HubField>
        <HubField label="Slot start timestamps (comma-separated ms)">
          <HubInput value={slotStarts} onChange={(e) => setSlotStarts(e.target.value)} />
        </HubField>
        <HubButton
          onClick={() =>
            configureBooths({
              booths: JSON.parse(boothJson) as Array<{ name: string; location: string; sortOrder: number }>,
              slotStartsAt: slotStarts.split(",").map((v) => Number(v.trim())).filter(Boolean),
              slotDurationMs: 30 * 60 * 1000,
              replaceExisting: true,
            })
          }
        >
          Save booth grid
        </HubButton>
      </HubCard>

      <HubCard title="Reservations">
        <ul className="space-y-2 text-sm">
          {(reservations ?? []).map((reservation) => (
            <li key={reservation._id} className="border border-border-faint px-3 py-2">
              {reservation.teamName} · {reservation.boothName} ·{" "}
              {new Date(reservation.startsAt).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      </HubCard>

      <HubCard title="Announcements">
        <HubField label="Message">
          <HubTextarea value={announcement} onChange={(e) => setAnnouncement(e.target.value)} />
        </HubField>
        <HubButton
          onClick={() =>
            postAnnouncement({ message: announcement, priority: "info", locale: "en" })
          }
        >
          Post announcement
        </HubButton>
      </HubCard>

      <HubCard title="Mentors">
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <HubInput value={mentorName} onChange={(e) => setMentorName(e.target.value)} placeholder="Name" />
          <HubInput value={mentorRole} onChange={(e) => setMentorRole(e.target.value)} placeholder="Role" />
          <HubInput
            value={mentorBookingUrl}
            onChange={(e) => setMentorBookingUrl(e.target.value)}
            placeholder="Booking URL"
          />
        </div>
        <HubButton
          onClick={() =>
            upsertMentor({
              name: mentorName,
              role: mentorRole,
              remote: true,
              bookingUrl: mentorBookingUrl,
              active: true,
              sortOrder: mentors?.length ?? 0,
            })
          }
        >
          Add mentor
        </HubButton>
        <ul className="mt-4 space-y-2 text-sm">
          {(mentors ?? []).map((mentor) => (
            <li key={mentor._id} className="border border-border-faint px-3 py-2">
              {mentor.name} · {mentor.role}
              {mentor.bookingUrl ? ` · ${mentor.bookingUrl}` : ""}
            </li>
          ))}
        </ul>
      </HubCard>

      <HubCard title="Role assignments">
        <div className="mb-4 flex flex-wrap gap-3">
          <HubInput value={roleEmail} onChange={(e) => setRoleEmail(e.target.value)} placeholder="email@company.com" />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as typeof role)}
            className="border border-border-faint bg-bg px-3 py-2 text-sm"
          >
            <option value="logistics">Logistics</option>
            <option value="mentor">Mentor</option>
            <option value="jury">Jury</option>
          </select>
          <HubButton onClick={() => upsertRole({ email: roleEmail, role })}>Add / update</HubButton>
        </div>
        <ul className="space-y-2 text-sm">
          {(roles ?? []).map((assignment) => (
            <li key={assignment._id} className="flex items-center justify-between border border-border-faint px-3 py-2">
              <span>
                {assignment.email} · {assignment.role}
              </span>
              <HubButton variant="ghost" onClick={() => removeRole({ assignmentId: assignment._id })}>
                Remove
              </HubButton>
            </li>
          ))}
        </ul>
      </HubCard>
    </div>
  );
}