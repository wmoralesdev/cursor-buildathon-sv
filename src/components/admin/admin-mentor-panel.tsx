import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { HubButton, HubCard, HubField, HubInput, HubTextarea } from "../hub/hub-ui-primitives";

type MentorProfileFieldsProps = {
  profile: {
    name: string;
    role: string;
    bio?: string;
    bookingUrl?: string;
  };
  onSave: (values: { bio: string; bookingUrl: string }) => void;
};

function MentorProfileFields({ profile, onSave }: MentorProfileFieldsProps) {
  const [bio, setBio] = useState(profile.bio ?? "");
  const [bookingUrl, setBookingUrl] = useState(profile.bookingUrl ?? "");

  return (
    <>
      <p className="mb-4 text-sm text-fg-2">
        {profile.name} · {profile.role}
      </p>
      <HubField label="Bio">
        <HubTextarea value={bio} onChange={(e) => setBio(e.target.value)} />
      </HubField>
      <HubField label="Booking URL">
        <HubInput value={bookingUrl} onChange={(e) => setBookingUrl(e.target.value)} />
      </HubField>
      <HubButton onClick={() => onSave({ bio, bookingUrl })}>Save profile</HubButton>
    </>
  );
}

export function AdminMentorPanel() {
  const profile = useQuery(api.hub.adminMentors.getMyMentorProfile, {});
  const teams = useQuery(api.hub.adminMentors.listTeamsReadOnly, {});
  const updateProfile = useMutation(api.hub.adminMentors.updateMyMentorProfile);

  return (
    <div className="space-y-6">
      <HubCard title="My mentor profile">
        {profile ? (
          <MentorProfileFields
            key={`${profile.bio ?? ""}:${profile.bookingUrl ?? ""}`}
            profile={profile}
            onSave={({ bio, bookingUrl }) => updateProfile({ bio, bookingUrl })}
          />
        ) : (
          <p className="text-sm text-fg-2">No mentor profile matched to your email yet.</p>
        )}
      </HubCard>

      <HubCard title="Teams (read-only)">
        <ul className="space-y-2 text-sm">
          {(teams ?? []).map((team) => (
            <li key={team._id} className="border border-border-faint px-3 py-2">
              {team.name} · {team.memberCount} members · {team.track ?? "no track"}
            </li>
          ))}
        </ul>
      </HubCard>
    </div>
  );
}
