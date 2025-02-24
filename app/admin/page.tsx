"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useRouter } from "next/navigation";
import {
  Camera,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Code,
} from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { createBlogPost } from "@/lib/api";
import { Editor } from "@tiptap/react";
import Header from "@/components/header";

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className={styles.btnContain}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${styles.button} ${
          editor.isActive("bold") ? styles.active : ""
        }`}
      >
        <Bold className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${styles.button} ${
          editor.isActive("italic") ? styles.active : ""
        }`}
      >
        <Italic className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${styles.button} ${
          editor.isActive("heading", { level: 1 }) ? styles.active : ""
        }`}
      >
        <Heading1 className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${styles.button} ${
          editor.isActive("heading", { level: 2 }) ? styles.active : ""
        }`}
      >
        <Heading2 className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${styles.button} ${
          editor.isActive("heading", { level: 3 }) ? styles.active : ""
        }`}
      >
        <Heading3 className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${styles.button} ${
          editor.isActive("bulletList") ? styles.active : ""
        }`}
      >
        <List className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`${styles.button} ${
          editor.isActive("codeBlock") ? styles.active : ""
        }`}
      >
        <Code className="w-5 h-5" />
      </button>
      <button
        onClick={() => {
          const url = window.prompt("Enter URL");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`${styles.button} ${
          editor.isActive("link") ? styles.active : ""
        }`}
      >
        <LinkIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

const AdminPostForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    imageUrl: "",
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 hover:underline",
        },
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const storageRef = ref(storage, `blog-images/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      setFormData((prev) => ({ ...prev, imageUrl: downloadUrl }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editor) return;

    setIsSubmitting(true);

    try {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      await createBlogPost({
        ...formData,
        content: editor.getHTML(),
        slug,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      router.push("/admin/posts");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.allContain}>
      <Header />
      <div className={styles.pgContain}>
        <h2>Create a New Post</h2>
        <form onSubmit={handleSubmit} className={styles.formContain}>
          <div className={styles.titleForm}>
            <label className={styles.formLabel}>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className={styles.mainForm}
              required
            />
          </div>
          <div className={styles.tabPgTwo}>
            <label className={styles.formLabel}>Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  categoryId: e.target.value,
                }))
              }
              className={styles.selectForm}
              required
            >
              <option value="">Select a category</option>
              <option value="category1">Technology</option>
              <option value="category2">Design</option>
              <option value="category3">Development</option>
            </select>
          </div>

          <div className={styles.tabPgThree}>
            <label className={styles.formLabel}>Content</label>
            <div className="border rounded-md">
              <MenuBar editor={editor} />
              <EditorContent editor={editor} className={styles.editorContent} />
            </div>
          </div>

          <div className={styles.tabPgFour}>
            <label className={styles.formLabel}>Featured Image</label>
            <div className={styles.upload}>
              {formData.imageUrl ? (
                <div className={styles.formData}>
                  <img src={formData.imageUrl} alt="Preview" />
                </div>
              ) : (
                <div>
                  <div>
                    <Camera />
                    <span>Upload image</span>
                  </div>
                </div>
              )}
              <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                className={styles.uploadBtn}
              />
            </div>
          </div>
          <br />
          <br />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitBtn}
            >
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPostForm;
