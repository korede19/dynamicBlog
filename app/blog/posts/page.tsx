import AllPostsPage from '@/components/allPostPage';
import Footer from '@/components/footer';
import React from 'react'

const AllPagePosts = () => {
  return (
    <div>
      <AllPostsPage categoryNames={{
        category1: "Fitness",
        category2: "Nutrition",
        category3: "Health & Wellness",
      }} />
      <Footer />
    </div>  
  )
}

export default AllPagePosts;
