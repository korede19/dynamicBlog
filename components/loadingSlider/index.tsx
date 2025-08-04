import React, { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { getLoadingSwiperConfig } from "../../config/swiperConfig";
import SkeletonLoader from "../skeletonLoader";
import styles from "./styles.module.css";

const LoadingSlider = memo(() => (
  <div className={styles.sliderContain}>
    <Swiper modules={[Navigation, Pagination, Autoplay]} {...getLoadingSwiperConfig()}>
      {[...Array(3)].map((_, index) => (
        <SwiperSlide key={index}>
          <SkeletonLoader type="slide" />
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
));

LoadingSlider.displayName = "LoadingSlider";

export default LoadingSlider;