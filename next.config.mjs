/** @type {import('next').NextConfig} */
// Base path is env-driven so the same build works in two places:
//   - GitHub Pages (project site) needs the "/web7" prefix (the default)
//   - Netlify serves at the domain root, so it sets PAGES_BASE_PATH=""
const basePath = process.env.PAGES_BASE_PATH ?? "/web7";

const nextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
