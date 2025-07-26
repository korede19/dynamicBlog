import AllPostsPage from "@/components/allPostPage";
import Footer from "@/components/footer";
import React from "react";
// import { useSearchParams } from "next/navigation"; // Import for Next.js App Router

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
