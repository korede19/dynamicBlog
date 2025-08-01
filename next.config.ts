import path from 'path';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  
  // Image optimization configuration
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'], // Modern formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048], // Responsive breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Icon/thumbnail sizes
    minimumCacheTTL: 31536000, // Cache images for 1 year
    dangerouslyAllowSVG: false, // Security: disable SVG optimization
    contentDispositionType: 'attachment',
  },

  // Compression and performance
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header for security
  generateEtags: true, // Enable ETags for better caching

  // Experimental features for better performance
  experimental: {
    optimizeCss: true, // Optimize CSS
    scrollRestoration: true, // Better scroll behavior
    legacyBrowsers: false, // Don't support IE11
    browsersListForSwc: true, // Use modern browsers list
  },

  // Headers for caching and security
  async headers() {
    return [
      // Cache static assets aggressively
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache images from Next.js image optimization
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache fonts
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Security headers
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Webpack optimizations (renamed to avoid conflict)
  webpack: (config: any, { buildId, dev, isServer, defaultLoaders, webpack }: any) => {
    // Your existing alias
    config.resolve.alias['@'] = path.resolve(__dirname);

    // Production optimizations
    if (!dev) {
      // Tree shaking and dead code elimination
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;

      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;