import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  doc,
  getDoc,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
  startAfter,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

// Interfaces
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

// Enhanced caching with LRU-like behavior
class PostsCache {
  private cache = new Map<string, { data: any, timestamp: number, hits: number }>();
  private readonly maxSize = 100;
  private readonly cacheDuration = 3 * 60 * 1000; // 3 minutes for better performance

  get(key: string) {
    const item = this.cache.get(key);
    if (item && this.isValid(item.timestamp)) {
      item.hits++;
      return item.data;
    }
    if (item) this.cache.delete(key);
    return null;
  }

  set(key: string, data: any) {
    // LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      const leastUsed = this.findLeastUsedKey();
      if (leastUsed) this.cache.delete(leastUsed);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 1
    });
  }

  private isValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheDuration;
  }

  private findLeastUsedKey(): string | null {
    let minHits = Infinity;
    let leastUsedKey = null;

    for (const [key, value] of this.cache.entries()) {
      if (value.hits < minHits) {
        minHits = value.hits;
        leastUsedKey = key;
      }
    }

    return leastUsedKey;
  }

  clear() {
    this.cache.clear();
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    return item ? this.isValid(item.timestamp) : false;
  }
}

const cache = new PostsCache();

// Optimized document conversion with minimal processing
const convertDoc = (doc: DocumentSnapshot | QueryDocumentSnapshot): BlogPost | null => {
  if (!doc.exists()) return null;
  
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title ?? '',
    imageUrl: data.imageUrl ?? '',
    content: data.content ?? '',
    categoryId: data.categoryId ?? '',
    createdAt: data.createdAt ?? new Date(),
    updatedAt: data.updatedAt ?? new Date(),
    slug: data.slug ?? doc.id
  };
};

// Batch convert with error resilience
const convertQuerySnapshot = (snapshot: QuerySnapshot): BlogPost[] => {
  const posts: BlogPost[] = [];
  snapshot.docs.forEach(doc => {
    try {
      const post = convertDoc(doc);
      if (post) posts.push(post);
    } catch (error) {
      console.warn(`Failed to convert doc ${doc.id}:`, error);
    }
  });
  return posts;
};

// Core fetch function with connection pooling and retries
const executeQuery = async (
  queryFn: () => Promise<QuerySnapshot>,
  cacheKey: string,
  maxRetries = 2
): Promise<BlogPost[]> => {
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const snapshot = await queryFn();
      const posts = convertQuerySnapshot(snapshot);
      
      // Cache successful results
      cache.set(cacheKey, posts);
      return posts;
      
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
  }

  console.error('Query failed after retries:', lastError);
  return [];
};

// Optimized category posts with composite index support
export const fetchPostsByCategory = async (
  categoryId: string, 
  limitCount = 10
): Promise<BlogPost[]> => {
  const cacheKey = `cat:${categoryId}:${limitCount}`;
  
  return executeQuery(async () => {
    return getDocs(query(
      collection(db, 'posts'),
      where('categoryId', '==', categoryId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    ));
  }, cacheKey);
};

// High-performance all posts with pagination support
export const fetchAllPosts = async (
  limitCount = 20,
  lastVisible?: QueryDocumentSnapshot
): Promise<{ posts: BlogPost[], lastDoc?: QueryDocumentSnapshot }> => {
  const cacheKey = `all:${limitCount}:${lastVisible?.id || 'start'}`;
  
  // For pagination, skip cache on subsequent pages
  if (!lastVisible) {
    const cached = cache.get(cacheKey);
    if (cached) return { posts: cached };
  }

  try {
    let q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    if (lastVisible) {
      q = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(limitCount)
      );
    }

    const snapshot = await getDocs(q);
    const posts = convertQuerySnapshot(snapshot);
    
    if (!lastVisible) {
      cache.set(cacheKey, posts);
    }

    return {
      posts,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] as QueryDocumentSnapshot
    };
    
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return { posts: [] };
  }
};

// Optimized recent posts (using updatedAt for better cache efficiency)
export const fetchRecentPosts = async (limitCount = 10): Promise<BlogPost[]> => {
  const cacheKey = `recent:${limitCount}`;
  
  return executeQuery(async () => {
    return getDocs(query(
      collection(db, 'posts'),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    ));
  }, cacheKey);
};

// Parallel category fetching with better resource management
export const fetchPostsByCategories = async (
  categoryIds: string[], 
  limitCount = 10
): Promise<BlogPost[]> => {
  if (!categoryIds?.length) return [];

  const cacheKey = `cats:${categoryIds.sort().join(',')}:${limitCount}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    // Limit concurrent requests to avoid overwhelming Firestore
    const batchSize = 3;
    const postsPerCategory = Math.ceil(limitCount / categoryIds.length);
    const allPosts: BlogPost[] = [];

    for (let i = 0; i < categoryIds.length; i += batchSize) {
      const batch = categoryIds.slice(i, i + batchSize);
      const batchPromises = batch.map(categoryId => 
        fetchPostsByCategory(categoryId, postsPerCategory)
      );

      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allPosts.push(...result.value);
        } else {
          console.warn(`Category ${batch[index]} failed:`, result.reason);
        }
      });
    }

    // Efficient sorting and limiting
    const sortedPosts = allPosts
      .sort((a, b) => {
        const getTime = (date: Date | FirestoreTimestamp) => 
          'toDate' in date ? date.toDate().getTime() : new Date(date).getTime();
        return getTime(b.createdAt) - getTime(a.createdAt);
      })
      .slice(0, limitCount);

    cache.set(cacheKey, sortedPosts);
    return sortedPosts;

  } catch (error) {
    console.error('Error fetching posts by categories:', error);
    return [];
  }
};

// Optimized single post fetch with direct document access
export const fetchPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const cacheKey = `post:${slug}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached[0] || null;

  try {
    // Try direct document access first (fastest)
    const docRef = doc(db, 'posts', slug);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const post = convertDoc(docSnap);
      if (post) {
        cache.set(cacheKey, [post]);
        return post;
      }
    }

    // Fallback to slug query
    const slugQuery = query(
      collection(db, 'posts'),
      where('slug', '==', slug),
      limit(1)
    );

    const snapshot = await getDocs(slugQuery);
    if (!snapshot.empty) {
      const post = convertDoc(snapshot.docs[0]);
      if (post) {
        cache.set(cacheKey, [post]);
        return post;
      }
    }

    return null;

  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
};

// Lightweight search with better client-side filtering
export const searchPosts = async (
  searchQuery: string, 
  limitCount = 20
): Promise<BlogPost[]> => {
  if (!searchQuery.trim()) return [];

  const cacheKey = `search:${searchQuery.toLowerCase()}:${limitCount}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    // Use recent posts for search to reduce data transfer
    const posts = await fetchRecentPosts(50);
    const query = searchQuery.toLowerCase();
    
    const filtered = posts
      .filter(post => {
        const searchText = `${post.title} ${post.content}`.toLowerCase();
        return searchText.includes(query);
      })
      .slice(0, limitCount);

    cache.set(cacheKey, filtered);
    return filtered;

  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

// Utility functions
export const clearCache = (): void => cache.clear();
export const warmupCache = async (): Promise<void> => {
  // Preload most common queries
  await Promise.allSettled([
    fetchRecentPosts(10),
    fetchAllPosts(20)
  ]);
};

// Types export
export type { BlogPost, FirestoreTimestamp };