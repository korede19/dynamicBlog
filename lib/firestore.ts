// In your lib/firestore.js or lib/firestore.ts file

import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  DocumentData
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

export const fetchPostsByCategory = async (categoryId: string, limitCount: number = 10): Promise<BlogPost[]> => {
  try {
    // Create a query that filters by category and orders by creation date (newest first)
    const postsQuery = query(
      collection(db, 'posts'), // Replace 'posts' with your actual collection name
      where('categoryId', '==', categoryId),
      orderBy('createdAt', 'desc'), // Order by creation date, newest first
      limit(limitCount) // Limit the number of posts returned
    );

    const querySnapshot = await getDocs(postsQuery);
    
    const posts: BlogPost[] = querySnapshot.docs.map(doc => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        title: data.title || '',
        imageUrl: data.imageUrl || '',
        content: data.content || '',
        categoryId: data.categoryId || '',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        slug: data.slug
      } as BlogPost;
    });

    return posts;
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    throw error;
  }
};

// Alternative: If you want to fetch by updatedAt instead of createdAt
export const fetchPostsByCategoryByUpdated = async (categoryId: string, limitCount: number = 10) => {
  try {
    const postsQuery = query(
      collection(db, 'posts'),
      where('categoryId', '==', categoryId),
      orderBy('updatedAt', 'desc'), // Order by update date instead
      limit(limitCount)
    );

    const querySnapshot = await getDocs(postsQuery);
    
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return posts;
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    throw error;
  }
};