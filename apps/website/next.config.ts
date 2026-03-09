import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@frost/types", "@frost/tokens", "@frost/ui"],
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/products/flower", destination: "/flower", permanent: true },
      { source: "/products/flower/:slug", destination: "/flower/:slug", permanent: true },
      { source: "/products/preroll", destination: "/pre-rolls", permanent: true },
      { source: "/products/preroll/:slug", destination: "/pre-rolls/:slug", permanent: true },
      { source: "/products/vaporizer", destination: "/vaporizers", permanent: true },
      { source: "/products/vaporizer/:slug", destination: "/vaporizers/:slug", permanent: true },
      { source: "/products/concentrate", destination: "/concentrates", permanent: true },
      { source: "/products/concentrate/:slug", destination: "/concentrates/:slug", permanent: true },
      { source: "/products/edible", destination: "/edibles", permanent: true },
      { source: "/products/edible/:slug", destination: "/edibles/:slug", permanent: true },
      { source: "/products/beverage", destination: "/drinks", permanent: true },
      { source: "/products/beverage/:slug", destination: "/drinks/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
