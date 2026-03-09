import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@frost/types", "@frost/tokens", "@frost/ui"],
  turbopack: {},
};

export default nextConfig;
