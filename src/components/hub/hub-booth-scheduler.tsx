import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useTranslation } from "../../context/language-context";
import { isConvexConfigured } from "../../lib/convex-client";
import { HubButton, HubCard } from "./hub-ui-primitives";

function formatSlotTime(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function HubBoothScheduler() {
  const { t } = useTranslation();
  const booths = useQuery(api.hub.booths.listBoothsWithSlots, isConvexConfigured ? {} : "skip");
  const reserveSlot = useMutation(api.hub.booths.reserveSlot);
  const cancelReservation = useMutation(api.hub.booths.cancelReservation);

  if (booths === undefined) {
    return (
      <HubCard title={t("hub.booths.title")} tag={t("hub.booths.tag")}>
        <div className="h-24 animate-pulse bg-border-faint" />
      </HubCard>
    );
  }

  if (booths.length === 0) {
    return (
      <HubCard title={t("hub.booths.title")} tag={t("hub.booths.tag")}>
        <p className="font-display text-[0.925rem] text-fg-2">{t("hub.booths.empty")}</p>
      </HubCard>
    );
  }

  return (
    <HubCard title={t("hub.booths.title")} tag={t("hub.booths.tag")}>
      <p className="mb-5 font-display text-[0.925rem] text-fg-2">{t("hub.booths.intro")}</p>
      <div className="space-y-6">
        {booths.map((booth) => (
          <div key={booth._id}>
            <div className="mb-3">
              <p className="font-display text-[0.975rem] text-fg">{booth.name}</p>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-fg-3">
                {booth.location}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {booth.slots.map((slot) => (
                <div
                  key={slot._id}
                  className="min-w-[9rem] border border-border-faint px-3 py-2"
                >
                  <p className="font-mono text-[0.7rem] text-fg">
                    {formatSlotTime(slot.startsAt)} – {formatSlotTime(slot.endsAt)}
                  </p>
                  {slot.reserved ? (
                    <div className="mt-2">
                      <p className="font-display text-[0.8rem] text-fg-2">
                        {slot.isMine ? t("hub.booths.yours") : slot.reservedByTeam}
                      </p>
                      {slot.isMine ? (
                        <HubButton
                          variant="ghost"
                          className="mt-2"
                          onClick={() =>
                            cancelReservation({ slotId: slot._id as Id<"hub_booth_slots"> })
                          }
                        >
                          {t("hub.booths.cancel")}
                        </HubButton>
                      ) : null}
                    </div>
                  ) : (
                    <HubButton
                      className="mt-2"
                      onClick={() => reserveSlot({ slotId: slot._id as Id<"hub_booth_slots"> })}
                    >
                      {t("hub.booths.reserve")}
                    </HubButton>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </HubCard>
  );
}
