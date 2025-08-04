import * as React from "react";
import Script from "next/script";
import styles from "./page.module.css";
import CategorySlider from "@/components/postSlider";
import PostCard from "@/components/bgPostCard";
import DiscoverCategories from "@/components/discoverCategories";
import AllPosts from "@/components/allNews";
import Footer from "@/components/footer";

const categoryData = {
  categoryIds: ["category1", "category2", "category3"],
  categoryNames: {
    category1: "Fitness",
    category2: "Nutrition",
    category3: "Health & Wellness",
  },
};

const AdUnit = React.memo(() => (
  <div className={styles.newCol}>
    <Script
      src="//pl27261617.profitableratecpm.com/cf13a514ad8f0327c56109e0993b42c4/invoke.js"
      strategy="lazyOnload"
      data-cfasync="false"
    />
    <div id="container-cf13a514ad8f0327c56109e0993b42c4"></div>
  </div>
));

AdUnit.displayName = "AdUnit";

const LandingPage = () => {
  return (
    <>
      <div className={styles.heroCol}>
        <div className={styles.colOne}>
          <CategorySlider categoryName="Recent News" categoryId="category1" />
        </div>
        <div className={styles.colTwo}>
          <PostCard categoryId="category1" categoryName="Fitness" />
          <PostCard categoryId="category2" categoryName="Nutrition" />
        </div>
      </div>
      {/* <AdUnit /> */}

      <DiscoverCategories />

      <AllPosts
        categoryIds={categoryData.categoryIds}
        categoryNames={categoryData.categoryNames}
      />
      {/* <AdUnit /> */}
      <Footer />
    </>
  );
};

export default LandingPage;
