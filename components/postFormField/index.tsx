"use client";
import React, { ChangeEvent } from "react";
import styles from "./styles.module.css";
import ImageUploader from "../imageUploader";

interface PostFormFieldsProps {
  formData: {
    title: string;
    categoryId: string;
    imageUrl: string;
    tagsInput: string;
  };
  uploadingImage: boolean;
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onTagsChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

const PostFormFields: React.FC<PostFormFieldsProps> = ({
  formData,
  uploadingImage,
  onTitleChange,
  onCategoryChange,
  onTagsChange,
  onImageUpload,
  onRemoveImage,
}) => {
  return (
    <div className={styles.formGrid}>
      <div className={styles.mainColumn}>
        <div className={styles.titleForm}>
          <label className={styles.formLabel}>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={onTitleChange}
            className={styles.mainForm}
            required
          />
        </div>
      </div>

      <div className={styles.sideColumn}>
        <div className={styles.tabPgTwo}>
          <label className={styles.formLabel}>Category</label>
          <select
            value={formData.categoryId}
            onChange={onCategoryChange}
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
          
          <ImageUploader
            imageUrl={formData.imageUrl}
            uploadingImage={uploadingImage}
            onImageUpload={onImageUpload}
            onRemoveImage={onRemoveImage}
          />
        </div>

        <div className={styles.tagsContainer}>
          <label className={styles.formLabel}>Tags (comma separated)</label>
          <input
            type="text"
            value={formData.tagsInput}
            onChange={onTagsChange}
            className={styles.tagsInput}
            placeholder="e.g. javascript, react, tutorial"
          />
        </div>
      </div>
    </div>
  );
};

export default PostFormFields;