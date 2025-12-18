"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import StarsRating from "@/components/StarsRating/StarsRating";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import styles from "./FeedbacksBlock.module.css";
import { Feedback } from "@/types/feedback";

type Props = {
  feedbacks: Feedback[];
};

const MAX_STARS = 5;

export default function FeedbacksSwiper({ feedbacks }: Props) {
  return (
    <>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        navigation={{
          nextEl: ".feedbacks-next",
          prevEl: ".feedbacks-prev",
        }}
        pagination={{
          el: ".feedbacks-pagination",
          clickable: true,
          dynamicBullets: true,
        }}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1440: { slidesPerView: 3 },
        }}
        className={styles.swiper}
      >
        {feedbacks.map((fb) => {
          const normalizedRate = Math.max(0, Math.min(MAX_STARS));

          return (
            <SwiperSlide key={fb._id}>
              <article className={styles.card}>
                <StarsRating rating={normalizedRate} />

                <p className={styles.text}>{fb.description}</p>

                <p className={styles.author}>{fb.name}</p>
              </article>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className={styles.swiperNav}>
        <div className={styles.swiperNavInner}>
          <div
            className={`feedbacks-pagination ${styles.pagination}`}
            aria-label="Пагінація відгуків"
          />

          <div className={styles.buttons}>
            <button
              className={`feedbacks-prev ${styles.navBtn}`}
              aria-label="Попередній відгук"
              type="button"
            >
              <svg width="24" height="24" aria-hidden="true">
                <use href="/icons.svg#icon-arrow-back" />
              </svg>
            </button>

            <button
              className={`feedbacks-next ${styles.navBtn}`}
              aria-label="Наступний відгук"
              type="button"
            >
              <svg width="24" height="24" aria-hidden="true">
                <use href="/icons.svg#icon-arrow-forward" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
