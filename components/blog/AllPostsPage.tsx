"use client";
import React, { useCallback } from "react";
import { AllPostsPageProps } from "@/types/allPost";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";
import CategoryFilters from "./CategoryFilters";
import PostsGrid from "./PostsGrid";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import SkeletonLoader from "../skeletonLoader";
import styles from "./styles.module.css";

const AllPostsPage = ({ categoryNames = {}, initialPosts = [] }: AllPostsPageProps) => {
  const { posts, loading, error, retry } = useBlogPosts(initialPosts);
  const { currentCategory, filteredPosts, handleCategoryChange } = useCategoryFilter(posts);

  const getCategoryName = useCallback((categoryId: string): string => {
    return categoryNames?.[categoryId] || "Uncategorized";
  }, [categoryNames]);

  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={retry} />;
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
      </div>

      <CategoryFilters
        categoryNames={categoryNames}
        currentCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
      />

      {loading ? (
        <SkeletonLoader type="Posts" />
      ) : filteredPosts.length === 0 ? (
        <EmptyState
          currentCategory={currentCategory}
          getCategoryName={getCategoryName}
          onViewAll={() => handleCategoryChange(null)}
        />
      ) : (
        <PostsGrid
          posts={filteredPosts}
          getCategoryName={getCategoryName}
        />
      )}
    </div>
  );
};

export default AllPostsPage;