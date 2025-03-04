"use client";
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';
import styles from './styles.module.css';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  content: string;
  createdAt: { toDate: () => Date } | Date;
  categoryId: string;
}

const BlogPostList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsQuery = query(
          collection(db, 'posts'),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        
        const querySnapshot = await getDocs(postsQuery);
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as BlogPost[];
        
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading posts...</div>;
  }

  if (posts.length === 0) {
    return <div className={styles.noPosts}>No posts found. Create your first post!</div>;
  }

  return (
    <div className={styles.postGrid}>
      {posts.map(post => (
        <Link href={`/blog/${post.slug}`} key={post.id} className={styles.postCard}>
          <div className={styles.imageContainer}>
            {post.imageUrl ? (
              <Image 
                src={post.imageUrl} 
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.postImage}
              />
            ) : (
              <div className={styles.placeholderImage}>No Image</div>
            )}
          </div>
          <div className={styles.postContent}>
            <h3 className={styles.postTitle}>{post.title}</h3>
            <p className={styles.postDate}>
              {new Date(post.createdAt instanceof Date 
                ? post.createdAt 
                : post.createdAt.toDate()).toLocaleDateString()}
            </p>
            <p className={styles.postExcerpt}>
              {post.content.replace(/<[^>]*>/g, '').slice(0, 120)}...
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BlogPostList;