"use client";

import { createPortal } from "react-dom";
import {
  useEffect,
  useState,
  useCallback,
  type MouseEvent,
  FormEvent,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/authStore";
import toast from "react-hot-toast";
import styles from "./FeedbackFormModal.module.css";
import { createFeedback, CreateFeedbackData } from "@/lib/api/clientApi";
import { ApiError } from "@/app/api/api";
import StarsRating from "../StarsRating/StarsRating";

interface FeedbackFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolId?: string;
}

export default function FeedbackFormModal({
  isOpen,
  onClose,
  toolId,
}: FeedbackFormModalProps) {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState(0);
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    rate?: string;
  }>({});

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen && isAuthenticated && user?.name) {
      setName(user.name);
    }
  }, [isOpen, isAuthenticated, user]);

  const handleClose = useCallback(() => {
    setName("");
    setDescription("");
    setRate(0);
    setErrors({});
    onClose();
  }, [onClose]);

  const mutation = useMutation({
    mutationFn: (data: CreateFeedbackData) => createFeedback(data),
    onSuccess: () => {
      toast.success("Відгук успішно опубліковано!");
      handleClose();

      queryClient.invalidateQueries({
        queryKey: ["tool", toolId, "withFeedbacks"],
        exact: true,
        refetchType: "active",
      });
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
    onError: (error: unknown) => {
      const err = error as ApiError;

      if (err.response?.status === 401) {
        toast.error("Спочатку авторизуйтесь для відправки відгуку");
        handleClose();
      } else {
        const errorMessage =
          err.response?.data?.response?.validation?.body?.message ||
          err.response?.data?.response?.message ||
          err.message ||
          "Помилка відправки відгуку. Спробуйте ще раз.";
        toast.error(errorMessage);
        setErrors({
          rate: "Помилка відправки відгуку. Спробуйте ще раз.",
        });
      }
    },
  });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose]);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Ім'я обов'язкове";
    }

    if (!description.trim()) {
      newErrors.description = "Відгук обов'язковий";
    }

    if (rate === 0) {
      newErrors.rate = "Оберіть оцінку";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    mutation.mutate({
      name: name.trim(),
      description: description.trim(),
      rate,
      toolId,
    });
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label="Закрити модалку"
        >
          <svg width="32" height="32" viewBox="0 0 32 32">
            <use href="/icons.svg#icon-close" />
          </svg>
        </button>

        <h2 className={styles.title}>Залишити відгук на товар</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Ім&#39;я
            </label>
            <input
              id="name"
              type="text"
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введіть ваше ім'я"
            />
            {errors.name && (
              <span className={styles.errorMessage}>{errors.name}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Відгук
            </label>
            <textarea
              id="description"
              className={`${styles.textarea} ${errors.description ? styles.inputError : ""}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Напишіть ваш відгук"
              rows={5}
            />
            {errors.description && (
              <span className={styles.errorMessage}>{errors.description}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.ratingLabel}>Оцінка</label>
            <div className={styles.ratingWrapper}>
              <StarsRating rating={rate} onChange={setRate} />
            </div>
            {errors.rate && (
              <span className={styles.errorMessage}>{errors.rate}</span>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Відправка..." : "Надіслати"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
