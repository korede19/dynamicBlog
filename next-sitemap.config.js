/** @type {import('next-sitemap').IConfig} */
const config = {
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
    '/blog/*',
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
          '/blog/',
        ],
      },
    ],
  },
};

module.exports = config;
