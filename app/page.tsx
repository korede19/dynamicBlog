import * as React from "react";
import Header from "@/components/header";
import styles from "./page.module.css";
import CategorySlider from "@/components/postSlider";
import PostCard from "@/components/bgPostCard";
import DiscoverCategories from "@/components/discoverCategories";
import AllPosts from "@/components/allNews";
import Footer from "@/components/footer";

const LandingPage = () => {
  return (
    <>
      <Header />
      <div className={styles.heroCol}>
        <div className={styles.colOne}>
          <CategorySlider categoryName="Recent News" categoryId="category1" />
        </div>
        <div className={styles.colTwo}>
          <PostCard categoryId="category1" categoryName="Fitness" />
          <PostCard categoryId="category2" categoryName="Nutrition" />
        </div>
      </div>
      <DiscoverCategories />
      <AllPosts
        categoryIds={["category1", "category2"]}
        categoryNames={{
          category1: "Fitness",
          category2: "Nutrition",
        }}
      />
      <Footer />
    </>
  );
};

export default LandingPage;
