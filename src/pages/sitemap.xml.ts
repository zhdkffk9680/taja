import type { APIRoute } from "astro";

const paths = ["/", "/position", "/words", "/short", "/long", "/english", "/record", "/guide/how-to-type-fast", "/guide/finger-position", "/guide/count-strokes", "/guide/tablet", "/about", "/privacy", "/contact"];

export const GET: APIRoute = ({ site }) => {
  const today = new Date().toISOString().slice(0, 10);
  const urls = paths
    .map((p) => `  <url><loc>${new URL(p, site).toString().replace(/\/$/, p === "/" ? "/" : "")}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml" } }
  );
};
