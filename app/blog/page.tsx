import AllPostsPage from "@/components/allPostPage";
import Footer from "@/components/footer";
import React from "react";
import styles from "./styles.module.css";

const AllPagePosts = () => {
  const categoryNames = {
    category1: "Fitness",
    category2: "Nutrition",
    category3: "Health & Wellness",
  };

  return (
    <div>
       <div className={styles.newCol}>
       <script
          async
          data-cfasync="false"
          src="//pl27261617.profitableratecpm.com/cf13a514ad8f0327c56109e0993b42c4/invoke.js"
        ></script>
        <div id="container-cf13a514ad8f0327c56109e0993b42c4"></div>
        </div>
      <AllPostsPage categoryNames={categoryNames} />
      <Footer />
    </div>
  );
};

export default AllPagePosts;
