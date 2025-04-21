import AllPostsPage from '@/components/allPostPage';
import Footer from '@/components/footer';
import Header from '@/components/header';
import React from 'react'

const AllPagePosts = () => {
  return (
    <div>
      <Header />
      <AllPostsPage categoryNames={{
        category1: "Fitness",
        category2: "Nutrition",
      }} />
      <Footer />
    </div>
  )
}

export default AllPagePosts;
