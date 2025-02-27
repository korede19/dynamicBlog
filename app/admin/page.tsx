"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
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
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { createBlogPost } from "@/lib/api";
import { Editor } from "@tiptap/react";
import { TextAlign } from "@tiptap/extension-text-align";
import Header from "@/components/header";

const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "doqe8ih3u";
const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "blog_uploads";

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className={styles.btnContain}>
      {/* Text Formatting Section */}
      <div className={styles.toolSection}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${styles.button} ${
            editor.isActive("bold") ? styles.active : ""
          }`}
          title="Bold"
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${styles.button} ${
            editor.isActive("italic") ? styles.active : ""
          }`}
          title="Italic"
        >
          <Italic className="w-5 h-5" />
        </button>
      </div>

      {/* Headings Section */}
      <div className={styles.toolSection}>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`${styles.button} ${
            editor.isActive("heading", { level: 1 }) ? styles.active : ""
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-5 h-5" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`${styles.button} ${
            editor.isActive("heading", { level: 2 }) ? styles.active : ""
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-5 h-5" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`${styles.button} ${
            editor.isActive("heading", { level: 3 }) ? styles.active : ""
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-5 h-5" />
        </button>
      </div>

      {/* Lists Section */}
      <div className={styles.toolSection}>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${styles.button} ${
            editor.isActive("bulletList") ? styles.active : ""
          }`}
          title="Bullet List"
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${styles.button} ${
            editor.isActive("orderedList") ? styles.active : ""
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-5 h-5" />
        </button>
      </div>

      {/* Block Formatting */}
      <div className={styles.toolSection}>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`${styles.button} ${
            editor.isActive("codeBlock") ? styles.active : ""
          }`}
          title="Code Block"
        >
          <Code className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${styles.button} ${
            editor.isActive("blockquote") ? styles.active : ""
          }`}
          title="Quote"
        >
          <Quote className="w-5 h-5" />
        </button>
      </div>

      <div className={styles.toolSection}>
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={styles.button}
          title="Align Left"
        >
          <AlignLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={styles.button}
          title="Align Center"
        >
          <AlignCenter className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={styles.button}
          title="Align Right"
        >
          <AlignRight className="w-5 h-5" />
        </button>
      </div>

      {/* Undo/Redo */}
      <div className={styles.toolSection}>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className={styles.button}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className={styles.button}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="w-5 h-5" />
        </button>
      </div>

      {/* Links and Media */}
      <div className={styles.toolSection}>
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
          title="Insert Link"
        >
          <LinkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Clear Formatting */}
      <div className={styles.toolSection}>
        <button
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          className={styles.button}
          title="Clear Formatting"
        >
          <span className={styles.clearFormat}>Clear</span>
        </button>
      </div>
    </div>
  );
};

// Interface for blog post to fix the tags TypeScript error
interface BlogPost {
  title: string;
  categoryId: string;
  imageUrl: string;
  content: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminPostForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    imageUrl: "",
    tagsInput: "", // Renamed to avoid conflict with the BlogPost interface
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
      TextAlign.configure({
        types: ["heading", "paragraph"], // Apply alignment to headings and paragraphs
        alignments: ["left", "center", "right", "justify"], // Supported alignments
        defaultAlignment: "left", // Default alignment
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

  // New Cloudinary upload function
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);

      // Create form data for upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editor) return;

    setIsSubmitting(true);

    try {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // We'll process tags but not include them in the createBlogPost call
      // to avoid the TypeScript error
      const tagsArray = formData.tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const postData: BlogPost = {
        title: formData.title,
        categoryId: formData.categoryId,
        imageUrl: formData.imageUrl,
        content: editor.getHTML(),
        slug,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Store tags in localStorage or handle them separately if needed
      if (tagsArray.length > 0) {
        localStorage.setItem(`post_tags_${slug}`, JSON.stringify(tagsArray));
      }

      await createBlogPost(postData);
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
      <Header />
      <div className={styles.pgContain}>
        <div className={styles.formHeader}>
          <h2>Create a New Post</h2>
          <div className={styles.formActions}></div>
        </div>
        <form onSubmit={handleSubmit} className={styles.formContain}>
          <div className={styles.formGrid}>
            <div className={styles.mainColumn}>
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

              <div className={styles.tabPgThree}>
                <label className={styles.formLabel}>Content</label>
                {previewMode ? (
                  <div
                    className={styles.previewContent}
                    dangerouslySetInnerHTML={{
                      __html: editor ? editor.getHTML() : "",
                    }}
                  />
                ) : (
                  <div className="border rounded-md">
                    <MenuBar editor={editor} />
                    <EditorContent
                      editor={editor}
                      className={styles.editorContent}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className={styles.sideColumn}>
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
                  <option value="category4">Tutorial</option>
                  <option value="category5">News</option>
                  <option value="category6">Opinion</option>
                </select>
              </div>

              <div className={styles.tabPgFour}>
                <label className={styles.formLabel}>Featured Image</label>
                <div className={styles.upload}>
                  {formData.imageUrl ? (
                    <div className={styles.formData}>
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className={styles.imagePreview}
                      />
                      <button
                        type="button"
                        className={styles.removeImageBtn}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, imageUrl: "" }))
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <div className={styles.uploadIcon}>
                        <Camera className="w-6 h-6" />
                        <span>
                          {uploadingImage ? "Uploading..." : "Upload image"}
                        </span>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className={styles.uploadBtn}
                    disabled={uploadingImage}
                  />
                </div>
              </div>

              <div className={styles.tagsContainer}>
                <label className={styles.formLabel}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tagsInput}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tagsInput: e.target.value,
                    }))
                  }
                  className={styles.tagsInput}
                  placeholder="e.g. javascript, react, tutorial"
                />
              </div>
            </div>
          </div>

          <div className={styles.formFooter}>
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className={styles.previewBtn}
            >
              {previewMode ? "Edit" : "Preview"}
            </button>
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
