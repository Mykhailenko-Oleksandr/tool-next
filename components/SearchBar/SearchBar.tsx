"use client";

import { Formik, Form, Field, FormikHelpers, useFormikContext, FieldInputProps } from "formik";
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
    .max(100, "Максимальна довжина пошукового запиту - 100 символів")
    .required("Введіть пошуковий запит"),
});

function SearchForm() {
  const { errors, submitCount, isSubmitting } = useFormikContext<SearchFormValues>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasChangedAfterSubmit, setHasChangedAfterSubmit] = useState(false);

  // Сбрасываем флаг при каждой попытке отправки
  useEffect(() => {
    if (submitCount > 0) {
      setHasChangedAfterSubmit(false);
    }
  }, [submitCount]);

  // Показываем ошибку только если была попытка отправки
  // и пользователь не изменил значение после отправки
  const showError =
    errors.search && submitCount > 0 && !hasChangedAfterSubmit;

  // Устанавливаем фокус на инпут только при ошибке валидации
  useEffect(() => {
    if (showError && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [showError, submitCount]);

  return (
    <Form className={css["search-form"]}>
      <div
        className={`${css["search-input-wrapper"]} ${
          showError ? css.error : ""
        }`}
      >
        <Field name="search">
          {({ field }: { field: FieldInputProps<string> }) => (
            <input
              {...field}
              ref={inputRef}
              type="text"
              placeholder="Дриль алмазного свердління"
              className={`${css["search-input"]} ${
                showError ? css.error : ""
              }`}
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
        {showError && (
          <div className={css["search-error"]}>{errors.search}</div>
        )}
      </div>
      <button
        type="submit"
        className={css["search-button"]}
        disabled={isSubmitting}
      >
        Пошук
      </button>
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
      if (trimmedSearch) {
        window.location.href = `/tools?search=${encodeURIComponent(trimmedSearch)}`;
      }
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

