"use client";
import React, { memo } from "react";
import styles from "./styles.module.css";

interface CategoryFiltersProps {
  categoryNames: Record<string, string>;
  currentCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

const CategoryFilters = memo(({ 
  categoryNames, 
  currentCategory, 
  onCategoryChange 
}: CategoryFiltersProps) => {
  if (!categoryNames || Object.keys(categoryNames).length === 0) {
    return null;
  }

  return (
    <div className={styles.categoryFilters}>
      <button
        onClick={() => onCategoryChange(null)}
        className={`${styles.filterButton} ${!currentCategory ? styles.active : ""}`}
        type="button"
      >
        All
      </button>
      {Object.entries(categoryNames).map(([id, name]) => (
        <button
          key={id}
          onClick={() => onCategoryChange(id)}
          className={`${styles.filterButton} ${
            currentCategory === id ? styles.active : ""
          }`}
          type="button"
        >
          {name}
        </button>
      ))}
    </div>
  );
});

CategoryFilters.displayName = "CategoryFilters";
export default CategoryFilters;