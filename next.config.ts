import path from 'path';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  staticPageGenerationTimeout: 180,
  
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048], 
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, 
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
  },

  compress: true, 
  poweredByHeader: false,
  generateEtags: true,

  experimental: {
    optimizeCss: true, 
    scrollRestoration: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'], 
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  async headers() {
    return [
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

      // Add bundle size limits to catch performance issues early
      config.performance = {
        maxAssetSize: 250000, // 250kb limit for individual assets
        maxEntrypointSize: 400000, // 400kb limit for entry points
        hints: 'warning',
      };
    }

    // Add module resolution optimizations
    config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];
    
    return config;
  },

  swcMinify: true, 
  async redirects() {
    return [
    ];
  },
};

export default nextConfig;