"use client";
import React, { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Header from "@/components/header";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.css";
import Footer from "@/components/footer";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  createdAt: { toDate: () => Date } | Date;
  updatedAt: { toDate: () => Date } | Date;
}

export default function AdminPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login"); // Redirect to the login page after logout
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(postsQuery);
      const fetchedPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BlogPost[];

      setPosts(fetchedPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, "posts", id));
        // Refresh the posts list
        fetchPosts();
      } catch (err) {
        console.error("Error deleting post:", err);
        alert("Failed to delete post");
      }
    }
  };

  const formatDate = (date: Date | { toDate: () => Date }) => {
    const dateObj = date instanceof Date ? date : date.toDate();
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.loading}>Loading posts...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.pageHeader}>
        <h1>Manage Blog Posts</h1>
        <button
          className={styles.createButton}
          onClick={() => router.push("/admin/create-post")}
        >
          Create New Post
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {posts.length === 0 ? (
        <div className={styles.noPosts}>
          <p>No posts found. Start creating your first blog post!</p>
        </div>
      ) : (
        <div className={styles.postsTable}>
          <table>
            <thead>
              <tr>
                <th className={styles.imageCell}>Image</th>
                <th className={styles.titleCell}>Title</th>
                <th className={styles.dateCell}>Created</th>
                <th className={styles.dateCell}>Updated</th>
                <th className={styles.actionCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className={styles.imageCell}>
                    {post.imageUrl ? (
                      <div className={styles.thumbnailContainer}>
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          sizes="100px"
                          className={styles.thumbnail}
                        />
                      </div>
                    ) : (
                      <div className={styles.noImage}>No Image</div>
                    )}
                  </td>
                  <td className={styles.titleCell}>{post.title}</td>
                  <td className={styles.dateCell}>
                    {formatDate(post.createdAt)}
                  </td>
                  <td className={styles.dateCell}>
                    {formatDate(post.updatedAt)}
                  </td>
                  <td className={styles.actionCell}>
                    <div className={styles.actionButtons}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className={styles.viewButton}
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/posts/edit/${post.id}`}
                        className={styles.editButton}
                      >
                        Edit
                      </Link>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeletePost(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className={styles.logoutBtn}>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <Footer />
    </div>
  );
}
