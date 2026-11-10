import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@puzzlers/ui",
    "@puzzlers/design-tokens",
    "@puzzlers/schemas",
    "@puzzlers/api-client",
  ],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.puzzlers.in",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
