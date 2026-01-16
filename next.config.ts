import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
    ],
    // Allow unoptimized images for external URLs in production
    unoptimized: process.env.NODE_ENV === 'production' ? false : false,
  },
  // Enable experimental features for better performance
  experimental: {
    // optimizeCss: true, // Uncomment if you want CSS optimization
  },
  // Ensure proper handling of dynamic routes
  trailingSlash: false,
  // Disable strict mode for third-party libraries (Three.js, etc.)
  reactStrictMode: false,
};

export default nextConfig;
