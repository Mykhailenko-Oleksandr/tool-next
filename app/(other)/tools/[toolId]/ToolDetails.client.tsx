"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./ToolDetailsPage.module.css";
import { fetchToolById } from "@/lib/api/clientApi";
import Loading from "@/app/loading";
import Modal from "@/components/Modal/Modal";
import ToolFeedbacksBlock from "@/components/ToolFeedbacksBlock/ToolFeedbacksBlock";
import ToolInfoBlock from "../../../../components/ToolInfoBlock/ToolInfoBlock";
import { useToolFeedbacks } from "@/lib/hooks/useFeedbacks";

interface ToolDetailsClientProps {
  toolId: string;
}

export default function ToolDetailsClient({ toolId }: ToolDetailsClientProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const {
    data: tool,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tool", toolId],
    queryFn: () => fetchToolById(toolId),
    refetchOnMount: false,
  });

  // Підтягуємо відгуки для рейтингу і підрахунку кількості
  const { data: feedbacks } = useToolFeedbacks(toolId);

  // Рахуємо середній рейтинг та кількість відгуків
  const { averageRating, feedbackCount } = useMemo(() => {
    if (!feedbacks || feedbacks.length === 0) return { averageRating: 0, feedbackCount: 0 };
    const total = feedbacks.reduce((acc, fb) => acc + fb.rate, 0);
    return { averageRating: total / feedbacks.length, feedbackCount: feedbacks.length };
  }, [feedbacks]);

  const handleBookClick = () => {
    if (isAuthenticated) {
      router.push(`/tools/booking/${toolId}`);
    } else {
      setShowAuthModal(true);
    }
  };

  if (isLoading) return <Loading />;

  if (error || !tool) {
    return (
      <section className={css.main}>
        <div className={"container"}>
          <div className={css.error}>Помилка завантаження інструменту. Спробуйте пізніше.</div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className={css.main}>
        <div className="container">
          <div className={css.content}>
            <div className={css.imageWrapper}>
              {tool.images && tool.images.trim() !== "" ? (
                <Image
                  src={tool.images}
                  alt={tool.name}
                  width={600}
                  height={400}
                  className={css.image}
                  priority
                />
              ) : (
                <Image
                  src="/images/blank-image-mob.webp"
                  alt={tool.name}
                  width={600}
                  height={400}
                  className={css.image}
                  priority
                />
              )}
            </div>

            <div className={css.details}>
              <h1 className={css.title}>{tool.name}</h1>
              <p className={css.price}>{tool.pricePerDay} грн/день</p>

              <div className={css.ownerBlock}>
                <div className={css.ownerInfo}>
                  {typeof tool.owner !== "string" && tool.owner.avatarUrl ? (
                    <Image
                      src={tool.owner.avatarUrl}
                      alt={tool.owner.name}
                      width={80}
                      height={80}
                      className={css.ownerAvatar}
                    />
                  ) : (
                    <div className={css.ownerAvatarPlaceholder}>
                      {typeof tool.owner !== "string" && tool.owner.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className={css.ownerDetails}>
                    <p className={css.ownerName}>
                      {typeof tool.owner !== "string" && tool.owner.name}
                    </p>
                    <Link
                      href={`/profile/${typeof tool.owner !== "string" && tool.owner._id}`}
                      className={css.profileLink}
                    >
                      Переглянути профіль
                    </Link>
                  </div>
                </div>
              </div>

              <div className={css.section}>
                <p className={css.description}>{tool.description}</p>
              </div>

              <div className={css.section}>
                <ul className={css.specsList}>
                  {tool.specifications && Object.keys(tool.specifications).length > 0
                    ? Object.entries(tool.specifications).map(([key, value]) => (
                        <li key={key} className={css.specsListItem}>
                          <span className={css.specKey}>{key}: </span>
                          <span className={css.specValue}>{String(value)}</span>
                        </li>
                      ))
                    : null}
                  <li className={css.section}>
                    <span className={css.specKey}>Умови оренди: </span>
                    <span className={css.specValue}>{tool.rentalTerms}</span>
                  </li>
                </ul>
              </div>

              <button type="button" className={css.bookButton} onClick={handleBookClick}>
                Забронювати
              </button>
            </div>
          </div>
          <div className={css.detalisFeedbacks}>
            <ToolFeedbacksBlock toolId={tool._id} />
            <ToolInfoBlock
              tool={{
                ...tool,
                averageRating,
                feedbackCount,
              }}
            />
          </div>
        </div>
      </section>

      {showAuthModal && (
        <Modal
          title="Спочатку авторизуйтесь"
          confirmButtonText="Реєстрація"
          cancelButtonText="Вхід"
          onClose={() => setShowAuthModal(false)}
          onConfirm={() => {
            setShowAuthModal(false);
            router.push("/auth/register");
          }}
          onCancel={() => {
            setShowAuthModal(false);
            router.push("/auth/login");
          }}
        >
          Щоб забронювати інструмент, треба спочатку зареєструватись або авторизуватись на платформі
        </Modal>
      )}
    </>
  );
}
