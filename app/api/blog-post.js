import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  try {
    console.log('🔍 Fetching blog posts from Firestore...');
    
    // Get all posts from the 'posts' collection
    const postsRef = collection(db, 'posts');
    const snapshot = await getDocs(postsRef);
    
    const blogPosts = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      
      // Only include posts with title and slug
      if (data.title && data.slug) {
        blogPosts.push({
          slug: data.slug,
          title: data.title,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || 
                     data.createdAt?.toDate?.()?.toISOString() || 
                     new Date().toISOString(),
        });
      }
    });
    
    console.log(`✅ Found ${blogPosts.length} blog posts`);
    
    res.status(200).json({
      success: true,
      count: blogPosts.length,
      posts: blogPosts
    });
    
  } catch (error) {
    console.error('❌ Error fetching blog posts:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      posts: []
    });
  }
}