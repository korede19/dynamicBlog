"use client";
import React, { memo } from "react";
import styles from "./styles.module.css";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState = memo(({ error, onRetry }: ErrorStateProps) => {
  return (
    <div className={styles.allPostsPageContainer}>
      <div className={styles.errorState}>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button 
          onClick={onRetry} 
          className={styles.retryButton}
        >
          Try Again
        </button>
      </div>
    </div>
  );
});

ErrorState.displayName = "ErrorState";
export default ErrorState;