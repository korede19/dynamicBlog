"use client";
import React, { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { CategorySliderProps } from "../../types/blog";
import { usePosts } from "../../hooks/usePosts";
import { getSwiperConfig } from "../../config/swiperConfig";
import BlogSlide from "../blogSlide/index";
import LoadingSlider from "../loadingSlider/index";
import styles from "./styles.module.css";

const CategorySlider = memo(({ categoryId, categoryName }: CategorySliderProps) => {
  const { posts, loading, error } = usePosts(categoryId);

  if (loading) {
    return (
      <div className={styles.sliderContainer}>
        <LoadingSlider />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.sliderContainer}>
        <div className={styles.error}>Error loading posts: {error}</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={styles.sliderContainer}>
        <div className={styles.noPosts}>No posts found for this category</div>
      </div>
    );
  }

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderContain}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          {...getSwiperConfig(posts.length)}
        >
          {posts.map((post) => (
            <SwiperSlide key={post.id}>
              <BlogSlide post={post} categoryName={categoryName} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
});

CategorySlider.displayName = "CategorySlider";

export default CategorySlider;