import path from 'path';

const nextConfig = {
  webpack(config: any) {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
