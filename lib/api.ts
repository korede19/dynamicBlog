import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { BlogPost, Category } from '../types';

export const createBlogPost = async (post: Omit<BlogPost, 'id'>) => {
  const docRef = await addDoc(collection(db, 'posts'), {
    ...post,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return docRef.id;
};

export const getBlogPosts = async () => {
  const postsRef = collection(db, 'posts');
  const q = query(postsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as BlogPost));
};

export const getPostsByCategory = async (categoryId: string) => {
  const postsRef = collection(db, 'posts');
  const q = query(
    postsRef,
    where('categoryId', '==', categoryId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as BlogPost));
};