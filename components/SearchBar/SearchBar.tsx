"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useRef, useEffect, useState } from "react";
import css from "./SearchBar.module.css";
import heroCss from "@/components/Hero/Hero.module.css";

interface SearchFormValues {
  search: string;
}

const searchSchema = Yup.object().shape({
  search: Yup.string()
    .min(2, "Мінімальна довжина пошукового запиту - 2 символи")
    .max(100, "Максимальна довжина пошукового запиту - 100 символів"),
});

export default function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [hasChangedAfterSubmit, setHasChangedAfterSubmit] = useState(false);
  const [errorText, setErrorText] = useState<string>("");

  const formik = useFormik<SearchFormValues>({
    initialValues: {
      search: "",
    },
    validationSchema: searchSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: (values) => {
      try {
        const trimmedSearch = values.search.trim();
        window.location.href = `/tools?search=${encodeURIComponent(trimmedSearch)}`;
      } catch (error) {
        toast.error("Помилка при виконанні пошуку");
        formik.setFieldError("search", "Помилка при виконанні пошуку");
      }
    },
  });

  // Сбрасываем флаг при каждой попытке отправки
  useEffect(() => {
    if (formik.submitCount > 0) {
      setHasChangedAfterSubmit(false);
    }
  }, [formik.submitCount]);

  // Показываем ошибку только если была попытка отправки
  // и пользователь не изменил значение после отправки
  const showError =
    formik.errors.search && formik.submitCount > 0 && !hasChangedAfterSubmit;

  // Сохраняем текст ошибки для анимации исчезновения
  useEffect(() => {
    if (formik.errors.search && showError) {
      // Устанавливаем текст ошибки сразу при появлении
      setErrorText(formik.errors.search);
    } else if (!showError && errorText) {
      // Удаляем текст ошибки после завершения анимации исчезновения (500ms)
      // чтобы блок ошибки мог плавно исчезнуть
      const timeoutId = setTimeout(() => {
        setErrorText("");
      }, 500);
      return () => clearTimeout(timeoutId);
    } else if (!formik.errors.search && !showError) {
      // Если ошибка исчезла и showError тоже false, удаляем текст сразу
      setErrorText("");
    }
  }, [formik.errors.search, showError]);

  // Устанавливаем фокус на инпут только при ошибке валидации
  useEffect(() => {
    if (showError && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [showError, formik.submitCount]);

  // Добавляем класс на секцию hero при ошибке для изменения паддинга
  useEffect(() => {
    const heroSection = document.getElementById("hero");
    if (heroSection) {
      if (showError) {
        heroSection.classList.add("has-error");
      } else {
        heroSection.classList.remove("has-error");
      }
    }
  }, [showError]);

  return (
    <>
      <div className={heroCss["hero-in-wrap"]}>
        <input
          ref={inputRef}
          type="text"
          name="search"
          value={formik.values.search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            formik.handleChange(e);
            if (formik.submitCount > 0) {
              setHasChangedAfterSubmit(true);
            }
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              e.preventDefault();
              formik.handleSubmit();
            }
          }}
          placeholder="Дриль алмазного свердління"
          className={`${css["search-input"]} ${showError ? css.error : ""}`}
        />
        <div
          ref={errorRef}
          className={`${css["search-error"]} ${css["search-error-mobile"]} ${
            showError ? css.show : ""
          }`}
        >
          {errorText}
        </div>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => formik.handleSubmit()}
          className={css["search-button"]}
          disabled={formik.isSubmitting}
          onTouchStart={(e) => {
            // Эмулируем ховер на touch-устройствах
            if (buttonRef.current && !formik.isSubmitting) {
              buttonRef.current.classList.add("hover");
            }
          }}
          onTouchEnd={(e) => {
            // Убираем ховер после тапа
            if (buttonRef.current) {
              buttonRef.current.classList.remove("hover");
            }
          }}
        >
          Пошук
        </button>
      </div>
      <div
        className={`${css["search-error"]} ${css["search-error-desktop"]} ${
          showError ? css.show : ""
        }`}
      >
        {errorText}
      </div>
    </>
  );
}
