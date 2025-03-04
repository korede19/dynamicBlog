import { db } from './firebase'; 
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';

export interface BlogPost {
  title: string;
  categoryId: string;
  imageUrl: string;
  content: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Creates a new blog post in Firebase Firestore
 * @param postData Blog post data to be saved
 * @returns Promise with the created document reference
 */
export const createBlogPost = async (postData: BlogPost) => {
  try {
    // Add validation
    if (!postData.title) throw new Error('Title is required');
    if (!postData.content) throw new Error('Content is required');
    if (!postData.slug) throw new Error('Slug is required');
    
    // Option 1: Use auto-generated document ID
    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log('Blog post created with ID:', docRef.id);
    return docRef;
    
    // Option 2: Use slug as document ID (uncomment this if you prefer)
    /*
    const docRef = doc(db, 'posts', postData.slug);
    await setDoc(docRef, {
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log('Blog post created with slug:', postData.slug);
    return docRef;
    */
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

/**
 * Updates an existing blog post
 * @param postId The ID or slug of the post to update
 * @param postData Updated blog post data
 */
export const updateBlogPost = async (postId: string, postData: Partial<BlogPost>) => {
  try {
    const docRef = doc(db, 'posts', postId);
    await setDoc(docRef, {
      ...postData,
      updatedAt: new Date(),
    }, { merge: true });
    
    console.log('Blog post updated:', postId);
    return docRef;
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};