"use client";

import {
  Formik,
  Form,
  Field,
  FormikHelpers,
  useFormikContext,
  FieldInputProps,
} from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useRef, useEffect, useState } from "react";
import css from "./SearchBar.module.css";

interface SearchFormValues {
  search: string;
}

const searchSchema = Yup.object().shape({
  search: Yup.string()
    .min(2, "Мінімальна довжина пошукового запиту - 2 символи")
    .max(100, "Максимальна довжина пошукового запиту - 100 символів"),
});

function SearchForm() {
  const { errors, submitCount, isSubmitting } =
    useFormikContext<SearchFormValues>();
  const inputRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [hasChangedAfterSubmit, setHasChangedAfterSubmit] = useState(false);
  const [errorText, setErrorText] = useState<string>("");

  // Сбрасываем флаг при каждой попытке отправки
  useEffect(() => {
    if (submitCount > 0) {
      setHasChangedAfterSubmit(false);
    }
  }, [submitCount]);

  // Показываем ошибку только если была попытка отправки
  // и пользователь не изменил значение после отправки
  const showError = errors.search && submitCount > 0 && !hasChangedAfterSubmit;

  // Сохраняем текст ошибки для анимации исчезновения
  useEffect(() => {
    if (errors.search && showError) {
      // Сохраняем текст ошибки при появлении
      setErrorText(errors.search);
    } else if (!showError && errorText) {
      // Не очищаем текст сразу, чтобы анимация работала
      // Текст очистится после окончания анимации (500ms)
      const timeoutId = setTimeout(() => {
        setErrorText("");
      }, 500);
      return () => clearTimeout(timeoutId);
    } else if (!errors.search && !showError) {
      // Если ошибки нет и не показываем, очищаем текст
      setErrorText("");
    }
  }, [errors.search, showError]);

  // Устанавливаем фокус на инпут только при ошибке валидации
  useEffect(() => {
    if (showError && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [showError, submitCount]);

  // Добавляем класс на секцию hero при ошибке
  useEffect(() => {
    const heroSection = document.getElementById("hero");
    if (heroSection) {
      if (showError) {
        // Добавляем класс сразу при появлении ошибки
        heroSection.classList.add("has-error");
      } else {
        // Удаляем класс сразу, чтобы паддинги hero начинали увеличиваться
        // синхронно с уменьшением блока ошибки (оба имеют transition 500ms)
        heroSection.classList.remove("has-error");
      }
    }
  }, [showError]);


  return (
    <Form className={css["search-form"]}>
      <div
        className={`${css["search-input-wrapper"]} ${
          showError ? css.error : ""
        }`}
      >
        <div className={css["search-input-container"]}>
          <Field name="search">
            {({ field }: { field: FieldInputProps<string> }) => (
              <input
                {...field}
                ref={inputRef}
                type="text"
                placeholder="Дриль алмазного свердління"
                className={`${css["search-input"]} ${showError ? css.error : ""}`}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  // Вызываем стандартный обработчик Formik
                  field.onChange(e);
                  // При изменении значения после отправки скрываем ошибку
                  if (submitCount > 0) {
                    setHasChangedAfterSubmit(true);
                  }
                }}
              />
            )}
          </Field>
          <div
            ref={errorRef}
            className={`${css["search-error"]} ${showError ? css.show : ""}`}
          >
            {errorText}
          </div>
        </div>
        <button
          type="submit"
          className={css["search-button"]}
          disabled={isSubmitting}
        >
          Пошук
        </button>
      </div>
    </Form>
  );
}

export default function SearchBar() {
  const initialValues: SearchFormValues = {
    search: "",
  };

  const handleSubmit = (
    values: SearchFormValues,
    { setSubmitting, setFieldError }: FormikHelpers<SearchFormValues>
  ) => {
    try {
      const trimmedSearch = values.search.trim();
      window.location.href = `/tools?search=${encodeURIComponent(trimmedSearch)}`;
    } catch (error) {
      toast.error("Помилка при виконанні пошуку");
      setFieldError("search", "Помилка при виконанні пошуку");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={searchSchema}
      onSubmit={handleSubmit}
      validateOnChange={true}
      validateOnBlur={false}
    >
      <SearchForm />
    </Formik>
  );
}
