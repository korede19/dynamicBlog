// next-sitemap.config.ts
import type { IConfig } from 'next-sitemap';

const config: IConfig = {
  siteUrl: 'https://peakpurzuit.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/admin/create-post',
    '/admin/login',
    '/api/email',
    '/blog/*', // exclude all blog slugs like /blog/some-title
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/create-post',
          '/admin/login',
          '/api/email',
          '/blog/', // or '/blog/*'
        ],
      },
    ],
  },
};

export default config;
