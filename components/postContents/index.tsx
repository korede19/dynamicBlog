import React, { memo, useMemo } from "react";
import { stripHtmlTags } from "../../utils/blog";
import styles from "./styles.module.css";

interface PostContentProps {
  content: string;
  maxLength?: number;
}

const PostContent = memo(({ content, maxLength = 350 }: PostContentProps) => {
  const truncatedContent = useMemo(() => {
    return stripHtmlTags(content.slice(0, maxLength));
  }, [content, maxLength]);

  return (
    <div className={styles.postContent}>
      <p>{truncatedContent}...</p>
    </div>
  );
});

PostContent.displayName = "PostContent";

export default PostContent;