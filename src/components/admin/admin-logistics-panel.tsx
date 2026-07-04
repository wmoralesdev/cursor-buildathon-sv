import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { buildBoothSlotStarts, BOOTH_SLOT_DURATION_MS } from "../../lib/hub-booth-schedule";
import { HubButton, HubCard, HubField, HubInput, HubTextarea } from "../hub/hub-ui-primitives";
import { AdminCheckpointFeed } from "./admin-checkpoint-feed";

export function AdminLogisticsPanel() {
  const teams = useQuery(api.hub.adminLogistics.listTeamsOverview, {});
  const reservations = useQuery(api.hub.booths.listAllReservations, {});
  const roles = useQuery(api.hub.adminLogistics.listRoleAssignments, {});
  const mentors = useQuery(api.hub.mentors.listMentors, {});
  const perkInventory = useQuery(api.hub.perks.getInventoryStats, {});
  const eligibleEmails = useQuery(api.hub.perks.getEligibleEmailStats, {});
  const eventEligibleEmails = useQuery(api.hub.eventAccess.getEventEligibleEmailStats, {});
  const configureBooths = useMutation(api.hub.booths.configureBooths);
  const postAnnouncement = useMutation(api.hub.adminLogistics.postAnnouncement);
  const upsertRole = useMutation(api.hub.adminLogistics.upsertRoleAssignment);
  const removeRole = useMutation(api.hub.adminLogistics.removeRoleAssignment);
  const upsertMentor = useMutation(api.hub.mentors.upsertMentor);

  const [boothJson, setBoothJson] = useState(
    '[{"name":"Booth A","location":"Main floor","sortOrder":0},{"name":"Booth B","location":"Side hall","sortOrder":1}]',
  );
  const boothSlotCount = buildBoothSlotStarts().length;
  const [announcement, setAnnouncement] = useState("");
  const [roleEmail, setRoleEmail] = useState("");
  const [role, setRole] = useState<"logistics" | "mentor" | "jury">("logistics");
  const [mentorName, setMentorName] = useState("");
  const [mentorRole, setMentorRole] = useState("");
  const [mentorBookingUrl, setMentorBookingUrl] = useState("");

  return (
    <div className="space-y-6">
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

      <AdminCheckpointFeed />

      <HubCard title="Configure booths">
        <p className="mb-4 font-display text-[0.875rem] text-fg-2">
          Slots auto-generate every 30 minutes from event start (Jul 4, 8:00 AM) through Sunday
          6:00 AM — {boothSlotCount} slots per booth.
        </p>
        <HubField label="Booths JSON">
          <HubTextarea value={boothJson} onChange={(e) => setBoothJson(e.target.value)} />
        </HubField>
        <HubButton
          onClick={() =>
            configureBooths({
              booths: JSON.parse(boothJson) as Array<{ name: string; location: string; sortOrder: number }>,
              slotDurationMs: BOOTH_SLOT_DURATION_MS,
              replaceExisting: true,
            })
          }
        >
          Save booth grid
        </HubButton>
      </HubCard>

      <HubCard title="Event registration allowlist">
        <p className="mb-4 font-display text-[0.875rem] text-fg-2">
          Only emails on this list can sign in to the builder hub (all Luma registrants). Seed from{" "}
          <code className="font-mono text-[0.8rem]">seed/luma.csv</code> with{" "}
          <code className="font-mono text-[0.8rem]">pnpm seed:luma</code> (dev) or{" "}
          <code className="font-mono text-[0.8rem]">pnpm seed:luma:prod</code> (production).
        </p>
        <p className="mb-4 font-display text-[0.925rem] text-fg">
          {(eventEligibleEmails?.total ?? 0).toLocaleString()} registered emails
        </p>
        {(eventEligibleEmails?.batches ?? []).length > 0 ? (
          <ul className="space-y-1 text-sm text-fg-3">
            {eventEligibleEmails!.batches.map((batch) => (
              <li key={batch.batchId}>
                {batch.batchId}: {batch.count}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-fg-3">No registration allowlist seeded yet.</p>
        )}
      </HubCard>

      <HubCard title="Standard-ticket allowlist">
        <p className="mb-4 font-display text-[0.875rem] text-fg-2">
          Only emails on this list receive builder credits (Luma Standard ticket). Seeded together
          with event access via <code className="font-mono text-[0.8rem]">pnpm seed:luma</code> or{" "}
          <code className="font-mono text-[0.8rem]">pnpm seed:luma:prod</code>. Seed perk inventory
          separately with{" "}
          <code className="font-mono text-[0.8rem]">
            npx convex run hub/perks:seedPerkInventory
          </code>
          .
        </p>
        <p className="mb-4 font-display text-[0.925rem] text-fg">
          {(eligibleEmails?.total ?? 0).toLocaleString()} eligible emails
        </p>
        {(eligibleEmails?.batches ?? []).length > 0 ? (
          <ul className="space-y-1 text-sm text-fg-3">
            {eligibleEmails!.batches.map((batch) => (
              <li key={batch.batchId}>
                {batch.batchId}: {batch.count}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-fg-3">No allowlist seeded yet.</p>
        )}
      </HubCard>

      <HubCard title="Perk inventory">
        <p className="mb-4 font-display text-[0.875rem] text-fg-2">
          Unique codes and links for auto-assignment on sign-in. Seed Cursor links (
          <code className="font-mono text-[0.8rem]">pnpm seed:cursor</code>), Devin codes (
          <code className="font-mono text-[0.8rem]">pnpm seed:devin</code>), Codex credits (
          <code className="font-mono text-[0.8rem]">pnpm seed:codex</code>) and OpenAI API codes (
          <code className="font-mono text-[0.8rem]">pnpm seed:codex-api</code>) from{" "}
          <code className="font-mono text-[0.8rem]">seed/*.csv</code> — add{" "}
          <code className="font-mono text-[0.8rem]">:prod</code> for production. Other sponsors
          still use{" "}
          <code className="font-mono text-[0.8rem]">
            npx convex run hub/perks:seedPerkInventory
          </code>
          .
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-faint text-fg-3">
                <th className="py-2 pr-4">Sponsor</th>
                <th className="py-2 pr-4">Kind</th>
                <th className="py-2 pr-4">Variant</th>
                <th className="py-2 pr-4">Available</th>
                <th className="py-2">Assigned</th>
              </tr>
            </thead>
            <tbody>
              {(perkInventory ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-3 text-fg-3">
                    No inventory seeded yet.
                  </td>
                </tr>
              ) : (
                (perkInventory ?? []).map((row) => (
                  <tr
                    key={`${row.sponsorId}-${row.kind}-${row.variant}`}
                    className="border-b border-border-faint/60"
                  >
                    <td className="py-2 pr-4">{row.sponsorId}</td>
                    <td className="py-2 pr-4">{row.kind}</td>
                    <td className="py-2 pr-4">{row.variant}</td>
                    <td className="py-2 pr-4 tabular-nums">{row.available}</td>
                    <td className="py-2 tabular-nums">{row.assigned}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
