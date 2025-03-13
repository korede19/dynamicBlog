"use client";
import React, { useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import MenuBar from "../menuBar";
import Image from "@tiptap/extension-image";
import styles from "./styles.module.css";

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
          class: "h-48 w-auto",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 hover:underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
  });

  const handleImageUpload = async () => {
    if (!editor) {
      return Promise.resolve('');
    }
    
    fileInputRef.current?.click();
    return new Promise<string>((resolve) => {
      const handleFileChange = (event: Event) => {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageUrl = e.target?.result as string;
            editor.chain().focus().insertContent({
              type: 'image',
              attrs: { src: imageUrl }
            }).run();
            
            resolve(imageUrl);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            
            // Remove the one-time event listener
            fileInputRef.current?.removeEventListener('change', handleFileChange);
          };
          reader.readAsDataURL(file);
        } else {
          resolve('');
          fileInputRef.current?.removeEventListener('change', handleFileChange);
        }
      };
      fileInputRef.current?.addEventListener('change', handleFileChange);
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
          <MenuBar editor={editor} onImageUploadRequest={handleImageUpload}/>
          <EditorContent editor={editor} className={styles.editorContent} />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
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