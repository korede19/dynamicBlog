import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from './firebase'; // Your Firebase config

// Define the BlogPost interface to match your component
interface FirestoreTimestamp {
  toDate: () => Date;
}

interface BlogPost {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
  categoryId: string;
  createdAt: Date | FirestoreTimestamp;
  updatedAt: Date | FirestoreTimestamp;
  slug?: string;
}

// Cache for posts to reduce Firestore calls
const postsCache = new Map<string, { data: BlogPost[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check if cache is valid
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION;
};

// Helper function to safely convert document data
const convertDocumentToPost = (doc: DocumentSnapshot): BlogPost | null => {
  try {
    if (!doc.exists()) return null;
    
    const data = doc.data() as DocumentData;
    return {
      id: doc.id,
      title: data.title || '',
      imageUrl: data.imageUrl || '',
      content: data.content || '',
      categoryId: data.categoryId || '',
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
      slug: data.slug || doc.id
    };
  } catch (error) {
    console.error('Error converting document to post:', error);
    return null;
  }
};

// Helper function to safely convert query snapshot
const convertQuerySnapshotToPosts = (querySnapshot: QuerySnapshot): BlogPost[] => {
  const posts: BlogPost[] = [];
  
  querySnapshot.docs.forEach(doc => {
    const post = convertDocumentToPost(doc);
    if (post) {
      posts.push(post);
    }
  });
  
  return posts;
};

// Fetch posts by category with caching and error handling
export const fetchPostsByCategory = async (
  categoryId: string, 
  limitCount: number = 10
): Promise<BlogPost[]> => {
  const cacheKey = `category-${categoryId}-${limitCount}`;
  
  // Check cache first
  const cached = postsCache.get(cacheKey);
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    // Create a query that filters by category and orders by creation date (newest first)
    const postsQuery = query(
      collection(db, 'posts'),
      where('categoryId', '==', categoryId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(postsQuery);
    const posts = convertQuerySnapshotToPosts(querySnapshot);
    
    // Cache the results
    postsCache.set(cacheKey, {
      data: posts,
      timestamp: Date.now()
    });

    return posts;
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    
    // Return cached data if available, even if expired
    const cachedData = postsCache.get(cacheKey);
    if (cachedData) {
      console.warn('Using expired cache data due to error');
      return cachedData.data;
    }
    
    return [];
  }
};

// Fetch all posts with caching and performance optimization
export const fetchAllPosts = async (limitCount: number = 50): Promise<BlogPost[]> => {
  const cacheKey = `all-posts-${limitCount}`;
  
  // Check cache first
  const cached = postsCache.get(cacheKey);
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(postsQuery);
    const posts = convertQuerySnapshotToPosts(querySnapshot);
    
    // Cache the results
    postsCache.set(cacheKey, {
      data: posts,
      timestamp: Date.now()
    });

    return posts;
  } catch (error) {
    console.error('Error fetching all posts:', error);
    
    // Return cached data if available, even if expired
    const cachedData = postsCache.get(cacheKey);
    if (cachedData) {
      console.warn('Using expired cache data due to error');
      return cachedData.data;
    }
    
    return [];
  }
};

// Fetch recent posts with better error handling
export const fetchRecentPosts = async (limitCount: number = 10): Promise<BlogPost[]> => {
  const cacheKey = `recent-posts-${limitCount}`;
  
  // Check cache first
  const cached = postsCache.get(cacheKey);
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(postsQuery);
    const posts = convertQuerySnapshotToPosts(querySnapshot);
    
    // Cache the results
    postsCache.set(cacheKey, {
      data: posts,
      timestamp: Date.now()
    });

    return posts;
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    
    // Fallback to fetchAllPosts if recent posts fail
    try {
      const allPosts = await fetchAllPosts(limitCount);
      return allPosts.slice(0, limitCount);
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return [];
    }
  }
};

// Optimized fetch posts by multiple categories
export const fetchPostsByCategories = async (
  categoryIds: string[], 
  limitCount: number = 10
): Promise<BlogPost[]> => {
  if (!categoryIds || categoryIds.length === 0) {
    return [];
  }

  const cacheKey = `categories-${categoryIds.sort().join(',')}-${limitCount}`;
  
  // Check cache first
  const cached = postsCache.get(cacheKey);
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    // Use Promise.allSettled for better error handling
    const postsPerCategory = Math.ceil(limitCount / categoryIds.length);
    const categoryPromises = categoryIds.map(categoryId => 
      fetchPostsByCategory(categoryId, postsPerCategory)
    );

    const results = await Promise.allSettled(categoryPromises);
    
    // Extract successful results and flatten
    const allPosts: BlogPost[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allPosts.push(...result.value);
      } else {
        console.error(`Failed to fetch posts for category ${categoryIds[index]}:`, result.reason);
      }
    });
    
    // Sort by creation date (newest first) and limit
    const sortedPosts = allPosts.sort((a, b) => {
      try {
        const dateA = "toDate" in a.createdAt ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = "toDate" in b.createdAt ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      } catch (error) {
        console.error('Error sorting posts by date:', error);
        return 0;
      }
    });

    const limitedPosts = sortedPosts.slice(0, limitCount);
    
    // Cache the results
    postsCache.set(cacheKey, {
      data: limitedPosts,
      timestamp: Date.now()
    });

    return limitedPosts;
  } catch (error) {
    console.error('Error fetching posts by categories:', error);
    return [];
  }
};

// Function to search posts (for the search component)
export const searchPosts = async (searchQuery: string, limitCount: number = 20): Promise<BlogPost[]> => {
  if (!searchQuery.trim()) return [];

  try {
    // For now, fetch all posts and filter client-side
    // For production, consider using Algolia or similar for full-text search
    const allPosts = await fetchAllPosts(100);
    
    const query = searchQuery.toLowerCase();
    const filteredPosts = allPosts.filter(post => {
      const searchableText = `${post.title} ${post.content} ${post.categoryId}`.toLowerCase();
      return searchableText.includes(query);
    });

    return filteredPosts.slice(0, limitCount);
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
};

// Function to clear cache (useful for admin operations)
export const clearPostsCache = (): void => {
  postsCache.clear();
  console.log('Posts cache cleared');
};

// Function to get specific post by slug or ID
export const fetchPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const cacheKey = `post-${slug}`;
  
  // Check cache first
  const cached = postsCache.get(cacheKey);
  if (cached && isCacheValid(cached.timestamp) && cached.data.length > 0) {
    return cached.data[0];
  }

  try {
    // Try to find by slug first
    let postsQuery = query(
      collection(db, 'posts'),
      where('slug', '==', slug),
      limit(1)
    );

    let querySnapshot = await getDocs(postsQuery);
    
    // If not found by slug, try by ID
    if (querySnapshot.empty) {
      postsQuery = query(
        collection(db, 'posts'),
        where('__name__', '==', slug),
        limit(1)
      );
      querySnapshot = await getDocs(postsQuery);
    }

    if (!querySnapshot.empty) {
      const post = convertDocumentToPost(querySnapshot.docs[0]);
      if (post) {
        // Cache the result
        postsCache.set(cacheKey, {
          data: [post],
          timestamp: Date.now()
        });
        return post;
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
};

// Export types
export type { BlogPost, FirestoreTimestamp };