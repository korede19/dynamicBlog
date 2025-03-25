"use client";
import React, { useEffect, useState } from "react";
import { fetchPostsByCategory } from "@/lib/firestore";
import styles from "./styles.module.css";
import Link from "next/link";

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

interface categoryProps {
  categoryId: string;
  categoryName: string;
}
const stripHtmlTags = (html: string) => {
  return html.replace(/<[^>]*>?/gm, "");
};

const formatDate = (dateValue: Date | FirestoreTimestamp) => {
  if (!dateValue) return "No date";
  
  let date: Date;
  
  // Check if it's a Firestore timestamp (has toDate method)
  if ('toDate' in dateValue) {
    date = dateValue.toDate();
  } 
  // Check if it's already a Date object
  else {
    date = dateValue as Date;
  }
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const PostCard = ({ categoryId, categoryName }: categoryProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPostsByCategory(categoryId)
      .then((posts) => {
        if (posts.length > 0) {
          const randomPost = posts[Math.floor(Math.random() * posts.length)];
          setPosts([randomPost]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading posts", error);
        setLoading(false);
      });
  }, [categoryId]);

  return (
    <div className={styles.container}>
      {loading && <p className={styles.loading}>Loading posts...</p>}
      <div className={styles.postContainer}>
        {posts.map((post) => (
          <div
            key={post.id}
            className={styles.postCard}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${post.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className={styles.postMeta}>
              <span className={styles.category}>{categoryName}</span>
              <p className={styles.postDate}>{formatDate(post.createdAt)}</p>
            </div>
            <h3 className={styles.postTitle}>{post.title}</h3>
            <p className={styles.postContent}>
              {stripHtmlTags(post.content).substring(0, 100)}...
            </p>
            <Link href={`/post/${post.slug}`} className={styles.readMore}>
              <p>Read more</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCard;
