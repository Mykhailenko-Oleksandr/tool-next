import AddEditToolForm from "@/components/AddEditToolForm/AddEditToolForm";
import css from "./AddToolPage.module.css";
import { Category } from "@/types/category";
import * as Yup from "yup";
import { useCreatingDraftStore } from "@/lib/store/createToolStore";
import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { createTool } from "@/lib/api/clientApi";
import toast from "react-hot-toast";
import { ApiError } from "@/app/api/api";
import Image from "next/image";

interface FormData {
  name: string;
  pricePerDay: string;
  category: string;
  rentalTerms: string;
  description: string;
  specifications: string;
  images: File;
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
  images: Yup.mixed()
    .required("Фото інструменту обов'язкове")
    .test("file-type", "Оберіть зображення", (value) => {
      if (!value) return false;
      return value instanceof File;
    })
    .test("file-size", "Розмір файлу не може перевищувати 1 МБ", (value) => {
      if (!value || !(value instanceof File)) {
        return true;
      }
      const maxSize = 1 * 1024 * 1024;
      return value.size <= maxSize;
    }),
});

interface Props {
  categories: Category[];
}

export default function AddToolPageClient({ categories }: Props) {
  const { draft, setDraft, clearDraft } = useCreatingDraftStore();
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const fieldId = useId();
  const router = useRouter();

  useEffect(() => {
    if (profilePhotoUrl) {
      setPreviewUrl(profilePhotoUrl);
    }
  }, [profilePhotoUrl]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");

    if (file) {
      // Перевіримо тип файлу
      if (!file.type.startsWith("image/")) {
        setError("Only images");
        return;
      }

      // Перевіримо розмір файлу (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Max file size 5MB");
        return;
      }

      onChangePhoto(file); // передаємо файл у батьківський компонент

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
        <h2 className={css["form-title"]}>Публікація інструменту</h2>
        <div>
          <div className={css.picker}>
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="Preview"
                width={300}
                height={300}
                className={css.avatar}
              />
            )}
            <label
              className={
                previewUrl ? `${css.wrapper} ${css.reload}` : css.wrapper
              }
            >
              📷 Choose photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={css.input}
              />
            </label>
          </div>
          {error && <p className={css.error}>{error}</p>}
        </div>

        {/* 
        <Formik
          initialValues={{ }}
          onSubmit={handleSubmit}
          validationSchema={ValidationSchema}
          enableReinitialize
        > */}
        {/* <Form className={css.form}>
            <label htmlFor="images" className={css["form-label"]}>
              Фото інструменту
            </label>
            <div className={css["image-upload"]}>
              <Field
                ref={fileInputRef}
                type="file"
                id="images"
                name="images"
                accept="image/*"
                onChange={handleImageChange}
                className={css["file-input"]}
              />
              {imagePreview ? (
                <div className={css["image-preview"]}>
                  <Image
                    src={imagePreview}
                    alt="Превью"
                    width={400}
                    height={400}
                    style={{ objectFit: "contain" }}
                    unoptimized
                  />
                </div>
              ) : (
                <label
                  htmlFor="images"
                  className={css["image-placeholder"]}
                ></label>
              )}
            </div>
            <ErrorMessage
              name="images"
              component="span"
              className={css.error}
            />
          </Form> */}
        {/* </Formik> */}
      </div>
    </section>
  );
}
