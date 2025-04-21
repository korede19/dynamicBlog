
"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Header from '@/components/header';
import Image from 'next/image';
import Link from 'next/link';
import styles from './styles.module.css';
import Footer from '@/components/footer';

interface BlogPost {
  title: string;
  imageUrl: string;
  content: string;
  createdAt: { toDate: () => Date } | Date;
  categoryId: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        // Query posts collection where slug equals the URL parameter
        const postsQuery = query(
          collection(db, 'posts'), 
          where('slug', '==', slug),
          limit(1)
        );
        
        const querySnapshot = await getDocs(postsQuery);
        
        if (querySnapshot.empty) {
          setError('Post not found');
          setLoading(false);
          return;
        }
        
        const postData = querySnapshot.docs[0].data() as BlogPost;
        setPost(postData);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.loading}>Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.error}>{error || 'Post not found'}</div>
      </div>
    );
  }

  const formattedDate = new Date(
    post.createdAt instanceof Date 
      ? post.createdAt 
      : post.createdAt.toDate()
  ).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={styles.container}>
      <Header />
      <article className={styles.postContainer}>
        <h1 className={styles.postTitle}>{post.title}</h1>
        <div className={styles.postMeta}>
          <time dateTime={formattedDate}>{formattedDate}</time>
        </div>
        
        {post.imageUrl && (
          <div className={styles.imageContainer}>
            <Image 
              src={post.imageUrl} 
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              className={styles.postImage}
            />
          </div>
        )}
        
        <div 
          className={styles.postContent}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <Link href="/blog/posts" className={styles.backLink}>
        <button>
          All Posts
        </button>
        </Link>
      </article>
      <Footer />
    </div>
  );
}