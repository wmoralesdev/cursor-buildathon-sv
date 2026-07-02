import { useEffect } from "react";
import { useAuth } from "@clerk/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { isClerkConfigured } from "../lib/convex-clerk-provider";
import { isConvexConfigured } from "../lib/convex-client";

export function useHubUser() {
  const { isSignedIn } = useAuth();
  const ensureUser = useMutation(api.hub.users.ensureUser);
  const me = useQuery(
    api.hub.users.getMe,
    isConvexConfigured && isClerkConfigured && isSignedIn ? {} : "skip",
  );
  const role = useQuery(
    api.hub.users.getMyRole,
    isConvexConfigured && isClerkConfigured && isSignedIn ? {} : "skip",
  );

  useEffect(() => {
    if (!isSignedIn || !isConvexConfigured || !isClerkConfigured) return;
    if (me === undefined) return;
    if (me === null) {
      void ensureUser({});
    }
  }, [ensureUser, isSignedIn, me]);

  return {
    user: me ?? null,
    role: role ?? null,
    isLoading: isSignedIn && me === undefined,
    isReady: !isSignedIn || me !== undefined,
  };
}
