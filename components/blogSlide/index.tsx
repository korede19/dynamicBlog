import React, { memo, useMemo } from "react";
import Link from "next/link";
import { BlogPost } from "../../types/blog";
import PostMeta from "../postMeta/index";
import PostContent from "../postContents/index";
import styles from "./styles.module.css";

interface BlogSlideProps {
  post: BlogPost;
  categoryName: string;
}

const BlogSlide = memo(({ post, categoryName }: BlogSlideProps) => {
  const backgroundStyle = useMemo(() => ({
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${post.imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }), [post.imageUrl]);

  const blogLink = useMemo(() => `/blog/${post.slug}`, [post.slug]);

  return (
    <div className={styles.slide} style={backgroundStyle}>
      <PostMeta categoryName={categoryName} createdAt={post.createdAt} />
      
      <Link href={blogLink} passHref className={styles.blogLink}>
        <h3 className={styles.title}>{post.title}</h3>
      </Link>
      
      <PostContent content={post.content} />
      
      <Link href={blogLink} passHref className={styles.readMore}>
        Read More
      </Link>
    </div>
  );
});

BlogSlide.displayName = "BlogSlide";

export default BlogSlide;