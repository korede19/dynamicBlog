"use client";
import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/blog";
import { stripHtmlTags, formatDate } from "@/utils/blogUtils";
import styles from "./styles.module.css";

interface PostCardProps {
  post: BlogPost;
  getCategoryName: (categoryId: string) => string;
}

const PostCard = memo(({ post, getCategoryName }: PostCardProps) => {
  const excerpt = stripHtmlTags(post.content || "").substring(0, 120);
  const hasMoreContent = post.content && stripHtmlTags(post.content).length > 120;

  return (
    <article className={styles.postItem}>
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
          <Link href={`/blog/${post.slug || post.id}`} className={styles.postLink}>
            {post.title || "Untitled"}
          </Link>
        </h2>
        
        <p className={styles.postExcerpt}>
          {excerpt}
          {hasMoreContent ? "..." : ""}
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
  );
});

export default PostCard