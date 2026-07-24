import type { NextConfig } from "next";

// Set NEXT_PUBLIC_BASE_PATH to the repo subpath (e.g. "/tdoma-ppp") when
// deploying to GitHub Pages project sites. Leave empty for local dev and
// root-domain hosts (Vercel, Netlify, `serve out`).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: basePath || undefined,
  trailingSlash: true,
};

export default nextConfig;
