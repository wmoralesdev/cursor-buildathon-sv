## Learned User Preferences

- When trade-offs affect sponsor UI, favor treatments that keep sponsor logos prominent; visibility to partners is a stated priority.
- For Remotion sponsor-spot (and similar) compositions, prefer Cursor-faithful chrome and terminal styling, a visually integrated sponsor mark with minimal outer framing, enough hold time to read on-screen copy, and seamless looping when the piece should repeat.
- When giving design or UX recommendations, state a concrete desired end state; avoid vague critique without actionable direction.
- Unless specified otherwise, keep partner/sponsor rail order with Codex, n8n, and Zavu first and grouped together; other partners follow.
- Landing hero work should preserve the partner logo marquee as part of the hero.
- Below the hero geo line, the “Lead partners” strip is for featured product marks only (Codex, ElevenLabs); keep Cursor in the scrolling partner rail rather than duplicating it in that strip.
- For sponsor-spot Remotion clips, the fake typed CLI line should use the sponsor’s lowercase product id inside the quoted token (e.g. `weris`) when terminal-authentic copy is intended.
- For event-intro Remotion story format, align chrome with sponsor-spot story (`SponsorSpotCornerHeader`, matching vertical band padding).
- When tuning the event-intro center Cursor mark, prefer lengthening the full-opacity hold via `event-intro-spec.ts` timeline shifts rather than slowing lock-in/out ramps unless explicitly requested.
- For light sponsor one-pagers, favor executive-scan layout: clearly separate **funds already committed** from the **suggested new contribution**; tighten copy (no AI-flavored jargon, avoid repeating the same positioning hook); print/PDF should honor the selected **locale and preview scale** and open **sheet-only** content without extra chrome.

## Learned Workspace Facts

- Product sponsor changes usually propagate through `src/components/sponsor-logos/sponsor-logo-ids.ts`, themed logo components and `productSponsorLogoById`, `src/data/sponsors.ts` (including `onePagerSponsors` guards), `src/components/hero-section.tsx` (`PARTNER_ORDER`, `RAIL_LOGO_CLASS`), `src/components/welcome-sponsor-marks.tsx` (keys, components, and matching order), `src/lib/welcome-post-sponsor-wall.ts` row lengths that sum to the mark count, `src/components/welcome-card-export-sponsor-slate.tsx` export list parity, and `src/components/sponsor-spot-logo.tsx` with Remotion sponsor-spot comps derived from welcome mark keys.
- Kreali uses themed SVGs at `public/sponsors/kreali-dark.svg` and `public/sponsors/kreali-light.svg`.
- Weris uses themed SVGs at `public/sponsors/weris_dark.svg` and `public/sponsors/weris_light.svg`.
- `.agents` (local agent skills / scratch) is gitignored at the repo root.
- Event-intro partner wall: global `.sponsor-slot` stays at `opacity: 0` until welcome-slate `[data-slate-active="true"]`; Remotion event-intro marks the wall with `data-event-intro-partner-wall="true"` and a scoped override in `src/index.css` so logos stay visible with frame-driven timing.

## Cursor Cloud specific instructions

- Package manager is **pnpm** (`pnpm-lock.yaml`); run on **Node 22**. Dependencies install via `pnpm install`.
- Standard scripts live in `package.json`: `pnpm dev` (Vite on port **5173**), `pnpm build` (`tsc -b && vite build`), `pnpm lint` (`eslint .`), `pnpm convex` (`convex dev`), and the `remotion:*` studio/render scripts.
- **The Vite frontend runs standalone with no env vars.** `src/lib/convex-client.ts` returns a null client when `VITE_CONVEX_URL` is unset, and `src/lib/convex-clerk-provider.tsx` skips Clerk when `VITE_CLERK_PUBLISHABLE_KEY` is unset, so the UI renders without a backend. Great for UI/landing/`/welcome` work. Backend-dependent flows (`/builder`, `/submit`, `/admin`, hub) silently no-op without Convex.
- **Backend/auth/storage require env vars that are set up separately** (not committed). To run the Convex backend against a cloud dev deployment: put `VITE_CONVEX_URL`, `VITE_CLERK_PUBLISHABLE_KEY`, and `VITE_SITE_URL` in `.env.local`; provide `CONVEX_DEPLOY_KEY` (or a Convex login) so the CLI is non-interactive; set the **server-side** vars on the deployment itself with `npx convex env set NAME value` (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_BASE_URL`, `CLERK_JWT_ISSUER_DOMAIN`, optional `ADMIN_EMAILS`) — these are read via `process.env` inside `convex/` and are NOT taken from `.env.local`; then push functions with `npx convex dev --once` (or `pnpm convex`).
- **Known blocker (as of this setup):** `npx convex dev` push fails with `InvalidConfig: lib/hub-auth.js is not a valid path to a Convex module` because `convex/lib/hub-auth.ts` uses a hyphen (Convex module paths disallow hyphens). Until it is renamed (e.g. `hubAuth.ts` + updating the ~11 hub imports), NO functions deploy and all Convex-backed pages (`/builder`, `/submit`, `/admin`, announcements) error with "Could not find public function". The public/client-side pages (`/`, `/welcome`) are unaffected.
- Remotion render scripts additionally need `ffmpeg`/Chromium; only relevant when generating video assets.
- Note: `pnpm lint` currently reports a few pre-existing errors in app code (unrelated to environment setup); the lint tooling itself works and `pnpm build` passes cleanly.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
