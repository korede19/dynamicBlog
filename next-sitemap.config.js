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
  ],
  additionalPaths: async (config) => {
    console.log('🔍 Fetching blog posts from Firebase...');
    
    try {
      const admin = require('firebase-admin');
      
      // Initialize Firebase Admin
      if (!admin.apps.length) {
        if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
          console.log('❌ Missing Firebase Admin credentials');
          return [];
        }
        
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: 'blogwebsite-b9161',
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          }),
        });
        console.log('✅ Firebase Admin initialized');
      }
      
      const db = admin.firestore();
      
      // Try your specific collection first
      const collectionName = 'posts';
      
      try {
        console.log(`🔍 Fetching from '${collectionName}' collection...`);
        
        // Get all documents from posts collection
        const snapshot = await db.collection(collectionName).get();
        
        if (!snapshot.empty) {
          console.log(`✅ Found '${collectionName}' collection with ${snapshot.size} documents`);
          
          const blogPosts = [];
          
          snapshot.forEach((doc) => {
            const data = doc.data();
            
            // Log the first document structure for debugging
            if (blogPosts.length === 0) {
              console.log(`📄 Sample document fields:`, Object.keys(data));
            }
            
            // Check if document has the required fields
            if (data.title && data.slug) {
              blogPosts.push({
                loc: `/blog/${data.slug}`,
                changefreq: 'weekly',
                priority: 0.8,
                lastmod: data.updatedAt?.toDate?.()?.toISOString() || 
                         data.createdAt?.toDate?.()?.toISOString() || 
                         new Date().toISOString(),
              });
              
              if (blogPosts.length <= 5) { // Log first 5 posts
                console.log(`📝 Added blog post: /blog/${data.slug}`);
              }
            } else {
              console.log(`⚠️ Document ${doc.id} missing title or slug`);
            }
          });
          
          console.log(`🎉 Successfully added ${blogPosts.length} blog posts to sitemap`);
          return blogPosts;
          
        } else {
          console.log(`❌ Collection '${collectionName}' is empty`);
          return [];
        }
        
      } catch (collectionError) {
        console.error(`💥 Error accessing '${collectionName}' collection:`, collectionError.message);
        console.error('Full error:', collectionError);
        return [];
      }
      
    } catch (error) {
      console.error('💥 Firebase error:', error.message);
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