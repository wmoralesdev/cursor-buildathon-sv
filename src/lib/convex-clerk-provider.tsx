import type { ReactNode } from "react";
import { ClerkProvider, useAuth } from "@clerk/react";
import { ConvexProvider } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { convexClient } from "./convex-client";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const isClerkConfigured = Boolean(clerkPublishableKey);

export function ConvexClerkProvider({ children }: { children: ReactNode }) {
  let tree: ReactNode = children;

  if (convexClient) {
    tree =
      isClerkConfigured ? (
        <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
          {tree}
        </ConvexProviderWithClerk>
      ) : (
        <ConvexProvider client={convexClient}>{tree}</ConvexProvider>
      );
  }

  if (!isClerkConfigured) {
    return <>{tree}</>;
  }

  return <ClerkProvider publishableKey={clerkPublishableKey!}>{tree}</ClerkProvider>;
}
