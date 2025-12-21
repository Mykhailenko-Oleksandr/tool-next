"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { ApiError } from "@/app/api/api";
import css from "./AddEditToolForm.module.css";
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import { Tool } from "@/types/tool";
import { Category } from "@/types/category";
import { getCategories } from "@/lib/api/clientApi";
import { createTool, updateTool } from "@/lib/api/serverApi";

interface AddEditToolFormProps {
  toolId?: string;
  initialData?: Tool;
}

interface FormValues {
  name: string;
  pricePerDay: string;
  category: string;
  rentalTerms: string;
  description: string;
  specifications: string;
  images: File | null;
}

const getValidationSchema = (isEdit: boolean) =>
  Yup.object().shape({
    name: Yup.string()
      .required("Назва обов'язкова")
      .max(100, "Максимальна довжина назви - 100 символів"),
    pricePerDay: Yup.number()
      .required("Ціна обов'язкова")
      .positive("Ціна повинна бути більше 0")
      .typeError("Введіть коректну ціну"),
    category: Yup.string().required("Оберіть категорію"),
    rentalTerms: Yup.string()
      .required("Умови оренди обов'язкові")
      .max(500, "Максимальна довжина - 500 символів"),
    description: Yup.string()
      .required("Опис обов'язковий")
      .max(1000, "Максимальна довжина опису - 1000 символів"),
    specifications: Yup.string()
      .required("Характеристики обов'язкові")
      .max(500, "Максимальна довжина характеристик - 500 символів"),
    images: isEdit
      ? Yup.mixed().nullable()
      : Yup.mixed()
          .required("Фото інструменту обов'язкове")
          .test("file-type", "Оберіть зображення", (value) => {
            if (!value) return false;
            return value instanceof File;
          }),
  });

export default function AddEditToolForm({
  toolId,
  initialData,
}: AddEditToolFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.images || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayErrors, setDisplayErrors] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const data = await getCategories();
        setCategories(data);
      } catch (error: unknown) {
        const err = error as ApiError;

        toast.error(
          err.response?.data?.response?.validation?.body?.message ||
            err.response?.data?.response?.message ||
            err.message ||
            "Не вдалося завантажити категорії"
        );
      } finally {
        setIsLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const updateDisplayErrors = (
    errors: Record<string, string | undefined>,
    touched: Record<string, boolean | undefined>
  ) => {
    const fields = [
      "name",
      "pricePerDay",
      "category",
      "rentalTerms",
      "description",
      "specifications",
      "images",
    ];
    fields.forEach((field) => {
      if (errors[field] && touched[field]) {
        setDisplayErrors((prev) => ({
          ...prev,
          [field]: errors[field] as string,
        }));
      }
    });
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      name: initialData?.name || "",
      pricePerDay: initialData?.pricePerDay?.toString() || "",
      category: initialData?.category || "",
      rentalTerms: initialData?.rentalTerms || "",
      description: initialData?.description || "",
      specifications:
        typeof initialData?.specifications === "string"
          ? initialData.specifications
          : "",
      images: null,
    },
    validationSchema: getValidationSchema(!!toolId),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        /////////треба зробити щоб specifications став об"єктом по роздільнику </n> як мінімум.
        ///////// а при створенні інструмента зображення обов"язкове

        // const toolData = {
        //   name: values.name.trim(),
        //   pricePerDay: parseFloat(values.pricePerDay),
        //   category: values.category,
        //   rentalTerms: values.rentalTerms.trim(),
        //   description: values.description.trim(),
        //   specifications: values.specifications
        //     .trim()
        //     .split("/n")
        //     .reduce<Record<string, string>>((acc, currentString) => {
        //       const [key, value] = currentString.split(":");
        //       if (key && value) {
        //         acc[key.trim()] = value.trim();
        //       }
        //       return acc;
        //     }, {}),
        //   images: values.images || undefined,
        // };
        const baseToolData = {
          name: values.name.trim(),
          pricePerDay: parseFloat(values.pricePerDay),
          category: values.category,
          rentalTerms: values.rentalTerms.trim(),
          description: values.description.trim(),
          specifications: values.specifications
            .trim()
            .split("\n")
            .reduce<Record<string, string>>((acc, currentString) => {
              const [key, value] = currentString.split(":");
              if (key && value) {
                acc[key.trim()] = value.trim();
              }
              return acc;
            }, {}),
        };

        if (!toolId) {
          if (!values.images) {
            throw new Error("Image is required");
          }

          const result = await createTool({
            ...baseToolData,
            images: values.images,
          });
          toast.success("Інструмент успішно створено");
          router.push(`/tools/${result._id}`);
          return;
        }
        const result = await updateTool({
          ...baseToolData,
          id: toolId,
          images: values.images || undefined,
        });

        toast.success("Інструмент успішно оновлено");
        router.push(`/tools/${result._id}`);
        // toast.success(
        //   toolId ? "Інструмент успішно оновлено" : "Інструмент успішно створено"
        // );
        // router.push(`/tools/${result._id}`);
      } catch (error: unknown) {
        const err = error as ApiError;

        toast.error(
          err.response?.data?.response?.validation?.body?.message ||
            err.response?.data?.response?.message ||
            err.message ||
            (toolId
              ? "Не вдалося оновити інструмент"
              : "Не вдалося створити інструмент")
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    updateDisplayErrors(
      formik.errors as Record<string, string | undefined>,
      formik.touched as Record<string, boolean | undefined>
    );
  }, [formik.errors, formik.touched]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("images", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <h1 className={css["form-title"]}>
        {toolId ? "Редагувати інструмент" : "Публікація інструменту"}
      </h1>
      <div className={css["form-wrap"]}>
        <div className={css["form-fields"]}>
          <div className={css["form-group"]}>
            <label
              htmlFor="images"
              className={css["form-label"]}>
              Фото інструменту
            </label>
            <div className={css["image-upload"]}>
              <input
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
                  className={css["image-placeholder"]}></label>
              )}
            </div>
            {formik.errors.images &&
              formik.touched.images &&
              !imagePreview &&
              !toolId && (
                <div className={css["error-message"]}>
                  {formik.errors.images}
                </div>
              )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={css["upload-button"]}>
            Завантажити фото
          </button>

          <div className={css["form-group"]}>
            <label
              htmlFor="name"
              className={css["form-label"]}>
              Назва
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${css.input} ${
                formik.errors.name && formik.touched.name
                  ? css["input-error"]
                  : ""
              }`}
              placeholder="Введить назву"
            />
            <div
              className={`${css["error-wrapper"]} ${formik.errors.name && formik.touched.name ? css["error-wrapper-visible"] : ""}`}>
              <div className={css["error-message"]}>{displayErrors.name}</div>
            </div>
          </div>

          <div className={css["form-group"]}>
            <label
              htmlFor="pricePerDay"
              className={css["form-label"]}>
              Ціна/день
            </label>
            <input
              type="number"
              id="pricePerDay"
              name="pricePerDay"
              value={formik.values.pricePerDay}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${css.input} ${
                formik.errors.pricePerDay && formik.touched.pricePerDay
                  ? css["input-error"]
                  : ""
              }`}
              placeholder="500"
              min="0"
              step="0.01"
            />
            <div
              className={`${css["error-wrapper"]} ${formik.errors.pricePerDay && formik.touched.pricePerDay ? css["error-wrapper-visible"] : ""}`}>
              <div className={css["error-message"]}>
                {displayErrors.pricePerDay}
              </div>
            </div>
          </div>

          <div className={css["form-group"]}>
            <label
              htmlFor="category"
              className={css["form-label"]}>
              Категорія
            </label>
            <CustomSelect
              id="category"
              name="category"
              value={formik.values.category}
              onChange={(value) => formik.setFieldValue("category", value)}
              onBlur={() => formik.setFieldTouched("category", true)}
              options={categories.map((category) => ({
                value: category._id,
                label: category.title,
              }))}
              placeholder="Категорія"
              disabled={isLoadingCategories}
              hasError={!!(formik.errors.category && formik.touched.category)}
            />
            <div
              className={`${css["error-wrapper"]} ${formik.errors.category && formik.touched.category ? css["error-wrapper-visible"] : ""}`}>
              <div className={css["error-message"]}>
                {displayErrors.category}
              </div>
            </div>
          </div>

          <div className={css["form-group"]}>
            <label
              htmlFor="rentalTerms"
              className={css["form-label"]}>
              Умови оренди
            </label>
            <textarea
              id="rentalTerms"
              name="rentalTerms"
              value={formik.values.rentalTerms}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${css.textarea} ${css["textarea-rental-terms"]} ${
                formik.errors.rentalTerms && formik.touched.rentalTerms
                  ? css["input-error"]
                  : ""
              }`}
              placeholder="Застава 8000 грн. Станина та бак для води надаються окремо."
            />
            <div
              className={`${css["error-wrapper"]} ${formik.errors.rentalTerms && formik.touched.rentalTerms ? css["error-wrapper-visible"] : ""}`}>
              <div className={css["error-message"]}>
                {displayErrors.rentalTerms}
              </div>
            </div>
          </div>

          <div className={css["form-group"]}>
            <label
              htmlFor="description"
              className={css["form-label"]}>
              Опис
            </label>
            <textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${css.textarea} ${
                formik.errors.description && formik.touched.description
                  ? css["input-error"]
                  : ""
              }`}
              placeholder="Ваш опис"
            />
            <div
              className={`${css["error-wrapper"]} ${formik.errors.description && formik.touched.description ? css["error-wrapper-visible"] : ""}`}>
              <div className={css["error-message"]}>
                {displayErrors.description}
              </div>
            </div>
          </div>

          <div className={css["form-group"]}>
            <label
              htmlFor="specifications"
              className={css["form-label"]}>
              Характеристики
            </label>
            <textarea
              id="specifications"
              name="specifications"
              value={formik.values.specifications}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${css.textarea} ${
                formik.errors.specifications && formik.touched.specifications
                  ? css["input-error"]
                  : ""
              }`}
              placeholder="Потужність: 1.2кВт
              Напруга: 220В"
            />
            <div
              className={`${css["error-wrapper"]} ${formik.errors.specifications && formik.touched.specifications ? css["error-wrapper-visible"] : ""}`}>
              <div className={css["error-message"]}>
                {displayErrors.specifications}
              </div>
            </div>
          </div>
        </div>

        <div className={css["form-actions"]}>
          <button
            type="button"
            onClick={() => formik.handleSubmit()}
            disabled={isLoading || isLoadingCategories}
            className={css["submit-button"]}>
            {isLoading ? (
              <BeatLoader
                color="#fff"
                size={8}
              />
            ) : (
              "Опублікувати"
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className={css["cancel-button"]}>
            Відмінити
          </button>
        </div>
      </div>
    </>
  );
}
