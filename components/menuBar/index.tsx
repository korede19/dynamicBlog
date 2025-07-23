import React from "react";
import styles from "./styles.module.css";
import {
  Bold, Italic, List, Link as LinkIcon, Heading1, Heading2, Heading3,
  Code, ListOrdered, Quote, Undo, Redo,
  AlignLeft, AlignCenter, AlignRight, Image as ImageIcon
} from "lucide-react";
import { Editor } from "@tiptap/react";

const MenuBar = ({
  editor,
  onImageUploadRequest,
}: {
  editor: Editor | null;
  onImageUploadRequest?: () => Promise<string>;
}) => {
  if (!editor) return null;

  const handleImageUpload = async () => {
    if (!onImageUploadRequest) return;
    try {
      const imageUrl = await onImageUploadRequest();
      if (imageUrl) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className={styles.btnContain}>
      {/* Text formatting */}
      <div className={styles.toolSection}>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${styles.button} ${editor.isActive("bold") ? styles.active : ""}`} title="Bold">
          <Bold className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${styles.button} ${editor.isActive("italic") ? styles.active : ""}`} title="Italic">
          <Italic className="w-5 h-5" />
        </button>
      </div>

      {/* Headings */}
      <div className={styles.toolSection}>
        {[1, 2, 3].map((level) => (
          <button key={level} type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run()}
            className={`${styles.button} ${editor.isActive("heading", { level }) ? styles.active : ""}`}
            title={`Heading ${level}`}>
            {level === 1 ? <Heading1 className="w-5 h-5" /> : level === 2 ? <Heading2 className="w-5 h-5" /> : <Heading3 className="w-5 h-5" />}
          </button>
        ))}
      </div>

      {/* Lists */}
      <div className={styles.toolSection}>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${styles.button} ${editor.isActive("bulletList") ? styles.active : ""}`} title="Bullet List">
          <List className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${styles.button} ${editor.isActive("orderedList") ? styles.active : ""}`} title="Numbered List">
          <ListOrdered className="w-5 h-5" />
        </button>
      </div>

      {/* Blocks */}
      <div className={styles.toolSection}>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`${styles.button} ${editor.isActive("codeBlock") ? styles.active : ""}`} title="Code Block">
          <Code className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${styles.button} ${editor.isActive("blockquote") ? styles.active : ""}`} title="Quote">
          <Quote className="w-5 h-5" />
        </button>
      </div>

      {/* Alignment */}
      <div className={styles.toolSection}>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={styles.button} title="Align Left">
          <AlignLeft className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={styles.button} title="Align Center">
          <AlignCenter className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={styles.button} title="Align Right">
          <AlignRight className="w-5 h-5" />
        </button>
      </div>

      {/* Undo / Redo */}
      <div className={styles.toolSection}>
        <button type="button" onClick={() => editor.chain().focus().undo().run()}
          className={styles.button} disabled={!editor.can().undo()} title="Undo">
          <Undo className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()}
          className={styles.button} disabled={!editor.can().redo()} title="Redo">
          <Redo className="w-5 h-5" />
        </button>
      </div>

      {/* Media */}
      <div className={styles.toolSection}>
        <button type="button" onClick={() => {
          const url = window.prompt("Enter URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }} className={`${styles.button} ${editor.isActive("link") ? styles.active : ""}`} title="Insert Link">
          <LinkIcon className="w-5 h-5" />
        </button>
        <button type="button" onClick={handleImageUpload}
          className={styles.button} title="Insert Image">
          <ImageIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Clear */}
      <div className={styles.toolSection}>
        <button type="button"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className={styles.button} title="Clear Formatting">
          <span className={styles.clearFormat}>Clear</span>
        </button>
      </div>
    </div>
  );
};

export default MenuBar;
