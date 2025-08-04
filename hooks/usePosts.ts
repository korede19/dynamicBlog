import { useState, useEffect, useCallback } from "react";
import { BlogPost } from "../types/blog";
import { sortPostsByDate } from "../utils/blog";
import { fetchPostsByCategory } from "../lib/firestore";

export const usePosts = (categoryId: string) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    if (!categoryId) return;

    setLoading(true);
    setError(null);
    
    try {
      const fetchedPosts = await fetchPostsByCategory(categoryId);
      const sortedPosts = sortPostsByDate(fetchedPosts);
      setPosts(sortedPosts);
    } catch (err) {
      console.error("Error loading posts:", err);
      setError("Failed to load posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return { posts, loading, error, refetch: loadPosts };
};