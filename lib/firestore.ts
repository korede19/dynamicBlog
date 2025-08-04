import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  doc,
  getDoc,
  QuerySnapshot,
  DocumentSnapshot,
  startAfter,
  QueryDocumentSnapshot,
  Query
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

interface CacheItem {
  data: BlogPost[];
  timestamp: number;
  hits: number;
}

interface FetchResult {
  posts: BlogPost[];
  lastDoc?: QueryDocumentSnapshot;
}

// Enhanced caching with SSR-friendly timeout handling
class PostsCache {
  private cache = new Map<string, CacheItem>();
  private readonly maxSize = 100;
  private readonly cacheDuration = 5 * 60 * 1000; // 5 minutes for SSR stability

  get(key: string): BlogPost[] | null {
    const item = this.cache.get(key);
    if (item && this.isValid(item.timestamp)) {
      item.hits++;
      return item.data;
    }
    if (item) this.cache.delete(key);
    return null;
  }

  set(key: string, data: BlogPost[]): void {
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
    let leastUsedKey: string | null = null;

    for (const [key, value] of this.cache.entries()) {
      if (value.hits < minHits) {
        minHits = value.hits;
        leastUsedKey = key;
      }
    }

    return leastUsedKey;
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    return item ? this.isValid(item.timestamp) : false;
  }
}

const cache = new PostsCache();

// Create a proper mock QuerySnapshot
const createEmptyQuerySnapshot = (): QuerySnapshot => {
  const mockQuery = {} as Query;
  
  return {
    docs: [],
    size: 0,
    empty: true,
    metadata: {
      hasPendingWrites: false,
      fromCache: true,
      isEqual: () => true
    },
    query: mockQuery,
    forEach: () => {},
    docChanges: () => []
  } as QuerySnapshot;
};

// SSR-optimized timeout wrapper with safer fallback handling
const withTimeout = async <T>(
  promise: Promise<T>, 
  timeoutMs: number = 15000,
  fallbackValue?: T
): Promise<T | null> => {
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);
  } catch (error) {
    console.warn('Query timeout or error:', error instanceof Error ? error.message : 'Unknown error');
    return fallbackValue ?? null;
  }
};

// Safer timeout wrapper specifically for QuerySnapshot
const withQueryTimeout = async (
  promise: Promise<QuerySnapshot>, 
  timeoutMs: number = 15000
): Promise<QuerySnapshot> => {
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);
  } catch (error) {
    console.warn('Query timeout, returning empty results:', error instanceof Error ? error.message : 'Unknown error');
    return createEmptyQuerySnapshot();
  }
};

// Safer timeout wrapper specifically for DocumentSnapshot
const withDocTimeout = async (
  promise: Promise<DocumentSnapshot>, 
  timeoutMs: number = 15000
): Promise<DocumentSnapshot | null> => {
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);
  } catch (error) {
    console.warn('Document fetch timeout:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
};

// Optimized document conversion with minimal processing
const convertDoc = (doc: DocumentSnapshot | QueryDocumentSnapshot): BlogPost | null => {
  if (!doc.exists()) return null;
  
  const data = doc.data();
  if (!data) return null;

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

// Core fetch function with SSR-friendly timeout and connection pooling
const executeQuery = async (
  queryFn: () => Promise<QuerySnapshot>,
  cacheKey: string,
  maxRetries = 1,
  isSSR = false
): Promise<BlogPost[]> => {
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Use shorter timeout for SSR to prevent page timeouts
      const timeoutMs = isSSR ? 10000 : 15000;
      const snapshot = await withQueryTimeout(queryFn(), timeoutMs);
      const posts = convertQuerySnapshot(snapshot);
      
      // Cache successful results
      cache.set(cacheKey, posts);
      return posts;
      
    } catch (error) {
      lastError = error as Error;
      
      // Skip retries in SSR for speed
      if (attempt < maxRetries && !isSSR) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
  }

  console.error('Query failed after retries:', lastError);
  return [];
};

// SSR-optimized category posts
export const fetchPostsByCategory = async (
  categoryId: string, 
  limitCount = 10,
  isSSR = false
): Promise<BlogPost[]> => {
  const cacheKey = `cat:${categoryId}:${limitCount}`;
  
  return executeQuery(async () => {
    return getDocs(query(
      collection(db, 'posts'),
      where('categoryId', '==', categoryId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    ));
  }, cacheKey, 1, isSSR);
};

// SSR-optimized all posts with faster fallback
export const fetchAllPosts = async (
  limitCount = 20,
  lastVisible?: QueryDocumentSnapshot,
  isSSR = false
): Promise<FetchResult> => {
  const cacheKey = `all:${limitCount}:${lastVisible?.id || 'start'}`;
  
  // For SSR, always check cache first and return immediately if available
  if (isSSR && !lastVisible) {
    const cached = cache.get(cacheKey);
    if (cached) return { posts: cached };
  }

  try {
    // Use shorter timeout for SSR
    const timeoutMs = isSSR ? 8000 : 15000;
    
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

    const snapshot = await withQueryTimeout(getDocs(q), timeoutMs);
    const posts = convertQuerySnapshot(snapshot);
    
    if (!lastVisible) {
      cache.set(cacheKey, posts);
    }

    const lastDoc = snapshot.docs.length > 0 
      ? snapshot.docs[snapshot.docs.length - 1] as QueryDocumentSnapshot
      : undefined;

    return { posts, lastDoc };
    
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return { posts: [] };
  }
};

// SSR-optimized recent posts
export const fetchRecentPosts = async (
  limitCount = 10, 
  isSSR = false
): Promise<BlogPost[]> => {
  const cacheKey = `recent:${limitCount}`;
  
  return executeQuery(async () => {
    return getDocs(query(
      collection(db, 'posts'),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    ));
  }, cacheKey, 1, isSSR);
};

// SSR-optimized single post fetch
export const fetchPostBySlug = async (
  slug: string, 
  isSSR = false
): Promise<BlogPost | null> => {
  const cacheKey = `post:${slug}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.length > 0) return cached[0];

  try {
    // Very short timeout for single post in SSR
    const timeoutMs = isSSR ? 5000 : 10000;
    
    // Try direct document access first (fastest)
    const docRef = doc(db, 'posts', slug);
    const docSnap = await withDocTimeout(getDoc(docRef), timeoutMs);
    
    if (docSnap?.exists()) {
      const post = convertDoc(docSnap);
      if (post) {
        cache.set(cacheKey, [post]);
        return post;
      }
    }

    // Skip slug query fallback in SSR to prevent timeout
    if (isSSR) {
      return null;
    }

    // Fallback to slug query (only for client-side)
    const slugQuery = query(
      collection(db, 'posts'),
      where('slug', '==', slug),
      limit(1)
    );

    const snapshot = await withQueryTimeout(getDocs(slugQuery), timeoutMs);
    
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

// Lightweight search optimized for client-side only
export const searchPosts = async (
  searchQuery: string, 
  limitCount = 20
): Promise<BlogPost[]> => {
  const trimmedQuery = searchQuery.trim();
  if (!trimmedQuery) return [];

  const cacheKey = `search:${trimmedQuery.toLowerCase()}:${limitCount}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    // Use cached recent posts for search to avoid additional queries
    const posts = await fetchRecentPosts(30, false); // Never call in SSR
    const query = trimmedQuery.toLowerCase();
    
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

// SSR-specific optimized functions
export const fetchPostsForSSR = async (limitCount = 10): Promise<BlogPost[]> => {
  // Try cache first
  const cacheKey = `ssr:recent:${limitCount}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    // Very aggressive timeout for SSR
    const snapshot = await withQueryTimeout(
      getDocs(query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )),
      5000 // 5 second timeout
    );

    const posts = convertQuerySnapshot(snapshot);
    cache.set(cacheKey, posts);
    return posts;

  } catch (error) {
    console.warn('SSR fetch failed, returning empty array:', error);
    return [];
  }
};

export const fetchPostBySlugForSSR = async (slug: string): Promise<BlogPost | null> => {
  const cacheKey = `ssr:post:${slug}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.length > 0) return cached[0];

  try {
    // Ultra-fast SSR timeout
    const docRef = doc(db, 'posts', slug);
    const docSnap = await withDocTimeout(getDoc(docRef), 3000); // 3 second timeout for SSR
    
    if (docSnap?.exists()) {
      const post = convertDoc(docSnap);
      if (post) {
        cache.set(cacheKey, [post]);
        return post;
      }
    }

    return null;

  } catch (error) {
    console.warn('SSR post fetch failed:', error);
    return null;
  }
};

// Connection pooling and warmup
export const warmupCache = async (): Promise<void> => {
  // Preload most common queries with timeout
  await Promise.allSettled([
    withTimeout(fetchRecentPosts(10, true), 5000),
    withTimeout(fetchAllPosts(20, undefined, true), 5000)
  ]);
};

// Utility functions
export const clearCache = (): void => cache.clear();

// Export cache stats for debugging
export const getCacheStats = () => ({
  size: cache['cache'].size,
  maxSize: cache['maxSize'],
  entries: Array.from(cache['cache'].entries()).map(([key, value]) => ({
    key,
    hits: value.hits,
    age: Date.now() - value.timestamp,
    dataSize: value.data.length
  }))
});

// Types export
export type { BlogPost, FirestoreTimestamp, FetchResult };