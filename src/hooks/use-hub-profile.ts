import { useUser } from "@clerk/react";

/** Clerk profile fields for hub provisioning when the Convex JWT lacks email claims. */
export function useHubProfile() {
  const { user } = useUser();

  const profileEmail =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    undefined;

  return {
    profileEmail,
    profileName: user?.fullName ?? user?.firstName ?? undefined,
    profilePictureUrl: user?.imageUrl ?? undefined,
  };
}
