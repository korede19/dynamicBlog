import AllPostsPage from "@/components/allPostPage";
import Footer from "@/components/footer";
import React, { Suspense } from "react";

const AllPagePosts = () => {
  const categoryNames = {
    category1: "Fitness",
    category2: "Nutrition",
    category3: "Health & Wellness",
  };

return (
  <div>
      <Suspense fallback={<div>Loading...</div>}>
    <AllPostsPage categoryNames={categoryNames} />
    <Footer />
    </Suspense>
  </div>
  );
};

export default AllPagePosts;
