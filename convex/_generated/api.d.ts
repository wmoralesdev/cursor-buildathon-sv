/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as hub_adminJury from "../hub/adminJury.js";
import type * as hub_adminLogistics from "../hub/adminLogistics.js";
import type * as hub_adminMentors from "../hub/adminMentors.js";
import type * as hub_booths from "../hub/booths.js";
import type * as hub_mentors from "../hub/mentors.js";
import type * as hub_progress from "../hub/progress.js";
import type * as hub_projects from "../hub/projects.js";
import type * as hub_seed from "../hub/seed.js";
import type * as hub_socialPosts from "../hub/socialPosts.js";
import type * as hub_sponsorFeedback from "../hub/sponsorFeedback.js";
import type * as hub_teams from "../hub/teams.js";
import type * as hub_users from "../hub/users.js";
import type * as admin from "../admin.js";
import type * as announcements from "../announcements.js";
import type * as eventTeams from "../eventTeams.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_competitionTracks from "../lib/competitionTracks.js";
import type * as lib_profileValidation from "../lib/profileValidation.js";
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
  "hub/adminJury": typeof hub_adminJury;
  "hub/adminLogistics": typeof hub_adminLogistics;
  "hub/adminMentors": typeof hub_adminMentors;
  "hub/booths": typeof hub_booths;
  "hub/mentors": typeof hub_mentors;
  "hub/progress": typeof hub_progress;
  "hub/projects": typeof hub_projects;
  "hub/seed": typeof hub_seed;
  "hub/socialPosts": typeof hub_socialPosts;
  "hub/sponsorFeedback": typeof hub_sponsorFeedback;
  "hub/teams": typeof hub_teams;
  "hub/users": typeof hub_users;
  admin: typeof admin;
  announcements: typeof announcements;
  eventTeams: typeof eventTeams;
  "lib/auth": typeof lib_auth;
  "lib/competitionTracks": typeof lib_competitionTracks;
  "lib/profileValidation": typeof lib_profileValidation;
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
