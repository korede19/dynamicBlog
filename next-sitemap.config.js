/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://peakpurzuit.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/admin/create-post',
    '/admin/login',
    '/api/email',
    '/api/ads.txt',
    '/api/blog-posts', // Exclude the API endpoint itself
  ],
  additionalPaths: async (config) => {
    console.log('🚀 Fetching blog posts directly with client Firebase...');
    
    try {
      // Direct Firebase connection using your existing client setup
      const { initializeApp } = require('firebase/app');
      const { getFirestore, collection, getDocs } = require('firebase/firestore');
      
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      };
      
      console.log('🔥 Initializing Firebase client...');
      const app = initializeApp(firebaseConfig, 'sitemap-app');
      const db = getFirestore(app);
      
      console.log('📂 Fetching posts collection...');
      const postsRef = collection(db, 'posts');
      const snapshot = await getDocs(postsRef);
      
      if (snapshot.empty) {
        console.log('❌ No posts found in collection');
        return [];
      }
      
      console.log(`📄 Found ${snapshot.size} documents in posts collection`);
      
      const blogPosts = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        
        // Log first few documents for debugging
        if (blogPosts.length < 3) {
          console.log(`📝 Document ${doc.id}:`, {
            title: data.title,
            slug: data.slug,
            hasTitle: !!data.title,
            hasSlug: !!data.slug
          });
        }
        
        if (data.title && data.slug) {
          blogPosts.push({
            loc: `/blog/${data.slug}`,
            changefreq: 'weekly',
            priority: 0.8,
            lastmod: data.updatedAt?.toDate?.()?.toISOString() || 
                     data.createdAt?.toDate?.()?.toISOString() || 
                     new Date().toISOString(),
          });
        } else {
          console.log(`⚠️ Skipping document ${doc.id} - missing title or slug`);
        }
      });
      
      console.log(`✅ Successfully processed ${blogPosts.length} blog posts for sitemap`);
      return blogPosts;
      
    } catch (error) {
      console.error('💥 Firebase client error:', error.message);
      console.error('Full error:', error);
      return [];
    }
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

module.exports = config;