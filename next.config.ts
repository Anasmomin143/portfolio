import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // TypeScript configuration - ignore build errors for development
  typescript: {
    // ⚠️ This allows production builds to successfully complete even if
    // your project has TypeScript errors. Remove this before deploying!
    ignoreBuildErrors: true,
  },

  // Image optimization configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
      // Add more remote patterns as needed for external images
    ],
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Development settings to reduce errors
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  // Webpack configuration for better HMR
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Improve HMR stability
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay rebuild after the first change
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
