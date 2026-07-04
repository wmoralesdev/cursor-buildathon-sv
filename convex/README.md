# Welcome to your Convex functions directory!

Write your Convex functions here.

## Seeding for /admin testing

To populate the DB with sample projects, teams, and social posts:

1. Set `ADMIN_EMAILS` in Convex Dashboard (Settings → Environment Variables), e.g. `your@email.com`
2. Sign in at `/login` with that email so your user exists
3. Run: `npx convex run seed:seed`

## Luma allowlists (builder hub sign-in + credits)

Export Luma registrants to [seed/luma.csv](../seed/luma.csv) (columns: `email`, `ticket_name`).

| Command | Target |
|---------|--------|
| `pnpm seed:luma` | Dev Convex deployment |
| `pnpm seed:luma:prod` | Production Convex deployment |

The script is idempotent — safe to re-run after a fresh Luma export. It seeds:

- **All CSV emails** → `hub_event_eligible_emails` (hub sign-in)
- **`Standard` ticket emails** → `hub_perk_eligible_emails` (builder credits)
- Always includes `walterrafael26@gmail.com` and `26irenelopez@gmail.com` as Standard
- Runs `backfillPerkClaims` for users who signed in before seeding

### Production go-live checklist

1. Export Luma → save as `seed/luma.csv`
2. Deploy Convex: `pnpm convex:deploy`
3. **Convex prod env vars** (Dashboard → prod → Settings → Environment Variables):
   - `CLERK_JWT_ISSUER_DOMAIN` = production Clerk Frontend API URL
   - `ADMIN_EMAILS` = logistics/admin emails
4. **Clerk production** (email OTP only — no OAuth):
   - Session token must include `email` claim (`{{user.primary_email_address.email_address}}`)
   - Enable **Email verification code**; disable Google/GitHub and other social connections
   - Configure domain DNS in Clerk for production OTP email delivery
   - Add production (and preview) origins to **Paths → Allowed redirect URLs**
5. Seed perk inventory:
   - `pnpm seed:cursor:prod` — referral links from `seed/cursor.csv`
   - `pnpm seed:devin:prod` — API codes from `seed/devin.csv`
   - `pnpm seed:codex:prod` — $100 Codex credits links from `seed/codex-credits.csv`
   - `pnpm seed:codex-api:prod` — OpenAI API codes from `seed/codex-api.csv`
6. Seed allowlists: `pnpm seed:luma:prod`
7. Verify logistics admin panel counts; test Standard vs Sobrecupo sign-in on prod
8. Test email OTP sign-in (allowlisted Luma email) on prod; dev can use test code `424242`

See https://docs.convex.dev/functions for more.

A query function that takes two arguments looks like:

```ts
// convex/myFunctions.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const myQueryFunction = query({
  // Validators for arguments.
  args: {
    first: v.number(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Read the database as many times as you need here.
    // See https://docs.convex.dev/database/reading-data.
    const documents = await ctx.db.query("tablename").collect();

    // Arguments passed from the client are properties of the args object.
    console.log(args.first, args.second);

    // Write arbitrary JavaScript here: filter, aggregate, build derived data,
    // remove non-public properties, or create new objects.
    return documents;
  },
});
```

Using this query function in a React component looks like:

```ts
const data = useQuery(api.myFunctions.myQueryFunction, {
  first: 10,
  second: "hello",
});
```

A mutation function looks like:

```ts
// convex/myFunctions.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const myMutationFunction = mutation({
  // Validators for arguments.
  args: {
    first: v.string(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Insert or modify documents in the database here.
    // Mutations can also read from the database like queries.
    // See https://docs.convex.dev/database/writing-data.
    const message = { body: args.first, author: args.second };
    const id = await ctx.db.insert("messages", message);

    // Optionally, return a value from your mutation.
    return await ctx.db.get("messages", id);
  },
});
```

Using this mutation function in a React component looks like:

```ts
const mutation = useMutation(api.myFunctions.myMutationFunction);
function handleButtonPress() {
  // fire and forget, the most common way to use mutations
  mutation({ first: "Hello!", second: "me" });
  // OR
  // use the result once the mutation has completed
  mutation({ first: "Hello!", second: "me" }).then((result) =>
    console.log(result),
  );
}
```

Use the Convex CLI to push your functions to a deployment. See everything
the Convex CLI can do by running `npx convex -h` in your project root
directory. To learn more, launch the docs with `npx convex docs`.
