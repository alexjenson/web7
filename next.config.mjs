/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/web7",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
