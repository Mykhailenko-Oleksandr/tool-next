"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import StarsRating from "@/components/StarsRating/StarsRating";
import { Feedback } from "@/types/feedback";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import css from "./ToolInfoBlock.module.css";

type Props = {
  feedbacks: Feedback[];
};

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
        className={css.swiper}
      >
        {feedbacks.map((fb) => (
          <SwiperSlide key={fb._id}>
            <article className={css.card}>
              <StarsRating rating={fb.rate} />
              <p className={css.text}>{fb.description}</p>
              <p className={css.author}>{fb.name}</p>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={css.swiperNav}>
        <div className={css.swiperNavInner}>
          <div
            className={`feedbacks-pagination ${css.pagination}`}
            aria-label="Пагінація відгуків"
          />

          <div className={css.buttons}>
            <button
              className={`feedbacks-prev ${css.navBtn}`}
              aria-label="Попередній відгук"
              type="button"
            >
              <svg width="24" height="24" aria-hidden="true">
                <use href="/icons.svg#icon-arrow-back" />
              </svg>
            </button>

            <button
              className={`feedbacks-next ${css.navBtn}`}
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
