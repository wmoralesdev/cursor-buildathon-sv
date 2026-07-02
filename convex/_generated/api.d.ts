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
import type * as crons from "../crons.js";
import type * as eventTeams from "../eventTeams.js";
import type * as github_client from "../github/client.js";
import type * as github_compliance from "../github/compliance.js";
import type * as github_parseRepoUrl from "../github/parseRepoUrl.js";
import type * as hub_adminJury from "../hub/adminJury.js";
import type * as hub_adminLogistics from "../hub/adminLogistics.js";
import type * as hub_adminMentors from "../hub/adminMentors.js";
import type * as hub_booths from "../hub/booths.js";
import type * as hub_linkTeamRepo from "../hub/linkTeamRepo.js";
import type * as hub_mentors from "../hub/mentors.js";
import type * as hub_progress from "../hub/progress.js";
import type * as hub_projects from "../hub/projects.js";
import type * as hub_repoCron from "../hub/repoCron.js";
import type * as hub_repoSync from "../hub/repoSync.js";
import type * as hub_repoTracking from "../hub/repoTracking.js";
import type * as hub_seed from "../hub/seed.js";
import type * as hub_socialPosts from "../hub/socialPosts.js";
import type * as hub_sponsorFeedback from "../hub/sponsorFeedback.js";
import type * as hub_teams from "../hub/teams.js";
import type * as hub_users from "../hub/users.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_competitionTracks from "../lib/competitionTracks.js";
import type * as lib_eventDates from "../lib/eventDates.js";
import type * as lib_hubAuth from "../lib/hubAuth.js";
import type * as lib_hubCheckpointWindows from "../lib/hubCheckpointWindows.js";
import type * as lib_hubProfile from "../lib/hubProfile.js";
import type * as lib_hubRoles from "../lib/hubRoles.js";
import type * as lib_hubSponsorIds from "../lib/hubSponsorIds.js";
import type * as lib_profileValidation from "../lib/profileValidation.js";
import type * as lib_r2 from "../lib/r2.js";
import type * as lib_r2Node from "../lib/r2Node.js";
import type * as lib_socialPostValidation from "../lib/socialPostValidation.js";
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
  crons: typeof crons;
  eventTeams: typeof eventTeams;
  "github/client": typeof github_client;
  "github/compliance": typeof github_compliance;
  "github/parseRepoUrl": typeof github_parseRepoUrl;
  "hub/adminJury": typeof hub_adminJury;
  "hub/adminLogistics": typeof hub_adminLogistics;
  "hub/adminMentors": typeof hub_adminMentors;
  "hub/booths": typeof hub_booths;
  "hub/linkTeamRepo": typeof hub_linkTeamRepo;
  "hub/mentors": typeof hub_mentors;
  "hub/progress": typeof hub_progress;
  "hub/projects": typeof hub_projects;
  "hub/repoCron": typeof hub_repoCron;
  "hub/repoSync": typeof hub_repoSync;
  "hub/repoTracking": typeof hub_repoTracking;
  "hub/seed": typeof hub_seed;
  "hub/socialPosts": typeof hub_socialPosts;
  "hub/sponsorFeedback": typeof hub_sponsorFeedback;
  "hub/teams": typeof hub_teams;
  "hub/users": typeof hub_users;
  "lib/auth": typeof lib_auth;
  "lib/competitionTracks": typeof lib_competitionTracks;
  "lib/eventDates": typeof lib_eventDates;
  "lib/hubAuth": typeof lib_hubAuth;
  "lib/hubCheckpointWindows": typeof lib_hubCheckpointWindows;
  "lib/hubProfile": typeof lib_hubProfile;
  "lib/hubRoles": typeof lib_hubRoles;
  "lib/hubSponsorIds": typeof lib_hubSponsorIds;
  "lib/profileValidation": typeof lib_profileValidation;
  "lib/r2": typeof lib_r2;
  "lib/r2Node": typeof lib_r2Node;
  "lib/socialPostValidation": typeof lib_socialPostValidation;
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
