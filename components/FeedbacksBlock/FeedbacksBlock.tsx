'use client';

import SvgIcon from './SvgIcon';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import styles from './FeedbacksBlock.module.css';


type Feedback = {
  id: number;
  rating: number;
  text: string;
  author: string;
};

const fetchFeedbacks = async (): Promise<Feedback[]> => {
  const res = await fetch('https://tool-next-backend.onrender.com/api/feedbacks');
  if (!res.ok) {
    throw new Error('Не вдалося завантажити відгуки');
  }
  return res.json();
};

export default function FeedbacksBlock() {
  const { data: feedbacks, isLoading, error } = useQuery({
    queryKey: ['feedbacks'],
    queryFn: fetchFeedbacks,
  });

  if (isLoading) {
    return <p>Завантаження відгуків...</p>;
  }

  if (error) {
    return <p>Помилка завантаження відгуків</p>;
  }

  return (
    <section className={styles.feedbacksSection}>
      <h2 className={styles.title}>Останні відгуки</h2>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {feedbacks?.map((fb) => (
          <SwiperSlide key={fb.id}>
            <div className={styles.card}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, index) => {
                  const full = index + 1 <= Math.floor(fb.rating);
                  const half = index + 1 > fb.rating && index < fb.rating;
                  const iconId = full
                    ? 'icon-star-full'
                    : half
                    ? 'icon-star-half'
                    : 'icon-star';
                  return (
                    <SvgIcon
                      key={index}
                      id={iconId}
                      width={24}
                      height={24}
                    />
                  );
                })}
              </div>
              <p className={styles.text}>{fb.text}</p>
              <p className={styles.author}>{fb.author}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
