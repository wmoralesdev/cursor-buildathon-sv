import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useHubUser } from "./use-hub-user";

export function useMyPerks() {
  const { hubQueryArgs } = useHubUser();
  const result = useQuery(api.hub.perks.getMyPerks, hubQueryArgs);
  return {
    perks: result?.perks ?? null,
    eligible: result?.eligible ?? false,
    eligibilityReason: result?.eligibilityReason ?? null,
    isLoading: result === undefined && hubQueryArgs !== "skip",
  };
}

export type MyPerkEntry = NonNullable<
  ReturnType<typeof useMyPerks>["perks"]
>[number];

export type PerkEligibilityReason = NonNullable<
  ReturnType<typeof useMyPerks>["eligibilityReason"]
>;
