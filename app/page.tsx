import * as React from "react";
import Header from "@/components/header";
import styles from './page.module.css'
import CategorySlider from "@/components/postSlider";
import PostCard from "@/components/bgPostCard";


const LandingPage = () => {
  return (
    <>
      <Header />
      <div className={styles.heroCol}>
        <div className={styles.colOne}>
      <CategorySlider categoryName="Recent News" categoryId="category5" />
      </div>
      <div className={styles.colTwo}>
        <PostCard categoryId="category5" categoryName="Business" />
        <PostCard categoryId="category5" categoryName="Business" />
      </div>
      </div>
    </>
  );
};

export default LandingPage;
