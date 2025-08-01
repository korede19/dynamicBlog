"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

  try {
    let date: Date;
    
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
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  // Memoize sorted posts to prevent unnecessary re-sorting
  const sortedPosts = useMemo(() => {
    if (!posts || posts.length === 0) return [];
    
    return [...posts].sort((a, b) => {
      try {
        const dateA = a.createdAt && "toDate" in a.createdAt
          ? a.createdAt.toDate()
          : new Date(a.createdAt || 0);
        const dateB = b.createdAt && "toDate" in b.createdAt
          ? b.createdAt.toDate()
          : new Date(b.createdAt || 0);
        
        return dateB.getTime() - dateA.getTime();
      } catch (error) {
        console.error("Error sorting dates:", error);
        return 0;
      }
    });
  }, [posts]);

  // Memoize filtered posts
  const filteredPosts = useMemo(() => {
    if (!currentCategory || !sortedPosts.length) return sortedPosts;
    return sortedPosts.filter((post) => post?.categoryId === currentCategory);
  }, [sortedPosts, currentCategory]);

  // Fetch posts only once on mount
  useEffect(() => {
    let isMounted = true;

    const getAllPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const allPosts = await fetchAllPosts(100); // Increase limit for better search

        if (isMounted) {
          setPosts(allPosts || []);
        }
      } catch (error) {
        console.error("Error fetching all posts:", error);
        if (isMounted) {
          setError("Failed to load posts. Please try again.");
          setPosts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getAllPosts();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run once

  // Handle category filter change
  const handleCategoryChange = useCallback((categoryId: string | null) => {
    const currentPath = window.location.pathname;
    const newUrl = categoryId 
      ? `${currentPath}?category=${categoryId}`
      : currentPath;
    
    // Use Next.js router for smooth navigation without page reload
    router.push(newUrl, { scroll: false });
  }, [router]);

  const getCategoryName = useCallback((categoryId: string): string => {
    return categoryNames?.[categoryId] || "Uncategorized";
  }, [categoryNames]);

  // Show error state
  if (error) {
    return (
      <div className={styles.allPostsPageContainer}>
        <div className={styles.errorState}>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.allPostsPageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          {currentCategory 
            ? `${getCategoryName(currentCategory)} Posts` 
            : "All Posts"
          }
        </h1>
        {!loading && filteredPosts.length > 0 && (
          <p className={styles.postCount}>
            {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Category Filters */}
      {categoryNames && Object.keys(categoryNames).length > 0 && (
        <div className={styles.categoryFilters}>
          <button
            onClick={() => handleCategoryChange(null)}
            className={`${styles.filterButton} ${!currentCategory ? styles.active : ""}`}
            type="button"
          >
            All
          </button>
          {Object.entries(categoryNames).map(([id, name]) => (
            <button
              key={id}
              onClick={() => handleCategoryChange(id)}
              className={`${styles.filterButton} ${
                currentCategory === id ? styles.active : ""
              }`}
              type="button"
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <SkeletonLoader type="Posts" />
      ) : (
        <>
          {/* No Posts State */}
          {filteredPosts.length === 0 ? (
            <div className={styles.noPosts}>
              <h3>No posts found</h3>
              {currentCategory ? (
                <p>
                  No posts in the "{getCategoryName(currentCategory)}" category yet.{" "}
                  <button 
                    onClick={() => handleCategoryChange(null)}
                    className={styles.viewAllLink}
                  >
                    View all posts
                  </button>
                </p>
              ) : (
                <p>Check back later for new content!</p>
              )}
            </div>
          ) : (
            /* Posts Grid */
            <div className={styles.postsGrid}>
              {filteredPosts.map((post) => (
                <article key={post.id} className={styles.postItem}>
                  <div className={styles.postImageContainer}>
                    <Link href={`/blog/${post.slug || post.id}`}>
                      <Image
                        src={post.imageUrl || "/api/placeholder/300/180"}
                        alt={post.title || "Post image"}
                        width={300}
                        height={180}
                        className={styles.postImage}
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+ss2zDYe0vExhc/wANkMw=="
                      />
                    </Link>
                  </div>
                  
                  <div className={styles.postContent}>
                    <div className={styles.postMeta}>
                      <span className={styles.category}>
                        {getCategoryName(post.categoryId)}
                      </span>
                      <time className={styles.postDate} dateTime={post.createdAt?.toString()}>
                        {formatDate(post.createdAt)}
                      </time>
                    </div>
                    
                    <h2 className={styles.postTitle}>
                      <Link href={`/blog/${post.slug || post.id}`}>
                        {post.title || "Untitled"}
                      </Link>
                    </h2>
                    
                    <p className={styles.postExcerpt}>
                      {stripHtmlTags(post.content || "").substring(0, 120)}
                      {post.content && stripHtmlTags(post.content).length > 120 ? "..." : ""}
                    </p>
                    
                    <Link
                      href={`/blog/${post.slug || post.id}`}
                      className={styles.readMore}
                    >
                      Read More
                      <span className={styles.readMoreArrow}>→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllPostsPage;