"use client";

import React, { useEffect, useState, useMemo, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { fetchPostsByCategory } from "../../lib/firestore";
import styles from "./styles.module.css";
import SkeletonLoader from "../skeletonLoader";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
  priority?: boolean;
}

// Optimized utility functions
const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>?/gm, "");
};

const formatDate = (dateValue: Date | FirestoreTimestamp): string => {
  if (!dateValue) return "No date";

  let date: Date;
  try {
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
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};


const buildOptimizedImageUrl = (imageUrl: string, width: number = 800, height: number = 450): string => {
  if (!imageUrl) return '';
  
  if (imageUrl.includes('res.cloudinary.com')) {
    const parts = imageUrl.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/q_auto,f_auto,w_${width},h_${height},c_fill,g_auto/${parts[1]}`;
    }
  }
  
  return imageUrl;
};

const SlideContent = memo(({ 
  post, 
  categoryName, 
  priority = false 
}: { 
  post: BlogPost; 
  categoryName: string; 
  priority?: boolean;
}) => {
  const optimizedImageUrl = useMemo(() => 
    buildOptimizedImageUrl(post.imageUrl, 800, 450), [post.imageUrl]
  );

  const truncatedContent = useMemo(() => 
    stripHtmlTags(post.content).slice(0, 150), [post.content]
  );

  return (
    <div className={styles.slide}>
      <div className={styles.imageContainer}>
        <Image
          src={optimizedImageUrl}
          alt={post.title}
          fill
          style={{ objectFit: 'cover' }}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          sizes="(max-width: 768px) 100vw, 800px"
        />
        <div className={styles.overlay} />
      </div>
      
      <div className={styles.content}>
        <div className={styles.postMeta}>
          <span className={styles.category}>{categoryName}</span>
          <span className={styles.date}>
            {formatDate(post.createdAt)}
          </span>
        </div>
        
        <Link
          href={`/blog/${post.slug}`}
          className={styles.blogLink}
          aria-label={`Read article: ${post.title}`}
        >
          <h3 className={styles.title}>{post.title}</h3>
        </Link>
        
        <div className={styles.postContent}>
          <p>{truncatedContent}...</p>
        </div>
        
        <Link
          href={`/blog/${post.slug}`}
          className={styles.readMore}
          aria-label={`Read more about ${post.title}`}
        >
          Read More
        </Link>
      </div>
    </div>
  );
});

SlideContent.displayName = 'SlideContent';

const CategorySlider = memo(({ 
  categoryId, 
  categoryName, 
  priority = false 
}: CategorySliderProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      if (!categoryId) return;

      setLoading(true);
      setError(false);
      
      try {
        const fetchedPosts = await fetchPostsByCategory(categoryId);
        
        if (!isMounted) return;

        // Sort posts by creation date (most recent first)
        const sortedPosts = fetchedPosts.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          
          const dateA = "toDate" in a.createdAt ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = "toDate" in b.createdAt ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
        
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error loading posts:", error);
        if (isMounted) {
          setPosts([]);
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, [categoryId]);

  // Memoized Swiper configuration
  const swiperConfig = useMemo(() => ({
    modules: [Navigation, Pagination, Autoplay],
    spaceBetween: 30,
    slidesPerView: 1,
    navigation: true,
    pagination: { clickable: true },
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    loop: posts.length > 1,
    speed: 800,
    breakpoints: {
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
    },
  }), [posts.length]);

  if (loading) {
    return (
      <div className={styles.sliderContainer}>
        <div className={styles.sliderContain}>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={false}
            pagination={{ clickable: true }}
            loop={false}
          >
            {[1, 2, 3].map((index) => (
              <SwiperSlide key={index}>
                <SkeletonLoader type="slide" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    );
  }

  if (error || posts.length === 0) {
    return (
      <div className={styles.sliderContainer}>
        <div className={styles.noPosts}>
          {error ? "Error loading posts" : "No posts found for this category"}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderContain}>
        <Swiper {...swiperConfig}>
          {posts.map((post, index) => (
            <SwiperSlide key={post.id}>
              <SlideContent 
                post={post} 
                categoryName={categoryName}
                priority={priority && index === 0} // Only prioritize first slide
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
});

CategorySlider.displayName = 'CategorySlider';

export default CategorySlider;