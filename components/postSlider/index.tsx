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
import styles from "./styles.module.css"; 

interface BlogPost {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
  categoryId: string;
  createdAt: any; // Changed to any to handle both Date and Firestore timestamp
  updatedAt: any;
  slug?: string;
}

interface CategorySliderProps {
  categoryId: string;
  categoryName: string;
}

const stripHtmlTags = (html: string) => {
  return html.replace(/<[^>]*>?/gm, "");
};

// Improved date formatting function to handle different date formats
const formatDate = (dateValue: any) => {
  if (!dateValue) return "No date";
  
  let date;
  
  // Check if it's a Firestore timestamp (has toDate method)
  if (dateValue && typeof dateValue.toDate === 'function') {
    date = dateValue.toDate();
  } 
  // Check if it's already a Date object
  else if (dateValue instanceof Date) {
    date = dateValue;
  } 
  // Check if it's a timestamp number
  else if (typeof dateValue === 'number') {
    date = new Date(dateValue);
  }
  // Check if it's a string that can be parsed
  else if (typeof dateValue === 'string') {
    date = new Date(dateValue);
  }
  else {
    return "Invalid date";
  }
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const CategorySlider = ({ categoryId, categoryName }: CategorySliderProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPosts = async () => {
      if (!categoryId) return;
      
      setLoading(true);
      try {
        const fetchedPosts = await fetchPostsByCategory(categoryId);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error loading posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [categoryId]);

  return (
    <div className={styles.sliderContainer}>      
      {loading ? (
        <div className={styles.loading}>Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className={styles.noPosts}>No posts found for this category</div>
      ) : (
        <div className={styles.sliderContain}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop={posts.length > 3}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20
            },
            640: {
              slidesPerView: 1,
              spaceBetween: 20
            },
            1024: {
              slidesPerView: 1,
              spaceBetween: 30
            }
          }}
        >
          {posts.map((post) => (
            <SwiperSlide key={post.id}>
              <div 
                className={styles.slide}
                style={{ 
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${post.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className={styles.postMeta}>
                  <span className={styles.category}>{categoryName}</span>
                  <span className={styles.date}>{formatDate(post.createdAt)}</span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  passHref
                  className={styles.blogLink}
                >
                  <h3 className={styles.title}>{post.title}</h3>
                </Link>
                <div className={styles.postContent}>
                  <p>{stripHtmlTags(post.content.slice(0, 350))}...</p>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  passHref
                  className={styles.readMore}
                >
                  Read More
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      )}
    </div>
  );
};

export default CategorySlider;