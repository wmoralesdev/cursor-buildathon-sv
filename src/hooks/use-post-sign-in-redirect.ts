import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/react";
import { useLocation, useNavigate } from "react-router-dom";

import { useHubUser } from "./use-hub-user";
import { isClerkConfigured } from "../lib/convex-clerk-provider";
import { isConvexConfigured } from "../lib/convex-client";

export const BUILDER_HUB_PATH = "/builder";

/** After sign-in, send builders to the hub; hub staff keep their current page. */
export function usePostSignInRedirect() {
  const { isSignedIn, isLoaded } = useAuth();
  const { role, isReady, isRoleReady } = useHubUser();
  const navigate = useNavigate();
  const location = useLocation();
  const prevSignedInRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!isClerkConfigured || !isConvexConfigured || !isLoaded) return;

    const wasSignedIn = prevSignedInRef.current;
    prevSignedInRef.current = isSignedIn;

    if (!isSignedIn || wasSignedIn !== false) return;
    if (!isReady || !isRoleReady) return;

    const isHubAdmin = Boolean(role?.role);
    if (isHubAdmin) return;

    if (location.pathname === BUILDER_HUB_PATH) return;

    navigate(BUILDER_HUB_PATH, { replace: true });
  }, [
    isLoaded,
    isReady,
    isRoleReady,
    isSignedIn,
    location.pathname,
    navigate,
    role,
  ]);
}
