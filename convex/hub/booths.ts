import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { requireHubRole, requireHubUser, requireTeamMembership } from "../lib/hub-auth";

const slotValidator = v.object({
  _id: v.id("hub_booth_slots"),
  startsAt: v.number(),
  endsAt: v.number(),
  reserved: v.boolean(),
  reservedByTeam: v.optional(v.string()),
  isMine: v.boolean(),
});

const boothValidator = v.object({
  _id: v.id("hub_booths"),
  name: v.string(),
  location: v.string(),
  slots: v.array(slotValidator),
});

export const listBoothsWithSlots = query({
  args: {},
  returns: v.array(boothValidator),
  handler: async (ctx) => {
    const user = await requireHubUser(ctx).catch(() => null);
    let myTeamId: string | null = null;
    if (user) {
      const membership = await ctx.db
        .query("hub_team_members")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .unique();
      myTeamId = membership?.teamId ?? null;
    }

    const booths = (await ctx.db.query("hub_booths").collect())
      .filter((booth) => booth.active)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    return await Promise.all(
      booths.map(async (booth) => {
        const slots = await ctx.db
          .query("hub_booth_slots")
          .withIndex("by_booth", (q) => q.eq("boothId", booth._id))
          .collect();

        const slotRows = await Promise.all(
          slots
            .sort((a, b) => a.startsAt - b.startsAt)
            .map(async (slot) => {
              const reservation = await ctx.db
                .query("hub_booth_reservations")
                .withIndex("by_slot", (q) => q.eq("slotId", slot._id))
                .unique();

              let reservedByTeam: string | undefined;
              if (reservation) {
                const team = await ctx.db.get(reservation.teamId);
                reservedByTeam = team?.name;
              }

              return {
                _id: slot._id,
                startsAt: slot.startsAt,
                endsAt: slot.endsAt,
                reserved: Boolean(reservation),
                reservedByTeam,
                isMine: Boolean(myTeamId && reservation?.teamId === myTeamId),
              };
            }),
        );

        return {
          _id: booth._id,
          name: booth.name,
          location: booth.location,
          slots: slotRows,
        };
      }),
    );
  },
});

export const reserveSlot = mutation({
  args: { slotId: v.id("hub_booth_slots") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireHubUser(ctx);
    const { team } = await requireTeamMembership(ctx, user._id);

    const slot = await ctx.db.get(args.slotId);
    if (!slot) throw new Error("Slot not found");

    const booth = await ctx.db.get(slot.boothId);
    if (!booth?.active) throw new Error("Booth is not available");

    const existingForSlot = await ctx.db
      .query("hub_booth_reservations")
      .withIndex("by_slot", (q) => q.eq("slotId", args.slotId))
      .unique();
    if (existingForSlot) {
      throw new Error("This slot is already reserved");
    }

    const existingForTeam = await ctx.db
      .query("hub_booth_reservations")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .collect();
    if (existingForTeam.length > 0) {
      throw new Error("Your team already has an active booth reservation");
    }

    await ctx.db.insert("hub_booth_reservations", {
      slotId: args.slotId,
      teamId: team._id,
      reservedBy: user._id,
      createdAt: Date.now(),
    });
    return null;
  },
});

export const cancelReservation = mutation({
  args: { slotId: v.id("hub_booth_slots") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireHubUser(ctx);
    const { team } = await requireTeamMembership(ctx, user._id);

    const reservation = await ctx.db
      .query("hub_booth_reservations")
      .withIndex("by_slot", (q) => q.eq("slotId", args.slotId))
      .unique();

    if (!reservation || reservation.teamId !== team._id) {
      throw new Error("Reservation not found for your team");
    }

    await ctx.db.delete(reservation._id);
    return null;
  },
});

export const configureBooths = mutation({
  args: {
    booths: v.array(
      v.object({
        name: v.string(),
        location: v.string(),
        sortOrder: v.number(),
      }),
    ),
    slotStartsAt: v.array(v.number()),
    slotDurationMs: v.number(),
    replaceExisting: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireHubRole(ctx, "logistics");

    if (args.replaceExisting) {
      const booths = await ctx.db.query("hub_booths").collect();
      for (const booth of booths) {
        const slots = await ctx.db
          .query("hub_booth_slots")
          .withIndex("by_booth", (q) => q.eq("boothId", booth._id))
          .collect();
        for (const slot of slots) {
          const reservation = await ctx.db
            .query("hub_booth_reservations")
            .withIndex("by_slot", (q) => q.eq("slotId", slot._id))
            .unique();
          if (reservation) await ctx.db.delete(reservation._id);
          await ctx.db.delete(slot._id);
        }
        await ctx.db.delete(booth._id);
      }
    }

    const now = Date.now();
    for (const booth of args.booths) {
      const boothId = await ctx.db.insert("hub_booths", {
        name: booth.name.trim(),
        location: booth.location.trim(),
        active: true,
        sortOrder: booth.sortOrder,
        createdAt: now,
      });

      for (const startsAt of args.slotStartsAt) {
        await ctx.db.insert("hub_booth_slots", {
          boothId,
          startsAt,
          endsAt: startsAt + args.slotDurationMs,
        });
      }
    }

    return null;
  },
});

export const cancelAnyReservation = mutation({
  args: { reservationId: v.id("hub_booth_reservations") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireHubRole(ctx, "logistics");
    await ctx.db.delete(args.reservationId);
    return null;
  },
});

export const listAllReservations = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("hub_booth_reservations"),
      boothName: v.string(),
      startsAt: v.number(),
      endsAt: v.number(),
      teamName: v.string(),
    }),
  ),
  handler: async (ctx) => {
    await requireHubRole(ctx, "logistics");

    const reservations = await ctx.db.query("hub_booth_reservations").collect();
    return await Promise.all(
      reservations.map(async (reservation) => {
        const slot = await ctx.db.get(reservation.slotId);
        const booth = slot ? await ctx.db.get(slot.boothId) : null;
        const team = await ctx.db.get(reservation.teamId);
        return {
          _id: reservation._id,
          boothName: booth?.name ?? "Unknown booth",
          startsAt: slot?.startsAt ?? 0,
          endsAt: slot?.endsAt ?? 0,
          teamName: team?.name ?? "Unknown team",
        };
      }),
    );
  },
});
