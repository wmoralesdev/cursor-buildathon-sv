import { AuthConfig } from "convex/server";

/**
 * Clerk auth is optional until the participant dashboard is wired up.
 * Open project submissions use public mutations and do not require auth.
 *
 * When Clerk is ready, set CLERK_JWT_ISSUER_DOMAIN in the Convex dashboard and
 * add the provider here. Do not reference process.env in this file until then —
 * Convex requires every referenced env var to be set before deploy.
 */
export default {
  providers: [],
} satisfies AuthConfig;
