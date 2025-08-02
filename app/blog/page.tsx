import AllPostsPage from "@/components/allPostPage";
import Footer from "@/components/footer";
import React from "react";
export const dynamic = 'force-dynamic';


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
