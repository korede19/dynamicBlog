"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import SkeletonLoader from "../skeletonLoader";
import styles from "./styles.module.css";

interface FirestoreTimestamp {
  toDate: () => Date;
}

interface BlogPost {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
  categoryId: string;
  categoryName?: string;
  createdAt: Date | FirestoreTimestamp;
  updatedAt: Date | FirestoreTimestamp;
  slug?: string;
}

const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>?/gm, "");
};

const formatDate = (dateValue: Date | FirestoreTimestamp): string => {
  if (!dateValue) return "No date";
  
  let date: Date;
  
  // Check if it's a Firestore timestamp (has toDate method)
  if ("toDate" in dateValue) {
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
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const RecentPostsWidget: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecentPosts = async (): Promise<void> => {
      try {
        const postsRef = collection(db, "posts");
        const postsQuery = query(postsRef, orderBy("createdAt", "desc"), limit(10));
        const querySnapshot = await getDocs(postsQuery);
        
        const postsData: BlogPost[] = [];
        querySnapshot.forEach((doc) => {
          postsData.push({ id: doc.id, ...doc.data() } as BlogPost);
        });
        
        setPosts(postsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recent posts:", error);
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  return (
    <div className={styles.recentPostsWidget}>
      <h3 className={styles.widgetTitle}>Recent Posts</h3>
      
      {loading ? (
        <div className={styles.loadingContainer}>
          {/* Using array indices as keys for skeleton loaders */}
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonLoader key={`skeleton-${index}`} />
          ))}
        </div>
      ) : (
        <ul className={styles.recentPostsList}>
          {posts.map((post) => (
            <li key={post.id} className={styles.recentPostItem}>
              <Link href={`/blog/${post.slug || post.id}`} className={styles.postLink}>
                <div className={styles.postMeta}>
                  <span className={styles.postDate}>{formatDate(post.createdAt)}</span>
                </div>
                <h4 className={styles.postTitle}>{post.title}</h4>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentPostsWidget;