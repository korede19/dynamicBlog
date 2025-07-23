"use client";
import React, { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createBlogPost } from "@/lib/api";
import styles from "./styles.module.css";
import PostFormFields from "@/components/postFormField";
import PostEditor from "@/components/postEditor";
import Footer from "../footer";

// Cloudinary config
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";
const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

// Types
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

interface FormDataType {
  title: string;
  categoryId: string;
  imageUrl: string;
  tagsInput: string;
  content: string;
}

const AdminPostForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    categoryId: "",
    imageUrl: "",
    tagsInput: "",
    content: "",
  });

  // Upload image to Cloudinary
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!CLOUDINARY_UPLOAD_PRESET || !CLOUDINARY_CLOUD_NAME) {
      alert("Cloudinary config is missing.");
      return;
    }

    try {
      setUploadingImage(true);

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${res.status} ${errorText}`);
      }

      const json: CloudinaryResponse = await res.json();
      setFormData((prev: FormDataType) => ({
        ...prev,
        imageUrl: json.secure_url,
      }));
    } catch (error: any) {
      alert(`Image upload failed: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

 
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
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag);

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
      router.push("/admin/posts");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.allContain}>
      <div className={styles.pgContain}>
        <div className={styles.formHeader}>
          <h2>Create a New Post</h2>
        </div>
        <form onSubmit={handleSubmit} className={styles.formContain}>
          <PostFormFields
            formData={formData}
            uploadingImage={uploadingImage}
            onTitleChange={(e) =>
              setFormData((prev: FormDataType) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            onCategoryChange={(e) =>
              setFormData((prev: FormDataType) => ({
                ...prev,
                categoryId: e.target.value,
              }))
            }
            onTagsChange={(e) =>
              setFormData((prev: FormDataType) => ({
                ...prev,
                tagsInput: e.target.value,
              }))
            }
            onImageUpload={handleImageUpload}
            onRemoveImage={() =>
              setFormData((prev: FormDataType) => ({
                ...prev,
                imageUrl: "",
              }))
            }
          />
          <PostEditor
            content={formData.content}
            onContentChange={(content: string) =>
              setFormData((prev: FormDataType) => ({ ...prev, content }))
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
      <Footer />
    </div>
  );
};

export default AdminPostForm;
