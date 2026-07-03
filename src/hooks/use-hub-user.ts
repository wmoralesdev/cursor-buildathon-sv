import { useEffect } from "react";
import { useAuth } from "@clerk/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { isClerkConfigured } from "../lib/convex-clerk-provider";
import { isConvexConfigured } from "../lib/convex-client";

export function useHubUser() {
  const { isSignedIn, isLoaded: isClerkLoaded } = useAuth();
  const { isLoading: isConvexAuthLoading, isAuthenticated } = useConvexAuth();
  const ensureUser = useMutation(api.hub.users.ensureUser);

  const isHubConvexLoading =
    Boolean(isSignedIn && isConvexConfigured && isClerkConfigured && isConvexAuthLoading);

  const hubQueryArgs =
    isSignedIn && isConvexConfigured && isClerkConfigured && !isConvexAuthLoading
      ? ({} as const)
      : ("skip" as const);

  const me = useQuery(api.hub.users.getMe, hubQueryArgs);
  const role = useQuery(api.hub.users.getMyRole, hubQueryArgs);

  useEffect(() => {
    if (
      !isSignedIn ||
      !isConvexConfigured ||
      !isClerkConfigured ||
      isConvexAuthLoading ||
      !isAuthenticated
    ) {
      return;
    }
    void ensureUser({});
  }, [ensureUser, isAuthenticated, isConvexAuthLoading, isSignedIn]);

  // #region agent log
  useEffect(() => {
    fetch("http://127.0.0.1:7524/ingest/ae7e5f7a-7927-4023-a554-d1b0cfb79922", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "73c77a" },
      body: JSON.stringify({
        sessionId: "73c77a",
        runId: "post-fix",
        hypothesisId: "A,C",
        location: "use-hub-user.ts:auth-state",
        message: "Hub user auth snapshot",
        data: {
          isClerkLoaded,
          isSignedIn,
          isConvexAuthLoading,
          isAuthenticated,
          isHubConvexLoading,
          hubQuerySkipped: hubQueryArgs === "skip",
          meDefined: me !== undefined,
          meIsNull: me === null,
          roleDefined: role !== undefined,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }, [
    isClerkLoaded,
    isSignedIn,
    isConvexAuthLoading,
    isAuthenticated,
    isHubConvexLoading,
    hubQueryArgs,
    me,
    role,
  ]);
  // #endregion

  const isLoading = isHubConvexLoading;

  return {
    user: me ?? null,
    role: role ?? null,
    isLoading,
    isHubConvexLoading,
    hubQueryArgs,
    isReady: !isSignedIn || me !== undefined,
    isRoleReady: !isSignedIn || role !== undefined,
  };
}
