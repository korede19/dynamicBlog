import { SwiperOptions } from "swiper/types";

export const getSwiperConfig = (postsLength: number): SwiperOptions => ({
  spaceBetween: 30,
  slidesPerView: 1,
  navigation: true,
  pagination: { clickable: true },
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  loop: postsLength > 1,
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
});

export const getLoadingSwiperConfig = (): SwiperOptions => ({
  spaceBetween: 30,
  slidesPerView: 1,
  navigation: false,
  pagination: { clickable: true },
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
  loop: false,
});