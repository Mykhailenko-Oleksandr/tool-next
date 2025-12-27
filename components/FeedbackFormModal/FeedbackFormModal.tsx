"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCreateFeedback } from "@/lib/hooks/useFeedbacks";
import StarsRating from "@/components/StarsRating/StarsRating";
import { CreateFeedbackDto } from "@/lib/api/clientApi";
import { useUser } from "@/lib/hooks/useUser";
import css from "./FeedbackFormModal.module.css";

interface Props {
  toolId: string;
  onClose: () => void;
}

const FeedbackFormModal = ({ toolId, onClose }: Props) => {
  const { user } = useUser();
  const isAuthorized = Boolean(user);

  const [name, setName] = useState<string>(user?.name || "");
  const [description, setDescription] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [errors, setErrors] = useState({ name: "", description: "", rating: "" });

  const mutation = useCreateFeedback(toolId, onClose);

  // Блокування скролу фону
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Закриття по ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const validate = () => {
    const newErrors = { name: "", description: "", rating: "" };
    if (!name.trim()) newErrors.name = "Імʼя є обовʼязковим";
    else if (name.trim().length < 2) newErrors.name = "Імʼя має містити мінімум 2 символи";

    if (!description.trim()) newErrors.description = "Відгук є обовʼязковим полем";
    else if (description.trim().length < 10)
      newErrors.description = "Відгук має містити мінімум 10 символів";

    if (rating === 0) newErrors.rating = "Оберіть рейтинг";

    setErrors(newErrors);
    return !newErrors.name && !newErrors.description && !newErrors.rating;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAuthorized) return;
    if (!validate()) return;

    const dto: CreateFeedbackDto = {
      toolId,
      name: name.trim(),
      description: description.trim(),
      rate: rating,
    };
    mutation.mutate(dto);
  };

  const isSubmitting = mutation.status === "pending";

  return createPortal(
    <div className={css.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={css.modal}>
        <button className={css.close} onClick={onClose}>
          <svg width="24" height="24">
            <use href="/icons.svg#icon-close" />
          </svg>
        </button>

        <h2 className={css.title}>Залишити відгук на товар</h2>

        {!isAuthorized ? (
          <p className={css.authWarning}>Щоб залишити відгук, потрібно авторизуватись</p>
        ) : (
          <form className={css.form} onSubmit={handleSubmit}>
            <div className={css.formItem}>
              <label htmlFor="username">Імʼя</label>
              <input
                id="username"
                type="text"
                placeholder="Ім'я"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${css.input} ${errors.name ? css.errorInput : ""}`}
              />
              {errors.name && <p className={css.errorMsg}>{errors.name}</p>}
            </div>

            <div className={css.formItem}>
              <label htmlFor="feedback">Відгук</label>
              <textarea
                id="feedback"
                placeholder="Ваш відгук"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${css.textarea} ${errors.description ? css.errorInput : ""}`}
              />
              {errors.description && <p className={css.errorMsg}>{errors.description}</p>}
            </div>

            <div className={css.ratingBlock}>
              <label>Оцінка</label>
              <StarsRating rating={rating} onChange={setRating} />
              {errors.rating && <p className={css.errorMsg}>{errors.rating}</p>}
            </div>

            {mutation.error && (
              <p className={css.serverError}>
                {mutation.error.message || "Сталася помилка. Спробуйте пізніше"}
              </p>
            )}
            <div className={css.submitWrapper}>
              <button type="submit" disabled={!isAuthorized || isSubmitting} className={css.submit}>
                {!isAuthorized
                  ? "Увійдіть, щоб надіслати"
                  : isSubmitting
                    ? "Надсилання..."
                    : "Надіслати"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default FeedbackFormModal;
