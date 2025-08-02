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
      <AllPostsPage categoryNames={categoryNames} />
      <Footer />
    </div>
  );
};

export default AllPagePosts;
