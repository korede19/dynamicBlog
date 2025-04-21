"use client";
import React, { useEffect, useState } from "react";
import { fetchPostsByCategory } from "@/lib/firestore";
import styles from "./styles.module.css";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";

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

interface AllPostsProps {
  categoryIds: string[];
  categoryNames: Record<string, string>;
}

const stripHtmlTags = (html: string = "") => {
  return html.replace(/<[^>]*>?/gm, "");
};

const formatDate = (dateValue: Date | FirestoreTimestamp | undefined) => {
  if (!dateValue) return "No date";

  let date: Date;

  try {
    // Check if it's a Firestore timestamp (has toDate method)
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

const AllPosts = ({ categoryIds, categoryNames = {} }: AllPostsProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 3; // Show 3 posts at once

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        let allPosts: BlogPost[] = [];

        // Fetch posts from each category
        for (const categoryId of categoryIds) {
          const categoryPosts = await fetchPostsByCategory(categoryId);
          allPosts = [...allPosts, ...categoryPosts];
        }

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

        setPosts(allPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [categoryIds]);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  // Get current posts based on pagination
  const currentPosts = posts.slice(
    currentPage * postsPerPage,
    (currentPage + 1) * postsPerPage
  );

  // Fill with empty posts if we don't have enough
  while (currentPosts.length < postsPerPage) {
    currentPosts.push({} as BlogPost);
  }

  const getCategoryName = (categoryId: string): string => {
    return categoryNames && categoryNames[categoryId]
      ? categoryNames[categoryId]
      : "Uncategorized";
  };

  if (loading) {
    return <div className={styles.loading}>Loading posts...</div>;
  }

  if (posts.length === 0) {
    return <div className={styles.noPosts}>No posts found</div>;
  }

  return (
    <div className={styles.allPostsContainer}>
      <h2 className={styles.sectionTitle}> Featured Posts </h2>

      <div className={styles.threeColumnGrid}>
        {currentPosts.map((post, index) => (
          <div key={post.id || `empty-${index}`} className={styles.postCard}>
            {post.id ? (
              <>
                <div className={styles.postCardImage}>
                  <Image
                    src={post.imageUrl || "/api/placeholder/300/180"}
                    alt={post.title || "Post image"}
                    width={300}
                    height={180}
                    className={styles.image}
                  />
                  <div className={styles.postMeta}>
                    <span className={styles.category}>
                      {getCategoryName(post.categoryId)}
                    </span>
                    <p className={styles.postDate}>
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                  <h3 className={styles.postTitle}>
                    {post.title || "Untitled"}
                  </h3>
                  <p className={styles.postExcerpt}>
                    {stripHtmlTags(post.content || "").substring(0, 200)}...
                  </p>
                  <Link
                    href={`/blog/${post.slug || post.id}`}
                    className={styles.readMore}
                  >
                    Read More
                  </Link>
                </div>
              </>
            ) : (
              <div className={styles.emptyCard}></div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.navigationControls}>
        <button
          onClick={handlePrevious}
          className={styles.navButton}
          aria-label="Previous posts"
        >
          &larr; Previous
        </button>
        <span className={styles.pageCounter}>
          {currentPage + 1} / {Math.max(1, totalPages)}
        </span>
        <button
          onClick={handleNext}
          className={styles.navButton}
          aria-label="Next posts"
        >
          Next &rarr;
        </button>
      </div>

      <div className={styles.viewAllContainer}>
        <Link href="/blog/posts" className={styles.viewAllButton}>
          View All Posts
        </Link>
      </div>
    </div>
  );
};

export default AllPosts;
