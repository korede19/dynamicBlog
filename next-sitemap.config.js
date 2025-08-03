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
  // Add additional paths for dynamic blog pages
  additionalPaths: async (config) => {
    console.log('🔍 Starting to fetch blog posts...');
    const result = [];
    
    try {
      const blogPosts = await getBlogPosts();
      console.log(`📝 Found ${blogPosts.length} blog posts`);
      
      blogPosts.forEach((post) => {
        const blogUrl = `/blog/${post.slug}`; // Update this path if different
        console.log(`➕ Adding blog post: ${blogUrl}`);
        result.push({
          loc: blogUrl,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: post.updatedAt || post.createdAt,
        });
      });
    } catch (error) {
      console.error('❌ Error in additionalPaths:', error);
    }
    
    console.log(`✅ Returning ${result.length} additional paths`);
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
    additionalSitemaps: [],
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

// Real Firebase connection
async function getBlogPosts() {
  console.log('🔧 getBlogPosts function called');
  
  console.log('📊 Environment check:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- Firebase Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  console.log('- Has Admin Private Key:', !!process.env.FIREBASE_ADMIN_PRIVATE_KEY);
  console.log('- Has Admin Client Email:', !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
  
  try {
    console.log('🔥 Attempting Firebase connection...');
    const admin = require('firebase-admin');
    
    if (!admin.apps.length) {
      if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
        console.log('❌ Missing Firebase Admin credentials - returning test posts');
        // Return test data if no credentials
        return [
          {
            slug: 'test-post-1',
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
          {
            slug: 'test-post-2', 
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          }
        ];
      }
      
      console.log('🔐 Initializing Firebase Admin...');
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: 'blogwebsite-b9161',
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        }),
      });
    }
    
    const db = admin.firestore();
    console.log('📂 Connected to Firestore');
    
    // First, let's see what collections exist
    try {
      console.log('🔍 Listing all collections...');
      const collections = await db.listCollections();
      const collectionNames = collections.map(col => col.id);
      console.log('📋 Available collections:', collectionNames);
      
      // If no collections found
      if (collectionNames.length === 0) {
        console.log('❌ No collections found in Firestore');
        return [{
          slug: 'no-collections-in-firestore',
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }];
      }
      
      // Try each collection to find blog posts
      for (const collectionName of collectionNames) {
        try {
          console.log(`🔍 Checking collection: ${collectionName}`);
          const snapshot = await db.collection(collectionName).limit(3).get();
          
          if (!snapshot.empty) {
            console.log(`✅ Found collection '${collectionName}' with ${snapshot.size} documents`);
            
            // Check if this looks like a blog collection
            const firstDoc = snapshot.docs[0];
            const firstDocData = firstDoc.data();
            const fields = Object.keys(firstDocData);
            console.log(`📄 Sample document fields:`, fields);
            
            // Look for blog-like fields
            const blogFields = ['title', 'content', 'body', 'slug', 'author'];
            const hasBlogFields = blogFields.some(field => fields.includes(field));
            
            if (hasBlogFields) {
              console.log(`🎯 Collection '${collectionName}' looks like blog posts!`);
              
              const allPosts = await db.collection(collectionName).get();
              const posts = [];
              
              allPosts.forEach((doc) => {
                const data = doc.data();
                
                // Skip unpublished posts if published field exists
                if (data.hasOwnProperty('published') && !data.published) {
                  console.log(`⏭️ Skipping unpublished post: ${doc.id}`);
                  return;
                }
                
                posts.push({
                  slug: data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || doc.id,
                  updatedAt: data.updatedAt?.toDate?.()?.toISOString() || 
                            data.createdAt?.toDate?.()?.toISOString() || 
                            new Date().toISOString(),
                  createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                });
              });
              
              console.log(`📚 Returning ${posts.length} posts from ${collectionName}`);
              return posts;
            } else {
              console.log(`⏭️ Collection '${collectionName}' doesn't look like blog posts`);
            }
          }
        } catch (collectionError) {
          console.log(`⚠️ Collection ${collectionName} error:`, collectionError.message);
        }
      }
      
      console.log('❌ No blog-like collections found');
      return [{
        slug: `found-collections-${collectionNames.join('-')}-but-no-blog-posts`,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }];
      
    } catch (listError) {
      console.error('💥 Error listing collections:', listError.message);
      return [{
        slug: 'error-listing-collections',
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }];
    }
    
  } catch (error) {
    console.error('💥 Firebase error:', error.message);
    console.log('🔄 Falling back to test posts');
    return [
      {
        slug: 'firebase-connection-failed',
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }
    ];
  }
}

module.exports = config;