import React, { memo } from "react";
import { formatDate, FirestoreTimestamp } from "../../utils/blog";
import styles from "./styles.module.css";

interface PostMetaProps {
  categoryName: string;
  createdAt: Date | FirestoreTimestamp;
}

const PostMeta = memo(({ categoryName, createdAt }: PostMetaProps) => (
  <div className={styles.postMeta}>
    <span className={styles.category}>{categoryName}</span>
    <span className={styles.date}>{formatDate(createdAt)}</span>
  </div>
));

PostMeta.displayName = "PostMeta";

export default PostMeta;