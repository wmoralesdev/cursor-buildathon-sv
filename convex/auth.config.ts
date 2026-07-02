import type { AuthConfig } from "convex/server";

/**
 * Clerk JWT provider for the Builder Hub.
 * Set CLERK_JWT_ISSUER_DOMAIN in the Convex dashboard (Issuer URL from Clerk JWT template "convex").
 */
const clerkIssuerDomain = process.env.CLERK_JWT_ISSUER_DOMAIN;

export default {
  providers: clerkIssuerDomain
    ? [
        {
          domain: clerkIssuerDomain,
          applicationID: "convex",
        },
      ]
    : [],
} satisfies AuthConfig;
