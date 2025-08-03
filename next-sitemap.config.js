/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://peakpurzuit.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false, // Changed to false to avoid duplicate sitemaps
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/admin/create-post',
    '/admin/login',
    '/api/email',
    '/api/ads.txt', // Exclude the ads.txt API route
  ],
  // Add additional paths for dynamic blog pages
  additionalPaths: async (config) => {
    const result = [];
    
    // If you have a way to fetch your blog posts, add them here
    // Example for common blog structures:
    try {
      // Replace this with your actual method of fetching blog posts
      // This could be from a CMS, database, or file system
      const blogPosts = await getBlogPosts(); // You'll need to implement this
      
      blogPosts.forEach((post) => {
        result.push({
          loc: `/blog/${post.slug}`, // Adjust path based on your blog structure
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
    // Remove the duplicate sitemap reference
    additionalSitemaps: [],
  },
  // Transform function to customize URLs
  transform: async (config, path) => {
    // Customize blog post priorities and changefreq
    if (path.includes('/blog/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    }
    
    // Default transformation
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};

// Helper function for Firebase Firestore - Simplified approach
async function getBlogPosts() {
  try {
    // Try to use firebase-admin
    const admin = require('firebase-admin');
    
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      // Check if we have admin credentials
      if (process.env.FIREBASE_ADMIN_PRIVATE_KEY && process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: 'blogwebsite-b9161',
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          }),
        });
      } else {
        console.log('Firebase Admin credentials not found, skipping blog posts in sitemap');
        return [];
      }
    }
    
    const db = admin.firestore();
    
    // Try different common collection names
    const collectionNames = ['posts', 'blogs', 'articles', 'blog-posts'];
    let posts = [];
    
    for (const collectionName of collectionNames) {
      try {
        console.log(`Trying collection: ${collectionName}`);
        const snapshot = await db.collection(collectionName).limit(5).get(); // Test with small limit
        
        if (!snapshot.empty) {
          console.log(`Found collection: ${collectionName} with ${snapshot.size} documents`);
          
          // Get all published posts
          const allPostsSnapshot = await db.collection(collectionName)
            .orderBy('createdAt', 'desc')
            .get();
            
          allPostsSnapshot.forEach((doc) => {
            const data = doc.data();
            // Skip unpublished posts if published field exists
            if (data.hasOwnProperty('published') && !data.published) {
              return;
            }
            
            posts.push({
              slug: data.slug || data.title?.toLowerCase().replace(/\s+/g, '-') || doc.id,
              updatedAt: data.updatedAt?.toDate?.()?.toISOString() || 
                        data.createdAt?.toDate?.()?.toISOString() || 
                        new Date().toISOString(),
              createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            });
          });
          
          break; // Found the right collection, stop searching
        }
      } catch (error) {
        console.log(`Collection ${collectionName} not found or error:`, error.message);
        continue;
      }
    }
    
    console.log(`Successfully fetched ${posts.length} blog posts for sitemap`);
    return posts;
    
  } catch (error) {
    console.error('Error setting up Firebase Admin or fetching posts:', error.message);
    return [];
  }
}

module.exports = config;