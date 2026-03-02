import { AuthConfig } from "convex/server";

const clerkIssuerDomain = process.env.CLERK_JWT_ISSUER_DOMAIN;
if (!clerkIssuerDomain) {
  throw new Error(
    "Missing CLERK_JWT_ISSUER_DOMAIN. Set it in Convex Dashboard (Settings → Environment Variables). " +
      "Get the value from Clerk Dashboard → JWT Templates → Convex template → Issuer URL."
  );
}

export default {
  providers: [
    {
      domain: clerkIssuerDomain,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
