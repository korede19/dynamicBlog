"use client";
import React, { useEffect, useState } from "react";
import { fetchAllPosts } from "@/lib/firestore";
import styles from "./styles.module.css";
import Image from "next/image";
import Link from "next/link";
import SkeletonLoader from "../skeletonLoader";

interface FirestoreTimestamp {
  toDate(): Date;
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

const stripHtmlTags = (html: string = "") => {
  return html.replace(/<[^>]*>?/gm, "");
};

const formatDate = (dateValue: Date | FirestoreTimestamp | undefined) => {
  if (!dateValue) return "No date";
  let date: Date;
  try {
    if (typeof dateValue === "object" && "toDate" in dateValue) {
      date = dateValue.toDate();
    } else {
      date = dateValue as Date;
    }
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

const BlogsPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        setLoading(true);
        const response = await fetchAllPosts();
        const postsData = response.posts;
        if (Array.isArray(postsData) && postsData.length > 0) {
          postsData.sort((a, b) => {
            const dateA = "toDate" in a.createdAt ? a.createdAt.toDate() : a.createdAt;
            const dateB = "toDate" in b.createdAt ? b.createdAt.toDate() : b.createdAt;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          });
        }
        setPosts(postsData || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
        setLoading(false);
      }
    };

    getAllPosts();
  }, []);

  return (
    <div className={styles.allPostsPageContainer}>
      <h1 className={styles.pageTitle}>All Posts</h1>

      {loading ? (
        <SkeletonLoader type="Posts" />
      ) : posts.length === 0 ? (
        <div className={styles.noPosts}>No posts found</div>
      ) : (
        <div className={styles.postsGrid}>
          {posts.map((post) => (
            <div key={post.id} className={styles.postItem}>
              <div className={styles.postImageContainer}>
                <Image
                  src={post.imageUrl || "/api/placeholder/300/180"}
                  alt={post.title || "Post image"}
                  width={300}
                  height={180}
                  className={styles.postImage}
                />
              </div>
              <div className={styles.postContent}>
                <div className={styles.postMeta}>
                  <span className={styles.postDate}>{formatDate(post.createdAt)}</span>
                </div>
                <h3 className={styles.postTitle}>{post.title || "Untitled"}</h3>
                <p className={styles.postExcerpt}>
                  {stripHtmlTags(post.content || "").substring(0, 120)}...
                </p>
                <Link href={`/blog/${post.slug || post.id}`} className={styles.readMore}>
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogsPage;
