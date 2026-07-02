import { useAuth } from "@clerk/react";
import { useConvexAuth } from "convex/react";

import { isClerkConfigured } from "../lib/convex-clerk-provider";
import { isConvexConfigured } from "../lib/convex-client";

/** True when Clerk says the user is signed in — safe to call hub queries (backend returns null if Convex auth is still syncing). */
export function useHubQueryReady() {
  const { isSignedIn, isLoaded } = useAuth();
  return isConvexConfigured && isClerkConfigured && isLoaded && isSignedIn;
}

export function useHubConvexSync() {
  const { isSignedIn, isLoaded } = useAuth();
  const { isAuthenticated, isLoading } = useConvexAuth();

  const clerkSignedIn = isLoaded && isSignedIn;
  const convexLoading = clerkSignedIn && isLoading;
  const convexConnected = clerkSignedIn && !isLoading && isAuthenticated;
  const convexPending = clerkSignedIn && !isLoading && !isAuthenticated;

  return {
    clerkSignedIn,
    convexLoading,
    convexConnected,
    convexPending,
  };
}
