'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import styles from './FeedbacksBlock.module.css';

type Feedback = {
  _id: string;
  rate: number;
  description: string;
  name: string;
};

type FeedbacksResponse = {
  feedbacks: Feedback[];
};

const fetchFeedbacks = async (): Promise<Feedback[]> => {
  const res = await fetch('https://tool-next-backend.onrender.com/api/feedbacks');

  if (!res.ok) {
    throw new Error('Не вдалося завантажити відгуки');
  }

  const data: FeedbacksResponse = await res.json();
  return data.feedbacks;
};

const MAX_STARS = 5;
const MAX_PAGINATION_BULLETS = 5;

export default function FeedbacksBlock() {
  const { data: feedbacks, isLoading, error } = useQuery({
    queryKey: ['feedbacks'],
    queryFn: fetchFeedbacks,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const visibleFeedbacks = useMemo(
    () => (feedbacks ? feedbacks.slice(0, MAX_PAGINATION_BULLETS) : []),
    [feedbacks],
  );

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <p className={styles.statusText} aria-live="polite">
          Завантаження відгуків...
        </p>
      );
    }

    if (error) {
      return (
        <p className={styles.statusText} role="status" aria-live="polite">
          Помилка завантаження відгуків
        </p>
      );
    }

    if (visibleFeedbacks.length === 0) {
      return (
        <p className={styles.statusText} role="status" aria-live="polite">
          Поки немає відгуків
        </p>
      );
    }

    return (
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        navigation={{
          nextEl: '.feedbacks-next',
          prevEl: '.feedbacks-prev',
        }}
        pagination={{
          el: '.feedbacks-pagination',
          clickable: true,
        }}
        className={styles.swiper}
      >
        {visibleFeedbacks.map((fb) => {
          const normalizedRate = Math.max(0, Math.min(MAX_STARS, Math.round(fb.rate)));

          return (
            <SwiperSlide key={fb._id}>
              <article className={styles.card}>
                <div className={styles.stars} aria-label={`Оцінка: ${normalizedRate} з ${MAX_STARS}`}>
                  {Array.from({ length: MAX_STARS }, (_, index) => (
                    <span key={index} className={index < normalizedRate ? styles.starFilled : styles.starEmpty}>
                      ★
                    </span>
                  ))}
                </div>

                <p className={styles.text}>{fb.description}</p>
                <p className={styles.author}>{fb.name}</p>
              </article>
            </SwiperSlide>
          );
        })}
      </Swiper>
    );
  }, [visibleFeedbacks, isLoading, error]);

  return (
    <section className={styles.sectionWrapper} aria-labelledby="feedbacks-title">
      <div className={styles.container}>
        <h2 id="feedbacks-title" className={styles.title}>
          Останні відгуки
        </h2>

        {content}

        <div className={styles.swiperNav}>
          <div className={styles.swiperNavInner}>
            <div className={`feedbacks-pagination ${styles.pagination}`} aria-label="Пагінація відгуків" />
            <div className={styles.buttons}>
              <button className={`feedbacks-prev ${styles.navBtn}`} aria-label="Попередній відгук" type="button">
                <svg width="24" height="24" aria-hidden="true">
                  <use href="/icons.svg#icon-arrow-back" xlinkHref="/icons.svg#icon-arrow-back" />
                </svg>
              </button>
              <button className={`feedbacks-next ${styles.navBtn}`} aria-label="Наступний відгук" type="button">
                <svg width="24" height="24" aria-hidden="true">
                  <use href="/icons.svg#icon-arrow-forward" xlinkHref="/icons.svg#icon-arrow-forward" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}