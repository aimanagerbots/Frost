import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@frost/types", "@frost/tokens", "@frost/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
