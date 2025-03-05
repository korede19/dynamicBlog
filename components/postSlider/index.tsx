"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import Link from "next/link";
import { fetchPostsByCategory } from "../../lib/firestore";
import styles from "./styles.module.css"; // Add your custom styles

interface BlogPost {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
  categoryId: string;
  slug?: string; // Ensure your post has a slug
}

const stripHtmlTags = (html: string) => {
  return html.replace(/<[^>]*>?/gm, "");
};

const CategorySlider = ({ categoryId }: { categoryId: string }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      const posts = await fetchPostsByCategory(categoryId);
      setPosts(posts);
    };

    loadPosts();
  }, [categoryId]);

  return (
    <div className={styles.sliderContainer}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
      >
        {posts.map((post) => (
          <SwiperSlide key={post.id}>
            <div className={styles.slide}>
              <img
                src={post.imageUrl}
                alt={post.title}
                className={styles.image}
              />
              <Link
                href={`/blog/${post.slug}`}
                passHref
                className={styles.blogLink}
              >
                <h3 className={styles.title}>{post.title}</h3>
              </Link>
              <div className={styles.postContent}>
                <p>{stripHtmlTags(post.content.slice(0, 200))}...</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategorySlider;
