"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styles from "./FeedbacksBlock.module.css"; // використовуємо ті ж стилі
import FeedbacksSwiper from "./FeedbacksSwiper";
import FeedbackFormModal from "../FeedbackFormModal/FeedbackFormModal";
import { getToolFeedbacks } from "@/lib/api/clientApi";
import { Feedback } from "@/types/feedback";

interface Props {
  toolId: string;
}

export default function ToolFeedbacksBlock({ toolId }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["feedbacks", toolId],
    queryFn: () => getToolFeedbacks(toolId),
    staleTime: 5 * 60 * 1000,
  });

  const feedbacks: Feedback[] = useMemo(() => data?.feedbacks ?? [], [data]);

  return (
    <section className={styles.sectionWrapper} aria-labelledby="tool-feedbacks-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="tool-feedbacks-title" className={styles.title}>
            Відгуки користувачів
          </h2>
          <button className={styles.addFeedbackBtn} onClick={() => setIsModalOpen(true)}>
            Додати відгук
          </button>
        </div>

        {isLoading && (
          <p className={styles.statusText} aria-live="polite">
            Завантаження відгуків...
          </p>
        )}

        {isError && (
          <p className={styles.statusText} role="status" aria-live="polite">
            Помилка завантаження відгуків
          </p>
        )}

        {!isLoading && !isError && feedbacks.length === 0 && (
          <p className={styles.statusText}>Поки немає відгуків</p>
        )}

        {!isLoading && !isError && feedbacks.length > 0 && (
          <FeedbacksSwiper feedbacks={feedbacks} />
        )}

        {isModalOpen && (
          <FeedbackFormModal
            toolId={toolId}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              refetch();
              setIsModalOpen(false);
            }}
          />
        )}
      </div>
    </section>
  );
}
