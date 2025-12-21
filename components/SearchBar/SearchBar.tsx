"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useRef, useEffect, useState } from "react";
import css from "./SearchBar.module.css";
import heroCss from "@/components/Hero/Hero.module.css";
import { useRouter } from "next/navigation";

interface SearchFormValues {
  search: string;
}

const searchSchema = Yup.object().shape({
  search: Yup.string()
    .max(100, "Максимальна довжина пошукового запиту - 100 символів")
    .matches(/^[^'"«»„"`''']*$/, "Пошуковий запит не може містити лапки"),
});

export default function SearchBar() {
  const router = useRouter();
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
        router.push(`/tools?search=${encodeURIComponent(trimmedSearch)}`);
      } catch (error) {
        toast.error("Помилка при виконанні пошуку");
        formik.setFieldError("search", "Помилка при виконанні пошуку");
      }
    },
  });

  useEffect(() => {
    if (formik.submitCount > 0) {
      setHasChangedAfterSubmit(false);
    }
  }, [formik.submitCount]);

  const showError =
    formik.errors.search && formik.submitCount > 0 && !hasChangedAfterSubmit;

  useEffect(() => {
    if (formik.errors.search && showError) {
      setErrorText(formik.errors.search);
    } else if (!showError && errorText) {
      const timeoutId = setTimeout(() => {
        setErrorText("");
      }, 500);
      return () => clearTimeout(timeoutId);
    } else if (!formik.errors.search && !showError) {
      setErrorText("");
    }
  }, [formik.errors.search, showError]);

  useEffect(() => {
    if (showError && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [showError, formik.submitCount]);

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
            if (buttonRef.current && !formik.isSubmitting) {
              buttonRef.current.classList.add("hover");
            }
          }}
          onTouchEnd={(e) => {
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
