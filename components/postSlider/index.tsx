"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { fetchPostsByCategory } from "../../lib/firestore";
import styles from "./styles.module.css";
import SkeletonLoader from "../skeletonLoader";

interface FirestoreTimestamp {
  toDate: () => Date;
}

interface BlogPost {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
  categoryId: string;
  createdAt: Date | FirestoreTimestamp;
  updatedAt: Date | FirestoreTimestamp;
  slug?: string;
}

interface CategorySliderProps {
  categoryId: string;
  categoryName: string;
}

const stripHtmlTags = (html: string) => {
  return html.replace(/<[^>]*>?/gm, "");
};

const formatDate = (dateValue: Date | FirestoreTimestamp) => {
  if (!dateValue) return "No date";

  let date: Date;

  if ("toDate" in dateValue) {
    date = dateValue.toDate();
  } else {
    date = dateValue as Date;
  }

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
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
        
        // Sort posts by creation date (most recent first) as a fallback
        // in case your Firestore query doesn't handle sorting
        const sortedPosts = fetchedPosts.sort((a, b) => {
          // Handle cases where createdAt might be undefined
          if (!a.createdAt || !b.createdAt) return 0;
          
          const dateA = "toDate" in a.createdAt ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = "toDate" in b.createdAt ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
        });
        
        setPosts(sortedPosts);
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
        <div className={styles.sliderContain}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={false}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            loop={false}
          >
            <SwiperSlide>
              <SkeletonLoader type="slide" />
            </SwiperSlide>
            <SwiperSlide>
              <SkeletonLoader type="slide" />
            </SwiperSlide>
            <SwiperSlide>
              <SkeletonLoader type="slide" />
            </SwiperSlide>
          </Swiper>
        </div>
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
            autoplay={{
              delay: 4000, // Slightly longer delay for reading
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={posts.length > 1}
            speed={800}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 1,
                spaceBetween: 30,
              },
            }}
          >
            {posts.map((post) => (
              <SwiperSlide key={post.id}>
                <div
                  className={styles.slide}
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${post.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className={styles.postMeta}>
                    <span className={styles.category}>{categoryName}</span>
                    <span className={styles.date}>
                      {formatDate(post.createdAt)}
                    </span>
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