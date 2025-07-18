import path from 'path';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
   images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;