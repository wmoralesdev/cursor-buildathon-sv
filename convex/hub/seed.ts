import { internalMutation } from "../_generated/server";
import { v } from "convex/values";
import {
  BOOTH_SLOT_DURATION_MS,
  buildBoothSlotStarts,
  DEFAULT_HUB_BOOTHS,
} from "../lib/hub_event_schedule";
import { normalizeEventEligibleEmail } from "../lib/hub_event_eligibility";
import { normalizePerkEligibleEmail } from "../lib/hub_perk_eligibility";
import {
  countStandardRows,
  isPerkEligibleTicket,
  mergeLumaRegistrantRows,
} from "../lib/luma_registrant";

const lumaRegistrantRowValidator = v.object({
  email: v.string(),
  ticketName: v.string(),
});

const seedLumaRegistrantsResultValidator = v.object({
  eventInserted: v.number(),
  eventSkipped: v.number(),
  perkInserted: v.number(),
  perkSkipped: v.number(),
  totalRows: v.number(),
  standardRows: v.number(),
});

const DEFAULT_MENTORS = [
  {
    name: "Walter Morales",
    role: "Regional Lead at Cursor",
    company: "Cursor",
    remote: true,
    bookingUrl: "",
    email: "walter@cursor.com",
    sortOrder: 0,
  },
  {
    name: "Mentor Placeholder",
    role: "Product mentor",
    company: "Partner",
    remote: true,
    bookingUrl: "",
    email: "mentor@example.com",
    sortOrder: 1,
  },
] as const;

export const seedHubDefaults = internalMutation({
  args: {
    roleAssignments: v.optional(
      v.array(
        v.object({
          email: v.string(),
          role: v.union(
            v.literal("logistics"),
            v.literal("mentor"),
            v.literal("jury"),
          ),
        }),
      ),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existingMentors = await ctx.db.query("hub_mentors").collect();
    if (existingMentors.length === 0) {
      const now = Date.now();
      for (const mentor of DEFAULT_MENTORS) {
        await ctx.db.insert("hub_mentors", {
          name: mentor.name,
          role: mentor.role,
          company: mentor.company,
          remote: mentor.remote,
          bookingUrl: mentor.bookingUrl || undefined,
          email: mentor.email,
          active: true,
          sortOrder: mentor.sortOrder,
          createdAt: now,
        });
      }
    }

    if (args.roleAssignments) {
      for (const assignment of args.roleAssignments) {
        const email = assignment.email.trim().toLowerCase();
        const existing = await ctx.db
          .query("hub_role_assignments")
          .withIndex("by_email", (q) => q.eq("email", email))
          .unique();
        if (!existing) {
          await ctx.db.insert("hub_role_assignments", {
            email,
            role: assignment.role,
            createdAt: Date.now(),
          });
        }
      }
    }

    const existingBooths = await ctx.db.query("hub_booths").first();
    if (!existingBooths) {
      const slotStarts = buildBoothSlotStarts();
      const now = Date.now();
      for (const booth of DEFAULT_HUB_BOOTHS) {
        const boothId = await ctx.db.insert("hub_booths", {
          name: booth.name,
          location: booth.location,
          active: true,
          sortOrder: booth.sortOrder,
          createdAt: now,
        });
        for (const startsAt of slotStarts) {
          await ctx.db.insert("hub_booth_slots", {
            boothId,
            startsAt,
            endsAt: startsAt + BOOTH_SLOT_DURATION_MS,
          });
        }
      }
    }

    return null;
  },
});

export const seedLumaRegistrants = internalMutation({
  args: {
    batchId: v.optional(v.string()),
    rows: v.array(lumaRegistrantRowValidator),
  },
  returns: seedLumaRegistrantsResultValidator,
  handler: async (ctx, args) => {
    const batchId = args.batchId ?? "luma-export";
    const mergedRows = mergeLumaRegistrantRows(args.rows);
    const now = Date.now();

    const existingEventRows = await ctx.db.query("hub_event_eligible_emails").collect();
    const existingEventEmails = new Set(
      existingEventRows.map((row) => normalizeEventEligibleEmail(row.email)),
    );

    const existingPerkRows = await ctx.db.query("hub_perk_eligible_emails").collect();
    const existingPerkEmails = new Set(
      existingPerkRows.map((row) => normalizePerkEligibleEmail(row.email)),
    );

    let eventInserted = 0;
    let eventSkipped = 0;
    let perkInserted = 0;
    let perkSkipped = 0;

    for (const row of mergedRows) {
      const email = normalizeEventEligibleEmail(row.email);
      if (!email || !email.includes("@")) {
        eventSkipped += 1;
        perkSkipped += 1;
        continue;
      }

      if (existingEventEmails.has(email)) {
        eventSkipped += 1;
      } else {
        await ctx.db.insert("hub_event_eligible_emails", {
          email,
          batchId,
          createdAt: now,
        });
        existingEventEmails.add(email);
        eventInserted += 1;
      }

      if (!isPerkEligibleTicket(row.ticketName)) {
        continue;
      }

      const perkEmail = normalizePerkEligibleEmail(email);
      if (existingPerkEmails.has(perkEmail)) {
        perkSkipped += 1;
      } else {
        await ctx.db.insert("hub_perk_eligible_emails", {
          email: perkEmail,
          batchId,
          createdAt: now,
        });
        existingPerkEmails.add(perkEmail);
        perkInserted += 1;
      }
    }

    return {
      eventInserted,
      eventSkipped,
      perkInserted,
      perkSkipped,
      totalRows: mergedRows.length,
      standardRows: countStandardRows(mergedRows),
    };
  },
});
