"use client";

import css from "./AddToolPage.module.css";
import { Category } from "@/types/category";
import * as Yup from "yup";
import { useCreatingDraftStore } from "@/lib/store/createToolStore";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { createTool } from "@/lib/api/clientApi";
import toast from "react-hot-toast";
import { ApiError } from "@/app/api/api";
import ImagePicker from "@/components/ImagePicker/ImagePicker";

interface FormData {
  name: string;
  pricePerDay: string;
  category: string;
  rentalTerms: string;
  description: string;
  specifications: string;
}

const ValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Назва обов'язкова")
    .min(3, "Назва має містити принаймні 3 символи")
    .max(96, "Назва не може перевищувати 96 символів"),
  pricePerDay: Yup.number()
    .required("Ціна обов'язкова")
    .positive("Ціна повинна бути більше 0")
    .typeError("Введіть коректну ціну"),
  category: Yup.string().required("Оберіть категорію"),
  rentalTerms: Yup.string()
    .required("Умови оренди обов'язкові")
    .min(20, "Мінімум 20 символів")
    .max(1000, "Максимальна довжина - 1000 символів"),
  description: Yup.string()
    .required("Опис обов'язковий")
    .min(20, "Мінімум 20 символів")
    .max(2000, "Максимальна довжина опису - 2000 символів"),
  specifications: Yup.string()
    .required("Характеристики обов'язкові")
    .max(500, "Максимальна довжина характеристик - 500 символів")
    .test(
      "format",
      "Характеристики повинні бути у форматі 'ключ: значення' (наприклад: Потужність: 1.2 кВт)",
      (value) => {
        if (!value || !value.trim()) return true;
        const lines = value.trim().split("\n");
        return lines.every((line) => {
          const trimmed = line.trim();
          if (!trimmed) return true;
          const colonIndex = trimmed.indexOf(":");
          return (
            colonIndex > 0 &&
            colonIndex < trimmed.length - 1 &&
            trimmed.substring(0, colonIndex).trim().length > 0 &&
            trimmed.substring(colonIndex + 1).trim().length > 0
          );
        });
      }
    ),
});

interface Props {
  categories: Category[];
}

export default function AddToolPageClient({ categories }: Props) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { draft, setDraft, clearDraft } = useCreatingDraftStore();
  const fieldId = useId();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name;
    const value = e.target.value;

    const changeEl = {
      ...draft,
      [key]: value,
    };
    setDraft(changeEl);
  };

  const handleSubmit = async (
    values: FormData,
    formikHelpers: FormikHelpers<FormData>
  ) => {
    try {
      console.log(values);

      //   const result = await createTool();
      clearDraft();
      toast.success("Інструмент успішно створено");
      //   router.push(`/tools/${result._id}`);
      return;
    } catch (error: unknown) {
      const err = error as ApiError;

      toast.error(
        err.response?.data?.response?.validation?.body?.message ||
          err.response?.data?.response?.message ||
          err.message
      );
    }
  };

  return (
    <section className={css.pageSection}>
      <div className="container">
        <h2 className={css.formTitle}>Публікація інструменту</h2>
        <ImagePicker onChangeImage={setImageFile} />

        <Formik
          initialValues={{
            name: "",
            pricePerDay: "",
            category: "",
            rentalTerms: "",
            description: "",
            specifications: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={ValidationSchema}
          enableReinitialize
        >
          <Form className={css.form}>
            <fieldset className={css.formGroup}>
              <label htmlFor="name" className={css.formLabel}>
                Назва
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                onChange={handleChange}
                className={css.input}
                placeholder="Введить назву"
              />
              <ErrorMessage
                name="name"
                component="span"
                className={css.errorMessage}
              />
            </fieldset>
          </Form>
        </Formik>
      </div>
    </section>
  );
}
