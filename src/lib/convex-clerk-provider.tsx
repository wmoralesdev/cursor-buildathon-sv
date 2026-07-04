import type { ReactNode } from "react";
import { ClerkProvider, useAuth } from "@clerk/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { isClerkConfigured } from "./clerk-config";
import { convexClient } from "./convex-client";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export function ConvexClerkProvider({ children }: { children: ReactNode }) {
  if (!isClerkConfigured || !convexClient) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey!}
      signInFallbackRedirectUrl="/builder"
      signUpFallbackRedirectUrl="/builder"
    >
      <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
