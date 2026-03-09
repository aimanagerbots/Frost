import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@frost/types", "@frost/tokens", "@frost/ui"],
  turbopack: {
    // Isolate file watcher from sibling apps
    resolveAlias: {},
  },
};

export default nextConfig;
