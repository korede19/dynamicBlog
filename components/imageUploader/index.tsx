"use client";
import React, { ChangeEvent } from "react";
import { Camera } from "lucide-react";
import styles from "./styles.module.css";
import Image from "next/image";

interface ImageUploaderProps {
  imageUrl: string;
  uploadingImage: boolean;
  onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl,
  uploadingImage,
  onImageUpload,
  onRemoveImage,
}) => {
  return (
    <div className={styles.upload}>
      {imageUrl ? (
        <div className={styles.formData}>
          <Image src={imageUrl} width={400} height={400} alt="Preview" className={styles.imagePreview}  />
          <button
            type="button"
            className={styles.removeImageBtn}
            onClick={onRemoveImage}
          >
            Remove
          </button>
          <br />
        </div>
      ) : (
        <div className={styles.uploadPlaceholder}>
          <div className={styles.uploadIcon}>
            <Camera />
            <span>{uploadingImage ? "Uploading..." : "Upload image"}</span>
          </div>
        </div>
      )}
      <input
        type="file"
        onChange={onImageUpload}
        accept="image/*"
        className={styles.uploadBtn}
        disabled={uploadingImage}
      />
    </div>
  );
};

export default ImageUploader;