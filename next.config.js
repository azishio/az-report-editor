/** @type {import("next").NextConfig} */

let nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

if (process.env.ANALYZE === "true" && process.env.NODE_ENV === "production") {
  const withNextBundleAnalyzer = require("next-bundle-analyzer")(/* options come there */);
  nextConfig = withNextBundleAnalyzer(nextConfig);
}

module.exports = nextConfig;
