import { useUser } from "@clerk/react";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useHubProfile } from "./use-hub-profile";
import { useHubConvexSync, useHubQueryReady } from "./use-hub-query-ready";

export function useHubUser() {
  const hubReady = useHubQueryReady();
  const { convexConnected } = useHubConvexSync();
  const { isLoaded: clerkUserLoaded } = useUser();
  const profile = useHubProfile();
  const ensureUser = useMutation(api.hub.users.ensureUser);
  const me = useQuery(api.hub.users.getMe, hubReady ? {} : "skip");
  const role = useQuery(api.hub.users.getMyRole, hubReady && me ? {} : "skip");
  const ensureStarted = useRef(false);
  const [provisionFailed, setProvisionFailed] = useState(false);

  const canProvision =
    hubReady &&
    convexConnected &&
    clerkUserLoaded &&
    Boolean(profile.profileEmail);

  useEffect(() => {
    if (!canProvision || me === undefined || me !== null) {
      if (me !== null) {
        ensureStarted.current = false;
      }
      return;
    }

    if (ensureStarted.current) return;
    ensureStarted.current = true;
    setProvisionFailed(false);

    void ensureUser(profile).catch(() => {
      ensureStarted.current = false;
      setProvisionFailed(true);
    });
  }, [
    canProvision,
    ensureUser,
    me,
    profile.profileEmail,
    profile.profileName,
    profile.profilePictureUrl,
  ]);

  const isProvisioning = canProvision && me === null && !provisionFailed;

  return {
    user: me ?? null,
    role: role ?? null,
    isLoading: hubReady && (me === undefined || isProvisioning),
    isUserReady: !hubReady || me !== null,
    provisionFailed,
  };
}
