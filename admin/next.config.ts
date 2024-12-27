import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
