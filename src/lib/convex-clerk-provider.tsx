import type { ReactNode } from "react";
import { ClerkProvider, useAuth } from "@clerk/react";
import { ConvexProvider } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { convexClient } from "./convex-client";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const isClerkConfigured = Boolean(clerkPublishableKey);

export function ConvexClerkProvider({ children }: { children: ReactNode }) {
  if (!convexClient) {
    return <>{children}</>;
  }

  if (!isClerkConfigured) {
    return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey!}>
      <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
