import { internalMutation } from "./_generated/server";

/**
 * Seeds the database with sample users, teams, projects, and social posts
 * for testing the /admin route.
 *
 * Run: npx convex run seed:seed
 *
 * Prerequisites:
 * 1. Set ADMIN_EMAILS in Convex Dashboard (Settings → Environment Variables)
 *    e.g. ADMIN_EMAILS=your@email.com
 * 2. Sign in at /login with that email so your user exists in `users` table
 * 3. Run this seed
 */
export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // 1. Get or create seed user (for createdBy on teams)
    let seedUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", "seed|seed@hackathon.local"))
      .unique();

    if (!seedUser) {
      const id = await ctx.db.insert("users", {
        tokenIdentifier: "seed|seed@hackathon.local",
        name: "Seed User",
        email: "seed@hackathon.local",
        createdAt: now,
      });
      seedUser = (await ctx.db.get(id))!;
    }

    // 2. Create teams
    const teamAlpha = await ctx.db.insert("teams", {
      name: "Team Alpha",
      members: [
        { name: "Alice Chen", email: "alice@example.com" },
        { name: "Bob Martinez" },
        { name: "Carol Kim", email: "carol@example.com" },
      ],
      leaderIndex: 0,
      createdBy: seedUser._id,
      createdAt: now,
    });

    const teamBeta = await ctx.db.insert("teams", {
      name: "Team Beta",
      members: [
        { name: "Diana Ross", email: "diana@example.com" },
        { name: "Eve Torres" },
      ],
      leaderIndex: 0,
      createdBy: seedUser._id,
      createdAt: now,
    });

    const teamGamma = await ctx.db.insert("teams", {
      name: "Team Gamma",
      members: [
        { name: "Frank Lee" },
        { name: "Grace Park", email: "grace@example.com" },
        { name: "Henry Wu" },
      ],
      leaderIndex: 1,
      createdBy: seedUser._id,
      createdAt: now,
    });

    // 3. Create projects
    await ctx.db.insert("projects", {
      teamId: teamAlpha,
      name: "AI Recipe Finder",
      track: "ai_consumer",
      description:
        "An AI-powered app that suggests recipes based on ingredients you have at home. Uses computer vision to scan your fridge and recommends meals that reduce food waste.",
      pitchSummary:
        "We tackle food waste by helping users cook with what they have. Our AI understands ingredient substitutions and dietary preferences.",
      techStack: "React, Convex, OpenAI API, TensorFlow Lite",
      teamRoles: "Alice: Full-stack, Bob: ML, Carol: UX",
      repoLink: "https://github.com/example/recipe-finder",
      demoLink: "https://recipe-finder-demo.vercel.app",
      createdAt: now,
    });

    await ctx.db.insert("projects", {
      teamId: teamAlpha,
      name: "FinTrack Pro",
      track: "fintech_web3",
      description:
        "Personal finance dashboard with crypto portfolio tracking. Aggregates bank accounts, investments, and DeFi positions in one place.",
      pitchSummary:
        "One dashboard for all your money. We integrate traditional banking APIs with on-chain data for a complete financial picture.",
      techStack: "Next.js, Convex, Plaid, Ethers.js",
      teamRoles: "Alice: Backend, Bob: Frontend, Carol: Integrations",
      repoLink: "https://github.com/example/fintrack",
      createdAt: now,
    });

    await ctx.db.insert("projects", {
      teamId: teamBeta,
      name: "ChatDoc",
      track: "ai_consumer",
      description:
        "Chat with your documents. Upload PDFs and ask questions. Uses RAG to ground answers in your files.",
      pitchSummary:
        "Knowledge workers waste hours searching through documents. ChatDoc gives instant, cited answers from your own docs.",
      techStack: "Vue, Convex, LangChain, Pinecone",
      teamRoles: "Diana: AI/ML, Eve: Frontend",
      demoLink: "https://chatdoc-demo.vercel.app",
      createdAt: now,
    });

    await ctx.db.insert("projects", {
      teamId: teamGamma,
      name: "PaySplit",
      track: "fintech_web3",
      description:
        "Split bills and settle up with friends using stablecoins. No more Venmo fees or bank delays.",
      pitchSummary:
        "Crypto for everyday payments. We use USDC for instant, low-fee splits that work across borders.",
      techStack: "React Native, Convex, Circle USDC API",
      teamRoles: "Frank: Mobile, Grace: Backend, Henry: Smart contracts",
      createdAt: now,
    });

    // 4. Create social posts for teams
    await ctx.db.insert("social_posts", {
      teamId: teamAlpha,
      platform: "x",
      url: "https://x.com/teamalpha/status/123",
      createdAt: now,
    });
    await ctx.db.insert("social_posts", {
      teamId: teamAlpha,
      platform: "linkedin",
      url: "https://linkedin.com/feed/update/urn:li:activity:123",
      createdAt: now,
    });
    await ctx.db.insert("social_posts", {
      teamId: teamBeta,
      platform: "x",
      url: "https://x.com/teambeta/status/456",
      createdAt: now,
    });

    return {
      users: 1,
      teams: 3,
      projects: 4,
      socialPosts: 3,
    };
  },
});
