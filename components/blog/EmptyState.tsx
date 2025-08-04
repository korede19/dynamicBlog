"use client";
import React, { memo } from "react";
import styles from "./styles.module.css";

interface EmptyStateProps {
  currentCategory: string | null;
  getCategoryName: (categoryId: string) => string;
  onViewAll: () => void;
}

const EmptyState = memo(({ 
  currentCategory, 
  getCategoryName, 
  onViewAll 
}: EmptyStateProps) => {
  return (
    <div className={styles.noPosts}>
      <h3>No posts found</h3>
      {currentCategory ? (
        <p>
          No posts in the &quot;{getCategoryName(currentCategory)}&quot; category yet.
          <button 
            onClick={onViewAll}
            className={styles.viewAllLink}
          >
            View all posts
          </button>
        </p>
      ) : (
        <p>Check back later for new content!</p>
      )}
    </div>
  );
});

EmptyState.displayName = "EmptyState";
export default EmptyState;