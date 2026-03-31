import fs from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

function normalizeSiteUrl(raw: string | undefined): string {
  const base = raw?.trim() || "http://localhost:5173";
  return base.replace(/\/+$/, "");
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = normalizeSiteUrl(env.VITE_SITE_URL);

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "seo-site-url-and-crawl-files",
        transformIndexHtml(html: string) {
          return html.replaceAll("%SITE_URL%", siteUrl);
        },
        writeBundle(options: { dir?: string }) {
          const outDir = options.dir;
          if (!outDir) return;
          const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
          fs.writeFileSync(path.join(outDir, "robots.txt"), robots, "utf8");
          const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
          fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap, "utf8");
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(process.cwd()),
      },
    },
  };
});
