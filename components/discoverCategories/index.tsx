import React from "react";
import styles from "./styles.module.css";
import { categories } from "@/utils/data";
import Image from "next/image";

const DiscoverCategories = () => {
  return (
    <div className={styles.sectionContainer}>
      <h2 className={styles.sectionTitle}>Discover Categories</h2>
      <div className={styles.sectionContain}>
        {categories?.map((item, index) => {
          return (
            <div key={index} className={styles.categoryCard}>
              <Image
                src={item.image}
                alt={item.name}
                className={styles.categoryImage}
                width={400}
                height={400}
              />
              <div className={styles.categoryOverlay}>
                <h3>{item.name}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiscoverCategories;
