"use client";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc  } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Header from "@/components/header";
import styles from "./styles.module.css";
import PostFormFields from "@/components/postFormField";
import PostEditor from "@/components/postEditor";

// Cloudinary configuration
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";
const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

interface CloudinaryResponse {
  secure_url: string;
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    imageUrl: "",
    tagsInput: "",
    content: "",
  });

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);
        
        if (postSnap.exists()) {
          const postData = postSnap.data();
          
          // Try to get stored tags
          let tagsInput = "";
          try {
            const storedTags = localStorage.getItem(`post_tags_${postData.slug}`);
            if (storedTags) {
              tagsInput = JSON.parse(storedTags).join(", ");
            }
          } catch (e) {
            console.error("Error retrieving tags:", e);
          }
          
          setFormData({
            title: postData.title || "",
            categoryId: postData.categoryId || "",
            imageUrl: postData.imageUrl || "",
            content: postData.content || "",
            tagsInput,
          });
        } else {
          setError("Post not found");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!CLOUDINARY_UPLOAD_PRESET || !CLOUDINARY_CLOUD_NAME) {
      console.error("Cloudinary configuration missing");
      alert(
        "Image upload is not configured properly. Please check your environment variables."
      );
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
      
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Image upload failed: ${response.status} ${response.statusText}. Response: ${errorText}`
        );
      }

      const data: CloudinaryResponse = await response.json();

      // Update the form data with the new image URL
      setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }));
    } catch (error) {
      console.error("Detailed upload error:", error);
      if (error instanceof Error) {
        alert(`Failed to upload image: ${error.message}`);
      } else {
        alert("Failed to upload image. Please try again.");
      }
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const tagsArray = formData.tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const postData = {
        title: formData.title,
        categoryId: formData.categoryId,
        imageUrl: formData.imageUrl,
        content: formData.content,
        slug,
        updatedAt: new Date(),
      };

      if (tagsArray.length > 0) {
        localStorage.setItem(`post_tags_${slug}`, JSON.stringify(tagsArray));
      }

      // Update the document in Firebase
      await updateDoc(doc(db, "posts", postId), postData);
      
      alert("Post updated successfully!");
      router.push("/admin/posts");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.allContain}>
        <Header />
        <div className={styles.loading}>Loading post...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.allContain}>
        <Header />
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.allContain}>
      <Header />
      <div className={styles.pgContain}>
        <div className={styles.formHeader}>
          <h2>Edit Post</h2>
        </div>
        <form onSubmit={handleSubmit} className={styles.formContain}>
          <PostFormFields
            formData={formData}
            uploadingImage={uploadingImage}
            onTitleChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            onCategoryChange={(e) =>
              setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
            }
            onTagsChange={(e) =>
              setFormData((prev) => ({ ...prev, tagsInput: e.target.value }))
            }
            onImageUpload={handleImageUpload}
            onRemoveImage={() =>
              setFormData((prev) => ({ ...prev, imageUrl: "" }))
            }
          />
          <PostEditor
            content={formData.content}
            onContentChange={(content) =>
              setFormData((prev) => ({ ...prev, content }))
            }
          />
          <div className={styles.formFooter}>
            <button
              type="submit"
              disabled={isSubmitting || uploadingImage}
              className={styles.submitBtn}
            >
              {isSubmitting ? "Updating..." : "Update Post"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/posts")}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}