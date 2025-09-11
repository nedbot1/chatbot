import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use export mode only for mobile builds
  ...(process.env.NEXT_CONFIG_MODE === 'export' && { output: 'export' }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
