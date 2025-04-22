"use client";

import React from "react";
import styles from "./styles.module.css";

interface SkeletonLoaderProps {
  type?: "slide" | "card" | "Posts";
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = "slide" }) => {
  if (type === "slide") {
    return (
      <div className={styles.skeletonSlide}>
        <div className={styles.skeletonImage}></div>
        <div className={styles.skeletonContent}>
          <div className={styles.skeletonMeta}>
            <div className={styles.skeletonCategory}></div>
            <div className={styles.skeletonDate}></div>
          </div>
          <div className={styles.skeletonTitle}></div>
          <div className={styles.skeletonText}>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className={styles.skeletonButton}></div>
        </div>
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className={styles.skeletonCard}>
        <div className={styles.skeletonCardImage}></div>
        <div className={styles.skeletonCardContent}>
          <div className={styles.skeletonCardCategory}></div>
          <div className={styles.skeletonCardTitle}></div>
          <div className={styles.skeletonCardText}>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "Posts") {
    return (
      <div className={styles.skeletonPosts}>
        <div className={styles.skeletonCard}>
          <div className={styles.skeletonCardImage}></div>
          <div className={styles.skeletonCardContent}>
            <div className={styles.skeletonCardCategory}></div>
            <div className={styles.skeletonCardTitle}></div>
            <div className={styles.skeletonCardText}>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
        <div className={styles.skeletonCard}>
          <div className={styles.skeletonCardImage}></div>
          <div className={styles.skeletonCardContent}>
            <div className={styles.skeletonCardCategory}></div>
            <div className={styles.skeletonCardTitle}></div>
            <div className={styles.skeletonCardText}>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
        <div className={styles.skeletonCard}>
          <div className={styles.skeletonCardImage}></div>
          <div className={styles.skeletonCardContent}>
            <div className={styles.skeletonCardCategory}></div>
            <div className={styles.skeletonCardTitle}></div>
            <div className={styles.skeletonCardText}>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
