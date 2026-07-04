import { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { HubUserPublic } from "../../convex/lib/hub_projections";
import { isClerkConfigured } from "../lib/clerk-config";
import { isConvexConfigured } from "../lib/convex-client";

export type EventAccessReason = "registered" | "not_eligible" | "staff";

function useEnsureHubUser(active: boolean) {
  const ensureUser = useMutation(api.hub.users.ensureUser);
  const [bootstrappedUser, setBootstrappedUser] = useState<HubUserPublic | null>(null);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);
  const activeKey = String(active);

  const [appliedActiveKey, setAppliedActiveKey] = useState(activeKey);
  if (appliedActiveKey !== activeKey) {
    setAppliedActiveKey(activeKey);
    setBootstrappedUser(null);
    setBootstrapError(null);
  }

  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    void ensureUser({})
      .then((created) => {
        if (cancelled) return;
        setBootstrappedUser(created);
        setBootstrapError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setBootstrapError(err instanceof Error ? err.message : "Failed to set up hub user");
      });

    return () => {
      cancelled = true;
    };
  }, [active, ensureUser]);

  return {
    bootstrappedUser: active ? bootstrappedUser : null,
    bootstrapError: active ? bootstrapError : null,
    isEnsuringUser: active && bootstrappedUser === null && bootstrapError === null,
  };
}

export function useHubUser() {
  const { isSignedIn } = useAuth();
  const { isLoading: isConvexAuthLoading, isAuthenticated } = useConvexAuth();

  const isHubConvexLoading =
    Boolean(isSignedIn && isConvexConfigured && isClerkConfigured && isConvexAuthLoading);

  const canBootstrap =
    Boolean(
      isSignedIn && isConvexConfigured && isClerkConfigured && !isConvexAuthLoading && isAuthenticated,
    );

  const eventAccessArgs = canBootstrap ? ({} as const) : ("skip" as const);
  const eventAccess = useQuery(api.hub.eventAccess.getEventAccess, eventAccessArgs);

  const canEnsureUser = canBootstrap && eventAccess?.eligible === true;

  const meQueryArgs = canEnsureUser ? ({} as const) : ("skip" as const);
  const me = useQuery(api.hub.users.getMe, meQueryArgs);

  const shouldEnsureUser = canEnsureUser && me === null;
  const { bootstrappedUser, bootstrapError, isEnsuringUser } = useEnsureHubUser(shouldEnsureUser);

  const user = me ?? bootstrappedUser;

  const hubQueryArgs = canEnsureUser && user ? ({} as const) : ("skip" as const);

  const role = useQuery(api.hub.users.getMyRole, hubQueryArgs);

  const isEventAccessLoading = canBootstrap && eventAccess === undefined;
  const isHubBootstrapping = canEnsureUser && !user && !bootstrapError;
  const isLoading = isHubConvexLoading || isEventAccessLoading || isHubBootstrapping || isEnsuringUser;

  return {
    user: user ?? null,
    role: role ?? null,
    eventAccess: eventAccess ?? null,
    isEventAccessLoading,
    isLoading,
    isHubConvexLoading,
    isHubBootstrapping,
    bootstrapError,
    hubQueryArgs,
    isReady: !isSignedIn || Boolean(user),
    isRoleReady: !isSignedIn || role !== undefined,
    hasEventAccess: !isSignedIn || eventAccess?.eligible === true,
  };
}
