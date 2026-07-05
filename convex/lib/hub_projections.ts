import type { Doc, Id } from "../_generated/dataModel";
import { resolveProjectRepoUrls } from "./hub_project_repo_urls";
import { getPublicUrl } from "./r2";

/** Strip Convex system/DB-only fields before return validation. */

export type HubUserPublic = {
  _id: Id<"hub_users">;
  clerkId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: Doc<"hub_users">["role"];
  createdAt: number;
};

export function toHubUserPublic(user: Doc<"hub_users">): HubUserPublic {
  return {
    _id: user._id,
    clerkId: user.clerkId,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export type HubTeamMemberPublic = {
  userId: Id<"hub_users">;
  name: string;
  email: string;
  avatarUrl?: string;
  isCaptain: boolean;
  joinedAt: number;
};

export type HubTeamPublic = {
  _id: Id<"hub_teams">;
  name: string;
  inviteCode: string;
  track?: Doc<"hub_teams">["track"];
  captainId: Id<"hub_users">;
  members: HubTeamMemberPublic[];
  createdAt: number;
};

export function toHubTeamPublic(
  team: Doc<"hub_teams">,
  members: HubTeamMemberPublic[],
): HubTeamPublic {
  return {
    _id: team._id,
    name: team.name,
    inviteCode: team.inviteCode,
    track: team.track,
    captainId: team.captainId,
    members,
    createdAt: team.createdAt,
  };
}

export type HubProjectPublic = {
  _id: Id<"hub_projects">;
  teamId: Id<"hub_teams">;
  name: string;
  description: string;
  url: string;
  repoUrls: string[];
  sponsorsUsed: Doc<"hub_projects">["sponsorsUsed"];
  createdAt: number;
};

export function toHubProjectPublic(project: Doc<"hub_projects">): HubProjectPublic {
  return {
    _id: project._id,
    teamId: project.teamId,
    name: project.name,
    description: project.description,
    url: project.url,
    repoUrls: resolveProjectRepoUrls(project),
    sponsorsUsed: project.sponsorsUsed,
    createdAt: project.createdAt,
  };
}

export type HubDeliverablesPublic = {
  _id: Id<"hub_deliverables">;
  teamId: Id<"hub_teams">;
  slidesUrl?: string;
  videoR2Key?: string;
  videoUrl?: string;
  videoPlaybackUrl?: string;
  testUsers?: string;
  submittedAt?: number;
};

export function toHubDeliverablesPublic(
  deliverables: Doc<"hub_deliverables">,
): HubDeliverablesPublic {
  const videoPlaybackUrl = deliverables.videoR2Key
    ? getPublicUrl(deliverables.videoR2Key)
    : deliverables.videoUrl;
  return {
    _id: deliverables._id,
    teamId: deliverables.teamId,
    slidesUrl: deliverables.slidesUrl,
    videoR2Key: deliverables.videoR2Key,
    videoUrl: deliverables.videoUrl,
    videoPlaybackUrl,
    testUsers: deliverables.testUsers,
    submittedAt: deliverables.submittedAt,
  };
}

export type HubMentorPublic = {
  _id: Id<"hub_mentors">;
  name: string;
  role: string;
  company?: string;
  avatarUrl?: string;
  bio?: string;
  remote: boolean;
  bookingUrl?: string;
  email?: string;
  active: boolean;
  sortOrder: number;
};

export function toHubMentorPublic(mentor: Doc<"hub_mentors">): HubMentorPublic {
  return {
    _id: mentor._id,
    name: mentor.name,
    role: mentor.role,
    company: mentor.company,
    avatarUrl: mentor.avatarUrl,
    bio: mentor.bio,
    remote: mentor.remote,
    bookingUrl: mentor.bookingUrl,
    email: mentor.email,
    active: mentor.active,
    sortOrder: mentor.sortOrder,
  };
}
