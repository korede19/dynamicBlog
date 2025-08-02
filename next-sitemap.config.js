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
    '/api/ads.txt',
  ],
  additionalPaths: async (config) => {
    const result = [];
    try {
      const blogPosts = await getBlogPosts(); 
      
      blogPosts.forEach((post) => {
        result.push({
          loc: `/blog/${post.slug}`,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: post.updatedAt || post.createdAt,
        });
      });
    } catch (error) {
      console.log('Could not fetch blog posts for sitemap:', error);
    }
    
    return result;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/create-post',
          '/admin/login',
          '/api/email',
          '/api/ads.txt',
        ],
      },
    ],
    // Add ads.txt to robots.txt
    additionalSitemaps: [
      'https://peakpurzuit.com/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    if (path.includes('/blog/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    }
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
async function getBlogPosts() {
  try {
    const admin = require('firebase-admin');
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'blogwebsite-b9161',
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        }),
      });
    }
    
    const db = admin.firestore();
    const postsSnapshot = await db.collection('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .get();
    
    const posts = [];
    postsSnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        slug: data.slug || doc.id,
        updatedAt: data.updatedAt?.toDate()?.toISOString() || data.createdAt?.toDate()?.toISOString(),
        createdAt: data.createdAt?.toDate()?.toISOString(),
      });
    });
    
    console.log(`Found ${posts.length} published blog posts for sitemap`);
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts from Firebase:', error);
    return [];
  }
}

module.exports = config;