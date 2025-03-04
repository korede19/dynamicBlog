"use client";
import React, { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createBlogPost } from "@/lib/api";
import Header from "@/components/header";
import styles from "./styles.module.css"; // Move your styles to a component-specific file
import PostFormFields from "@/components/postFormField";
import PostEditor from "@/components/postEditor";

// Cloudinary configuration
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";
const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

interface BlogPost {
  title: string;
  categoryId: string;
  imageUrl: string;
  content: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CloudinaryResponse {
  secure_url: string;
}

const AdminPostForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    imageUrl: "",
    tagsInput: "",
    content: "",
  });

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Attempting upload with:", {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      fileSize: file.size,
      fileType: file.type,
    });

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
      console.log("Uploading to:", uploadUrl);

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
      console.log("Upload successful:", data);

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

      const postData: BlogPost = {
        title: formData.title,
        categoryId: formData.categoryId,
        imageUrl: formData.imageUrl,
        content: formData.content,
        slug,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (tagsArray.length > 0) {
        localStorage.setItem(`post_tags_${slug}`, JSON.stringify(tagsArray));
      }

      await createBlogPost(postData);
      alert("Post created successfully!");
      router.push("/admin/posts"); // Make sure this path matches your file structure
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.allContain}>
      <Header />
      <div className={styles.pgContain}>
        <div className={styles.formHeader}>
          <h2>Create a New Post</h2>
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
              {isSubmitting ? "Publishing..." : "Publish Post"}
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
};

export default AdminPostForm;