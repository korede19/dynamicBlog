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

interface AllPostsPageProps {
  categoryNames?: Record<string, string>;
}

const stripHtmlTags = (html: string = "") => {
  return html.replace(/<[^>]*>?/gm, "");
};

const formatDate = (dateValue: Date | FirestoreTimestamp | undefined) => {
  if (!dateValue) return "No date";

  let date: Date;

  try {
    if (dateValue && typeof dateValue === "object" && "toDate" in dateValue) {
      date = dateValue.toDate();
    } else {
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
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

const AllPostsPage = ({ categoryNames = {} }: AllPostsPageProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string>("");

  // Get the current path and category filter from URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get current path without query parameters
      const path = window.location.pathname;
      setCurrentPath(path);

      // Get category from query params
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get("category");
      setFilter(categoryParam);
    }
  }, []);

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        setLoading(true);
        const allPosts = await fetchAllPosts();

        // Check if allPosts is an array before sorting
        if (Array.isArray(allPosts) && allPosts.length > 0) {
          // Sort by date (newest first)
          allPosts.sort((a, b) => {
            try {
              const dateA =
                a.createdAt && "toDate" in a.createdAt
                  ? a.createdAt.toDate()
                  : a.createdAt || new Date();
              const dateB =
                b.createdAt && "toDate" in b.createdAt
                  ? b.createdAt.toDate()
                  : b.createdAt || new Date();
              return dateB.getTime() - dateA.getTime();
            } catch (error) {
              console.error("Error sorting dates:", error);
              return 0;
            }
          });
        }

        setPosts(allPosts || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching all posts:", error);
        setPosts([]);
        setLoading(false);
      }
    };

    getAllPosts();
  }, []);

  const filteredPosts =
    filter && posts && posts.length > 0
      ? posts.filter((post) => post && post.categoryId === filter)
      : posts || [];

  const getCategoryName = (categoryId: string): string => {
    return categoryNames && categoryNames[categoryId]
      ? categoryNames[categoryId]
      : "Uncategorized";
  };

  return (
    <div className={styles.allPostsPageContainer}>
      <h1 className={styles.pageTitle}>All Posts</h1>

      {categoryNames && Object.keys(categoryNames).length > 0 && (
        <div className={styles.categoryFilters}>
          <a
            href={currentPath}
            className={`${styles.filterButton} ${!filter ? styles.active : ""}`}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = currentPath;
            }}
          >
            All
          </a>
          {Object.entries(categoryNames).map(([id, name]) => (
            <a
              key={id}
              href={`${currentPath}?category=${id}`}
              className={`${styles.filterButton} ${
                filter === id ? styles.active : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `${currentPath}?category=${id}`;
              }}
            >
              {name}
            </a>
          ))}
        </div>
      )}

      {loading ? (
        <SkeletonLoader type="Posts" />
      ) : !filteredPosts || filteredPosts.length === 0 ? (
        <div className={styles.noPosts}>No posts found</div>
      ) : (
        <div className={styles.postsGrid}>
          {filteredPosts.map((post) => (
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
                  <span className={styles.category}>
                    {getCategoryName(post.categoryId)}
                  </span>
                  <span className={styles.postDate}>
                    {formatDate(post.createdAt)}
                  </span>
                </div>
                <h3 className={styles.postTitle}>{post.title || "Untitled"}</h3>
                <p className={styles.postExcerpt}>
                  {stripHtmlTags(post.content || "").substring(0, 120)}...
                </p>
                <Link
                  href={`/blog/${post.slug || post.id}`}
                  className={styles.readMore}
                >
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

export default AllPostsPage;
