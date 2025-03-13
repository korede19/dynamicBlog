import React, { useRef } from "react";
import styles from "./styles.module.css";
import {
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
  Image as ImageIcon,
} from "lucide-react";
import { Editor } from "@tiptap/react";

const MenuBar = ({ editor, onImageUploadRequest }: { editor: Editor | null, onImageUploadRequest?: () => Promise<string> }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) {
    return null;
  }

  const handleImageUpload = async () => {
    if (onImageUploadRequest) {
      try {
        const imageUrl = await onImageUploadRequest();
        if (imageUrl) {
          editor.chain().focus().insertContent({
            type: 'image',
            attrs: { src: imageUrl }
          }).run();
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        editor.chain().focus().insertContent({
          type: 'image',
          attrs: { src: imageUrl }
        }).run();
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.btnContain}>
      <div className={styles.toolSection}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${styles.button} ${
            editor.isActive("bold") ? styles.active : ""
          }`}
          title="Bold"
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${styles.button} ${
            editor.isActive("italic") ? styles.active : ""
          }`}
          title="Italic"
        >
          <Italic className="w-5 h-5" />
        </button>
      </div>

      <div className={styles.toolSection}>
        <button
          type="button"
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
          type="button"
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
          type="button"
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
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${styles.button} ${
            editor.isActive("bulletList") ? styles.active : ""
          }`}
          title="Bullet List"
        >
          <List className="w-5 h-5" />
        </button>
        <button
          type="button"
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
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`${styles.button} ${
            editor.isActive("codeBlock") ? styles.active : ""
          }`}
          title="Code Block"
        >
          <Code className="w-5 h-5" />
        </button>
        <button
          type="button"
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
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={styles.button}
          title="Align Left"
        >
          <AlignLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={styles.button}
          title="Align Center"
        >
          <AlignCenter className="w-5 h-5" />
        </button>
        <button
          type="button"
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
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className={styles.button}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="w-5 h-5" />
        </button>
        <button
          type="button"
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
          type="button"
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
        <button
          type="button"
          onClick={handleImageUpload}
          className={styles.button}
          title="Insert Image"
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="image/*"
          style={{ display: "none" }}
        />
      </div>

      {/* Clear Formatting */}
      <div className={styles.toolSection}>
        <button
          type="button"
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

export default MenuBar;