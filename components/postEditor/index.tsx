"use client";
import React, { useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import MenuBar from "../menuBar";
import styles from "./styles.module.css";


const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

interface PostEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ content, onContentChange }) => {
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: "h-auto max-w-full rounded-lg my-4",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-4 focus:outline-none",
      },
    },
  });

  const handleImageUpload = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!fileInputRef.current) return resolve("");

      fileInputRef.current.onchange = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) return resolve("");

        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!res.ok) throw new Error("Upload failed");

          const data = await res.json();
          const imageUrl = data.secure_url;

          // Insert image into the editor
          editor?.chain().focus().setImage({ src: imageUrl }).run();

          resolve(imageUrl);
        } catch (err) {
          console.error("Image upload error:", err);
          reject(err);
        } finally {
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };

      fileInputRef.current.click();
    });
  };

  return (
    <div className={styles.tabPgThree}>
      <label className={styles.formLabel}>Content</label>
      {previewMode ? (
        <div
          className={styles.previewContent}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <div className="border rounded-md">
          <MenuBar editor={editor} onImageUploadRequest={handleImageUpload} />
          <EditorContent editor={editor} className={styles.editorContent} />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>
      )}
      <button
        type="button"
        onClick={() => setPreviewMode(!previewMode)}
        className={styles.previewBtn}
      >
        {previewMode ? "Edit" : "Preview"}
      </button>
    </div>
  );
};

export default PostEditor;
