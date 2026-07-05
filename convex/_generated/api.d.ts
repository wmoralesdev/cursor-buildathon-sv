/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as announcements from "../announcements.js";
import type * as eventTeams from "../eventTeams.js";
import type * as hub_adminJury from "../hub/adminJury.js";
import type * as hub_adminLogistics from "../hub/adminLogistics.js";
import type * as hub_adminMentors from "../hub/adminMentors.js";
import type * as hub_booths from "../hub/booths.js";
import type * as hub_eventAccess from "../hub/eventAccess.js";
import type * as hub_mentors from "../hub/mentors.js";
import type * as hub_perks from "../hub/perks.js";
import type * as hub_progress from "../hub/progress.js";
import type * as hub_projectActions from "../hub/projectActions.js";
import type * as hub_projects from "../hub/projects.js";
import type * as hub_seed from "../hub/seed.js";
import type * as hub_socialPosts from "../hub/socialPosts.js";
import type * as hub_sponsorFeedback from "../hub/sponsorFeedback.js";
import type * as hub_teams from "../hub/teams.js";
import type * as hub_users from "../hub/users.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_clerk_identity from "../lib/clerk_identity.js";
import type * as lib_competitionTracks from "../lib/competitionTracks.js";
import type * as lib_hubRoles from "../lib/hubRoles.js";
import type * as lib_hubSponsorIds from "../lib/hubSponsorIds.js";
import type * as lib_hub_auth from "../lib/hub_auth.js";
import type * as lib_hub_checkpoint_snapshot from "../lib/hub_checkpoint_snapshot.js";
import type * as lib_hub_checkpoints from "../lib/hub_checkpoints.js";
import type * as lib_hub_event_eligibility from "../lib/hub_event_eligibility.js";
import type * as lib_hub_event_schedule from "../lib/hub_event_schedule.js";
import type * as lib_hub_perk_assign from "../lib/hub_perk_assign.js";
import type * as lib_hub_perk_delivery from "../lib/hub_perk_delivery.js";
import type * as lib_hub_perk_eligibility from "../lib/hub_perk_eligibility.js";
import type * as lib_hub_project_events from "../lib/hub_project_events.js";
import type * as lib_hub_projections from "../lib/hub_projections.js";
import type * as lib_luma_registrant from "../lib/luma_registrant.js";
import type * as lib_profileValidation from "../lib/profileValidation.js";
import type * as lib_r2 from "../lib/r2.js";
import type * as lib_r2Node from "../lib/r2Node.js";
import type * as lib_repo_url from "../lib/repo_url.js";
import type * as lib_social_post_url from "../lib/social_post_url.js";
import type * as lib_sponsorTracks from "../lib/sponsorTracks.js";
import type * as projects from "../projects.js";
import type * as seed from "../seed.js";
import type * as social_posts from "../social_posts.js";
import type * as submissions from "../submissions.js";
import type * as teams from "../teams.js";
import type * as uploads from "../uploads.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  announcements: typeof announcements;
  eventTeams: typeof eventTeams;
  "hub/adminJury": typeof hub_adminJury;
  "hub/adminLogistics": typeof hub_adminLogistics;
  "hub/adminMentors": typeof hub_adminMentors;
  "hub/booths": typeof hub_booths;
  "hub/eventAccess": typeof hub_eventAccess;
  "hub/mentors": typeof hub_mentors;
  "hub/perks": typeof hub_perks;
  "hub/progress": typeof hub_progress;
  "hub/projectActions": typeof hub_projectActions;
  "hub/projects": typeof hub_projects;
  "hub/seed": typeof hub_seed;
  "hub/socialPosts": typeof hub_socialPosts;
  "hub/sponsorFeedback": typeof hub_sponsorFeedback;
  "hub/teams": typeof hub_teams;
  "hub/users": typeof hub_users;
  "lib/auth": typeof lib_auth;
  "lib/clerk_identity": typeof lib_clerk_identity;
  "lib/competitionTracks": typeof lib_competitionTracks;
  "lib/hubRoles": typeof lib_hubRoles;
  "lib/hubSponsorIds": typeof lib_hubSponsorIds;
  "lib/hub_auth": typeof lib_hub_auth;
  "lib/hub_checkpoint_snapshot": typeof lib_hub_checkpoint_snapshot;
  "lib/hub_checkpoints": typeof lib_hub_checkpoints;
  "lib/hub_event_eligibility": typeof lib_hub_event_eligibility;
  "lib/hub_event_schedule": typeof lib_hub_event_schedule;
  "lib/hub_perk_assign": typeof lib_hub_perk_assign;
  "lib/hub_perk_delivery": typeof lib_hub_perk_delivery;
  "lib/hub_perk_eligibility": typeof lib_hub_perk_eligibility;
  "lib/hub_project_events": typeof lib_hub_project_events;
  "lib/hub_projections": typeof lib_hub_projections;
  "lib/luma_registrant": typeof lib_luma_registrant;
  "lib/profileValidation": typeof lib_profileValidation;
  "lib/r2": typeof lib_r2;
  "lib/r2Node": typeof lib_r2Node;
  "lib/repo_url": typeof lib_repo_url;
  "lib/social_post_url": typeof lib_social_post_url;
  "lib/sponsorTracks": typeof lib_sponsorTracks;
  projects: typeof projects;
  seed: typeof seed;
  social_posts: typeof social_posts;
  submissions: typeof submissions;
  teams: typeof teams;
  uploads: typeof uploads;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
