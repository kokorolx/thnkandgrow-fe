import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for static export with standalone mode
  output: 'standalone',
  // Image optimization
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Enable compression
  compress: true,
};

export default nextConfig;
