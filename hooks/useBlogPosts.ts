"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { BlogPost } from "@/types/blog";
import { fetchAllPosts } from "@/lib/firestore";
import { sortPostsByDate } from "@/utils/blogUtils";

export const useBlogPosts = (initialPosts: BlogPost[] = []) => {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [loading, setLoading] = useState(initialPosts.length === 0);
  const [error, setError] = useState<string | null>(null);

  // Memoize sorted posts
  const sortedPosts = useMemo(() => {
    if (!posts || posts.length === 0) return [];
    return sortPostsByDate(posts);
  }, [posts]);

  // Fetch posts only if no initial posts provided
  useEffect(() => {
    if (initialPosts.length > 0) {
      setPosts(initialPosts);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const getAllPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchAllPosts(100);

        if (isMounted) {
          setPosts(response.posts || []);
        }
      } catch (error) {
        console.error("Error fetching all posts:", error);
        if (isMounted) {
          setError("Failed to load posts. Please try again.");
          setPosts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getAllPosts();

    return () => {
      isMounted = false;
    };
  }, [initialPosts.length]);

  const retry = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  return {
    posts: sortedPosts,
    loading,
    error,
    retry
  };
};
