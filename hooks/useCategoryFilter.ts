"use client";
import { useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BlogPost } from "@/types/blog";

export const useCategoryFilter = (posts: BlogPost[]) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  // Memoize filtered posts
  const filteredPosts = useMemo(() => {
    if (!currentCategory || !posts.length) return posts;
    return posts.filter((post) => post?.categoryId === currentCategory);
  }, [posts, currentCategory]);

  // Handle category filter change
  const handleCategoryChange = useCallback((categoryId: string | null) => {
    if (typeof window === "undefined") return;
    
    const currentPath = window.location.pathname;
    const newUrl = categoryId 
      ? `${currentPath}?category=${categoryId}`
      : currentPath;
    
    router.push(newUrl, { scroll: false });
  }, [router]);

  return {
    currentCategory,
    filteredPosts,
    handleCategoryChange
  };
};