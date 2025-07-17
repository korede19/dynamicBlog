// next-sitemap.config.js

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://peakpurzuit.com', 
  generateRobotsTxt: true,           
  exclude: [
    '/admin/create-post',
    '/admin/login',
    '/admin/posts/edit/*',
    '/blog/*',
    '/api/email',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
        ],
      },
    ],
  },
}
