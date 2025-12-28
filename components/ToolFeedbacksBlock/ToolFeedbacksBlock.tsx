"use client";

import { useMemo } from "react";
import styles from "./ToolFeedbacksBlock.module.css";
import FeedbacksSwiper from "@/components/FeedbacksBlock/FeedbacksSwiper";
import { Feedback } from "@/types/feedback";

// V2807: Блок отзывов для страницы инструмента (переиспользуем основной FeedbacksSwiper).
interface ToolFeedbacksBlockProps {
  feedbacks: Feedback[];
  onOpenFeedbackForm?: () => void;
}

export default function ToolFeedbacksBlock({
  feedbacks,
  onOpenFeedbackForm,
}: ToolFeedbacksBlockProps) {
  const visibleFeedbacks = useMemo(() => feedbacks ?? [], [feedbacks]);

  return (
    <section
      className={styles.sectionWrapper}
      aria-labelledby="tool-feedbacks-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2
            id="tool-feedbacks-title"
            className={styles.title}>
            Відгуки
          </h2>
          {onOpenFeedbackForm && (
            <button
              type="button"
              className={styles.addFeedbackButton}
              onClick={onOpenFeedbackForm}
              aria-label="Додати відгук">
              Залишити відгук
            </button>
          )}
        </div>

        {visibleFeedbacks.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>
              <span className={styles.emptyTitleMobile}>У вас немає жодного відгуку</span>
              <span className={styles.emptyTitleDesktop}>У цього інструменту немає жодного відгуку</span>
            </p>
            <p className={styles.emptyText}>Ми впевнені скоро їх буде значно більше!</p>
          </div>
        )}

        {visibleFeedbacks.length > 0 && (
          <FeedbacksSwiper feedbacks={visibleFeedbacks} />
        )}
      </div>
    </section>
  );
}


