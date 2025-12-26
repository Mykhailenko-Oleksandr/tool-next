"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect, useRef, useMemo } from "react";
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
import { createTool, updateTool } from "@/lib/api/clientApi";
import { useCreatingDraftStore } from "@/lib/store/createToolStore";

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
          if (!value || !value.trim()) return true; // Пустое значение обработается required
          const lines = value.trim().split("\n");
          return lines.every((line) => {
            const trimmed = line.trim();
            if (!trimmed) return true; // Пустые строки разрешены
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
    images: isEdit
      ? Yup.mixed().nullable()
      : Yup.mixed()
          .required("Фото інструменту обов'язкове")
          .test("file-type", "Оберіть зображення", (value) => {
            if (!value) return false;
            return value instanceof File;
          })
          .test(
            "file-size",
            "Розмір файлу не може перевищувати 1 МБ",
            (value) => {
              if (!value || !(value instanceof File)) {
                return true;
              }
              const maxSize = 1 * 1024 * 1024; // 1 МБ (соответствует бэкенду)
              return value.size <= maxSize;
            }
          ),
  });

export default function AddEditToolForm({
  toolId,
  initialData,
}: AddEditToolFormProps) {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useCreatingDraftStore();
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
  const categoryInteractedRef = useRef(false);
  const selectedFileRef = useRef<File | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const data = await getCategories();
        const sortData = data.toSorted((a, b) =>
          a.title.localeCompare(b.title)
        );
        setCategories(sortData);
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
    touched: Record<string, boolean | undefined>,
    values: FormValues
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
    const newDisplayErrors: Record<string, string> = {};
    fields.forEach((field) => {
      // Для категории не показываем ошибку, если категории еще загружаются, пользователь не взаимодействовал с полем, или категория уже выбрана
      if (field === "category") {
        if (
          isLoadingCategories ||
          !categoryInteractedRef.current ||
          values.category
        ) {
          return;
        }
      }
      if (errors[field] && touched[field]) {
        newDisplayErrors[field] = errors[field] as string;
      }
    });
    setDisplayErrors(newDisplayErrors);
  };

  const initialValues = useMemo<FormValues>(
    () =>
      toolId
        ? {
            name: initialData?.name || "",
            pricePerDay: initialData?.pricePerDay?.toString() || "",
            category: initialData?.category || "",
            rentalTerms: initialData?.rentalTerms || "",
            description: initialData?.description || "",
            specifications: (() => {
              const specs = initialData?.specifications;
              if (
                specs &&
                typeof specs === "object" &&
                specs !== null &&
                !Array.isArray(specs)
              ) {
                return Object.entries(specs)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join("\n");
              }
              return "";
            })(),
            images: null,
          }
        : {
            name: draft.name || "",
            pricePerDay: draft.pricePerDay || "",
            category: draft.category || "",
            rentalTerms: draft.rentalTerms || "",
            description: draft.description || "",
            specifications: draft.specifications || "",
            images: selectedFileRef.current, // Сохраняем выбранный файл при реинициализации
          },
    [
      toolId,
      initialData,
      draft.name,
      draft.pricePerDay,
      draft.category,
      draft.rentalTerms,
      draft.description,
      draft.specifications,
    ] // Исключаем draft целиком, используем отдельные поля
  );

  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema: getValidationSchema(!!toolId),
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: !toolId,
    onSubmit: async (values) => {
      // При попытке submit помечаем, что пользователь взаимодействовал с формой
      categoryInteractedRef.current = true;
      try {
        setIsLoading(true);

        // Проверка размера файла перед отправкой (дополнительная проверка)
        if (!toolId && values.images) {
          const maxSize = 1 * 1024 * 1024; // 1 МБ (соответствует бэкенду)
          if (values.images.size > maxSize) {
            formik.setFieldError(
              "images",
              "Розмір файлу не може перевищувати 1 МБ"
            );
            formik.setFieldTouched("images", true);
            setIsLoading(false);
            return;
          }
        }

        const specificationsObj = (() => {
          const trimmed = values.specifications.trim();
          if (!trimmed) {
            return {};
          }
          const parsed = trimmed
            .split("\n")
            .reduce<Record<string, string>>((acc, currentString) => {
              const colonIndex = currentString.indexOf(":");
              if (
                colonIndex === -1 ||
                colonIndex === 0 ||
                colonIndex === currentString.length - 1
              ) {
                return acc;
              }
              const key = currentString.substring(0, colonIndex).trim();
              const value = currentString.substring(colonIndex + 1).trim();
              if (key && value) {
                acc[key.trim()] = value.trim();
              }
              return acc;
            }, {});
          return Object.keys(parsed).length > 0 ? parsed : {};
        })();

        const baseToolData = {
          name: values.name.trim(),
          pricePerDay: parseFloat(values.pricePerDay),
          category: values.category,
          rentalTerms: values.rentalTerms.trim(),
          description: values.description.trim(),
          specifications: specificationsObj,
        };

        if (!toolId) {
          if (!values.images) {
            throw new Error("Image is required");
          }

          const result = await createTool({
            ...baseToolData,
            images: values.images,
          });
          clearDraft();
          toast.success("Інструмент успішно створено");
          router.push(`/tools/${result._id}`);
          return;
        }
        const result = await updateTool({
          ...baseToolData,
          id: toolId,
          images: values.images || undefined,
        });
        clearDraft();
        toast.success("Інструмент успішно оновлено");
        router.push(`/tools/${result._id}`);
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
      formik.touched as Record<string, boolean | undefined>,
      formik.values
    );
  }, [formik.errors, formik.touched, formik.values, isLoadingCategories]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!toolId) {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      const timeoutId = setTimeout(() => {
        setDraft({
          name: formik.values.name,
          pricePerDay: formik.values.pricePerDay,
          category: formik.values.category,
          rentalTerms: formik.values.rentalTerms,
          description: formik.values.description,
          specifications: formik.values.specifications,
          images: imagePreview || "",
        });
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [
    formik.values.name,
    formik.values.pricePerDay,
    formik.values.category,
    formik.values.rentalTerms,
    formik.values.description,
    formik.values.specifications,
    imagePreview,
    toolId,
    setDraft,
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      selectedFileRef.current = file; // Сохраняем файл в ref
      formik.setFieldValue("images", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
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
            <label htmlFor="images" className={css["form-label"]}>
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
                  className={css["image-placeholder"]}
                ></label>
              )}
            </div>
            {formik.errors.images && formik.touched.images && !toolId && (
              <div className={css["error-message"]}>{formik.errors.images}</div>
            )}
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
            className={css["upload-button"]}
          >
            Завантажити фото
          </button>

          <div className={css["form-group"]}>
            <label htmlFor="name" className={css["form-label"]}>
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
              className={`${css["error-wrapper"]} ${formik.errors.name && formik.touched.name ? css["error-wrapper-visible"] : ""}`}
            >
              <div className={css["error-message"]}>{displayErrors.name}</div>
            </div>
          </div>

          <div className={css["form-group"]}>
            <label htmlFor="pricePerDay" className={css["form-label"]}>
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
              className={`${css["error-wrapper"]} ${formik.errors.pricePerDay && formik.touched.pricePerDay ? css["error-wrapper-visible"] : ""}`}
            >
              <div className={css["error-message"]}>
                {displayErrors.pricePerDay}
              </div>
            </div>
          </div>

          <div className={css["form-group"]}>
            <label htmlFor="category" className={css["form-label"]}>
              Категорія
            </label>
            <CustomSelect
              id="category"
              name="category"
              value={formik.values.category}
              onChange={(value) => {
                categoryInteractedRef.current = true;
                formik.setFieldValue("category", value, false);
                formik.setFieldTouched("category", true, false);
              }}
              onBlur={() => {
                if (categoryInteractedRef.current) {
                  formik.setFieldTouched("category", true, false);
                }
              }}
              options={categories.map((category) => ({
                value: category._id,
                label: category.title,
              }))}
              placeholder="Категорія"
              disabled={isLoadingCategories}
              hasError={
                !!(
                  formik.errors.category &&
                  formik.touched.category &&
                  categoryInteractedRef.current &&
                  !isLoadingCategories &&
                  !formik.values.category
                )
              }
            />
            <div
              className={`${css["error-wrapper"]} ${formik.errors.category && formik.touched.category && categoryInteractedRef.current && !isLoadingCategories && !formik.values.category ? css["error-wrapper-visible"] : ""}`}
            >
              <div className={css["error-message"]}>
                {displayErrors.category}
              </div>
            </div>
          </div>

          <div className={css["form-group"]}>
            <label htmlFor="rentalTerms" className={css["form-label"]}>
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
              className={`${css["error-wrapper"]} ${formik.errors.rentalTerms && formik.touched.rentalTerms ? css["error-wrapper-visible"] : ""}`}
            >
              <div className={css["error-message"]}>
                {displayErrors.rentalTerms}
              </div>
            </div>
          </div>

          <div className={css["form-group"]}>
            <label htmlFor="description" className={css["form-label"]}>
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
              className={`${css["error-wrapper"]} ${formik.errors.description && formik.touched.description ? css["error-wrapper-visible"] : ""}`}
            >
              <div className={css["error-message"]}>
                {displayErrors.description}
              </div>
            </div>
          </div>

          <div className={css["form-group"]}>
            <label htmlFor="specifications" className={css["form-label"]}>
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
            />
            {!formik.values.specifications && (
              <p className={css.hint}>
                Потужність: 1.2 кВт
                <br />
                Напруга: 220 В
              </p>
            )}

            <div
              className={`${css["error-wrapper"]} ${formik.errors.specifications && formik.touched.specifications ? css["error-wrapper-visible"] : ""}`}
            >
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
            className={css["submit-button"]}
          >
            {isLoading ? <BeatLoader color="#fff" size={8} /> : "Опублікувати"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className={css["cancel-button"]}
          >
            Відмінити
          </button>
        </div>
      </div>
    </>
  );
}
