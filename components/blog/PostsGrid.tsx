"use client";
import React, { memo } from "react";
import { BlogPost } from "@/types/blog";
import PostCard from "./PostCard";
import styles from "./styles.module.css";

interface PostsGridProps {
  posts: BlogPost[];
  getCategoryName: (categoryId: string) => string;
}

const PostsGrid = memo(({ posts, getCategoryName }: PostsGridProps) => {
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
});

PostsGrid.displayName = "PostsGrid";
export default PostsGrid;