"use client";
import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import MenuBar from "../menuBar";
import styles from "./styles.module.css";

interface PostEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ content, onContentChange }) => {
  const [previewMode, setPreviewMode] = useState(false);

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
          <MenuBar editor={editor} />
          <EditorContent editor={editor} className={styles.editorContent} />
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