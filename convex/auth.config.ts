import type { AuthConfig } from "convex/server";

/**
 * Clerk JWT provider for the Builder Hub.
 *
 * Auth is email OTP only (configured in Clerk Dashboard — no OAuth).
 *
 * 1. Clerk Dashboard → Integrations → Convex → Activate (copy Frontend API URL).
 * 2. Set CLERK_JWT_ISSUER_DOMAIN in the Convex dashboard to that Frontend API URL.
 * 3. Clerk Dashboard → Configure → Sessions → Customize session token → Claims:
 *    - aud is pre-mapped for Convex
 *    - add email = {{user.primary_email_address.email_address}}
 *    - optional: name = {{user.full_name}}, picture = {{user.image_url}}
 * 4. Sign out and sign back in after changing claims.
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
