"use client";
import React, { memo, useMemo } from "react";
import { FixedSizeList as List } from "react-window";
import { BlogPost } from "@/types/blog";
import PostCard from "./PostCard";
import styles from "./styles.module.css";

interface VirtualizedPostsGridProps {
  posts: BlogPost[];
  getCategoryName: (categoryId: string) => string;
  itemsPerRow?: number;
  itemHeight?: number;
}

const VirtualizedPostsGrid = memo(({ 
  posts, 
  getCategoryName, 
  itemsPerRow = 3,
  itemHeight = 400 
}: VirtualizedPostsGridProps) => {
  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < posts.length; i += itemsPerRow) {
      result.push(posts.slice(i, i + itemsPerRow));
    }
    return result;
  }, [posts, itemsPerRow]);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style} className={styles.virtualRow}>
      {rows[index].map((post) => (
        <div key={post.id} className={styles.virtualItem}>
          <PostCard post={post} getCategoryName={getCategoryName} />
        </div>
      ))}
    </div>
  );

  if (posts.length < 20) {
    // Use regular grid for small lists
    return (
      <div className={styles.postsGrid}>
        {posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            getCategoryName={getCategoryName}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.virtualizedContainer}>
      <List
        height={600}
        itemCount={rows.length}
        itemSize={itemHeight}
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
});

VirtualizedPostsGrid.displayName = "VirtualizedPostsGrid";