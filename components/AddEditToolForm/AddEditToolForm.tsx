"use client";

import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { ApiError } from "@/app/api/api";
import css from "./AddEditToolForm.module.css";
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import { Tool } from "@/types/tool";
import { Category } from "@/types/category";
import { CreatedFormData } from "@/types/created";
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
          if (!value || !value.trim()) return true; // v2807 Пустое значение обработается правилом required
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
  /**
   * v2807
   * ============================================================
   * BLOCK 0. Общий замысел и ограничения
   * ============================================================
   * Этот компонент используется и для:
   * - страницы создания инструмента (`/tools/new`)
   * - страницы редактирования (когда есть `toolId`)
   *
   * Важные неочевидные ограничения, которые мы здесь закрываем:
   * - UX для валидации Formik + Yup:
   *   - Ошибки должны появляться ТОЛЬКО после submit.
   *   - После submit ошибка конкретного поля должна исчезать при первом изменении поля
   *     и не появляться снова до следующей попытки submit.
   *   - Анимация появления/исчезновения текста ошибки и красной рамки должна быть синхронной.
   *
   * - Нюансы навигации/кеша Next.js:
   *   - Переход на тот же роут (`/tools/new` -> `/tools/new`) не remount-ит страницу/компонент,
   *     поэтому мы должны обрабатывать «открыть форму создания» даже без смены маршрута.
   *
   * - Гонка гидрации Zustand persist:
   *   - Persisted draft может догидратироваться после первого рендера; если очистить только состояние в памяти,
   *     persisted storage может снова «влить» черновик в store и форма заполнится.
   *   - Поэтому при принудительном открытии пустой формы нужно чистить ОБА источника:
   *     - состояние store (`clearDraft()`)
   *     - persisted storage (`useCreatingDraftStore.persist.clearStorage()`)
   */
  const router = useRouter();
  const pathname = usePathname();
  const { draft, setDraft, clearDraft } = useCreatingDraftStore();

  /**
   * v2807
   * ============================================================
   * BLOCK 1. Механизм «открыть форму создания пустой» (кеш Next + гонки persist-гидрации)
   * ============================================================
   * Зачем существует:
   * - Требование продукта: когда пользователь нажимает кнопки/ссылки «Опублікувати ...»,
   *   форма создания должна открываться ПУСТОЙ (даже если раньше был черновик).
   *
   * Почему простого `clearDraft()` в обработчике кнопки НЕДОСТАТОЧНО:
   * - Next может переиспользовать уже существующий инстанс страницы `/tools/new` без remount.
   * - Zustand persist может догидратировать значения черновика уже после клика.
   * - Formik может удерживать старые значения в памяти, если компонент не был remount-нут.
   *
   * Подход:
   * - Источники навигации ставят одноразовый флаг в sessionStorage + отправляют window-event.
   * - Этот компонент читает флаг в `useLayoutEffect` (до отрисовки) и форсит remount Formik через
   *   `key={formikKey}`, чтобы сбросить внутреннее состояние Formik.
   * - Дополнительно слушаем window-event, чтобы сброс работал даже когда маршрут НЕ меняется.
   */
  const draftLoadedRef = useRef(false);

  const OPEN_CREATE_TOOL_EMPTY_KEY = "creating-draft:open-empty";
  const [formikKey, setFormikKey] = useState(0);

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
  const displayErrorsRef = useRef<Record<string, string>>({});
  const [errorTexts, setErrorTexts] = useState<Record<string, string>>({});
  const [errorVisible, setErrorVisible] = useState<Record<string, boolean>>({});
  const errorTextsRef = useRef<Record<string, string>>({});
  const errorVisibleRef = useRef<Record<string, boolean>>({});
  const errorTimeoutsRef = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});
  const errorsRef = useRef<Record<string, string>>({});
  const suppressedFieldsRef = useRef<Set<keyof FormValues>>(new Set());
  const lastSubmitCountRef = useRef(0);
  const selectedFileRef = useRef<File | null>(null);

  // v2807 ПРИМЕЧАНИЕ (потенциально лишнее): `errorsRef` имеет смысл только потому, что мы используем таймауты
  // v2807 и сравниваем с актуальными Formik errors. Если в будущем уберём отложенное удаление текста,
  // v2807 этот ref может стать неиспользуемым. Пока оставляем.

  const forceEmptyForm = useCallback(() => {
    // v2807 Что делает:
    // v2807 - Запрещает применять черновик в Formik values на этом заходе.
    // v2807 - Чистит черновик и в store, и в persisted storage (чтобы не было повторной гидрации).
    // v2807 - Сбрасывает превью изображения.
    // v2807 - Форсит remount Formik, чтобы стереть внутренний кеш (values/touched/errors).
    // v2807
    // v2807 Почему нужно:
    // v2807 - Next может переиспользовать инстанс компонента; Formik сам по себе не сбросится.
    // v2807 - Zustand persist может догидратировать после того, как мы очистили только store.
    // v2807 - Без remount пользователь всё равно может видеть старые значения.
    // v2807 Блокируем любое применение черновика в Formik values на этом заходе
    draftLoadedRef.current = true;

    // v2807 Чистим persisted + in-memory черновик, чтобы избежать гонок повторной гидрации
    clearDraft();
    try {
      useCreatingDraftStore.persist.clearStorage();
    } catch {
      // v2807 игнорируем
      // v2807 игнорируем
    }

    // v2807 Сбрасываем превью файла
    selectedFileRef.current = null;
    setImagePreview(null);

    // v2807 Форсим remount Formik, чтобы мгновенно сбросить закешированные values/touched/errors
    setFormikKey((k) => {
      const next = k + 1;
      return next;
    });
  }, [clearDraft]);

  // v2807 Детерминированно открываем пустую форму, когда пользователь пришёл на /tools/new через «publish» кнопки.
  // v2807 Срабатывает и при навигации, и при кеше Next (когда компонент не remount-ится).
  useLayoutEffect(() => {
    if (toolId) return;

    let shouldForceEmpty = false;
    try {
      shouldForceEmpty =
        sessionStorage.getItem(OPEN_CREATE_TOOL_EMPTY_KEY) === "1";
      if (shouldForceEmpty)
        sessionStorage.removeItem(OPEN_CREATE_TOOL_EMPTY_KEY);
    } catch {
      shouldForceEmpty = false;
    }

    if (!shouldForceEmpty) return;

    forceEmptyForm();
  }, [pathname, toolId, forceEmptyForm, formikKey, draft]);

  // v2807 Также поддерживаем «открыть пустой» когда мы уже на /tools/new (без смены маршрута).
  useEffect(() => {
    if (toolId) return;
    const onForceEmpty = () => {
      // v2807 Что делает:
      // v2807 - То же самое, что обработка флага в `useLayoutEffect`, но триггерится через событие.
      // v2807
      // v2807 Почему нужно:
      // v2807 - Если пользователь УЖЕ на `/tools/new`, `router.push("/tools/new")` не меняет роут,
      // v2807   поэтому `useLayoutEffect` не перезапустится.
      // v2807 - Это гарантирует, что кнопки «открыть форму создания» всё равно мгновенно сбросят форму.
      // v2807 Съедаем флаг, если он присутствует
      try {
        sessionStorage.removeItem(OPEN_CREATE_TOOL_EMPTY_KEY);
      } catch {
        // ignore
      }
      forceEmptyForm();
    };
    window.addEventListener("creating-draft:open-empty", onForceEmpty);
    return () =>
      window.removeEventListener("creating-draft:open-empty", onForceEmpty);
  }, [toolId, forceEmptyForm]);

  const suppressFieldError = useCallback((field: keyof FormValues) => {
    /**
     * v2807
     * ============================================================
     * BLOCK 2. Поведение ошибок после submit: «скрыть при первом изменении»
     * ============================================================
     * UX requirement:
     * - Errors are shown only after submit.
     * - After submit, as soon as user starts editing a field, that field's error
     *   should disappear and NOT come back until the next submit attempt.
     *
     * Почему нельзя опираться только на Formik `errors`:
     * - Formik/Yup может на мгновение очищать `errors` во время цикла валидации, а затем
     *   снова возвращать их — это вызывает «мигание» (скрылось -> показалось) на каждом вводе.
     * - Также у `type="number"` некоторые нажатия не приводят к `onChange` (браузер игнорирует
     *   невалидные символы), поэтому для pricePerDay мы добавили key/paste обработчики.
     */
    suppressedFieldsRef.current.add(field);

    // v2807 Останавливаем любые ожидающие удаления
    if (errorTimeoutsRef.current[field]) {
      clearTimeout(errorTimeoutsRef.current[field]);
      delete errorTimeoutsRef.current[field];
    }

    // v2807 Сразу запускаем анимацию скрытия
    setErrorVisible((prevVisible) => {
      if (!prevVisible[field]) return prevVisible;
      const next = { ...prevVisible };
      delete next[field];
      return next;
    });

    // v2807 Удаляем текст после завершения анимации
    errorTimeoutsRef.current[field] = setTimeout(() => {
      if (field === "category") {
        setDisplayErrors((prev) => {
          if (!prev.category) return prev;
          const next = { ...prev };
          delete next.category;
          return next;
        });
      } else {
        setErrorTexts((prev) => {
          if (!prev[field]) return prev;
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
      delete errorTimeoutsRef.current[field];
    }, 500);
  }, []);

  // v2807 Стабильные initialValues: для новых форм всегда пустые, черновик загрузим через useEffect
  const initialValues: FormValues = toolId
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
        name: "",
        pricePerDay: "",
        category: "",
        rentalTerms: "",
        description: "",
        specifications: "",
        images: null,
      };

  useEffect(() => {
    /**
     * v2807
     * ============================================================
     * BLOCK 3. Загрузка категорий (async) + готовность селекта
     * ============================================================
     * Что делает:
     * - Один раз загружает категории для опций селекта.
     *
     * Зачем нужно:
     * - CustomSelect требует список label/value.
     * - Пока категории грузятся, мы намеренно не показываем ошибку категории,
     *   чтобы не было абсурдного «обязательное поле» до появления опций.
     */
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

  // v2807: поддерживаем ref для displayErrors, чтобы эффекты/таймауты могли читать актуальное значение
  // без добавления `displayErrors` в зависимости (иначе легко получить цикл setState -> effect -> setState).
  useEffect(() => {
    displayErrorsRef.current = displayErrors;
  }, [displayErrors]);

  /**
   * v2807
   * ============================================================
   * BLOCK 4. Ошибка категории (особый случай CustomSelect)
   * ============================================================
   * Почему CustomSelect «особенный»:
   * - Это не нативный <select>, и у него другая DOM-структура/рендер ошибок, чем у input/textarea.
   * - Нам нужно управлять СРАЗУ двумя вещами:
   *   - красной рамкой/состоянием ошибки внутри CustomSelect через `hasError`
   *   - анимированным блоком текста ошибки под ним
   *
   * Дополнительно:
   * - Опции категорий асинхронные. Пока они не загружены, мы не показываем «обязательное поле»,
   *   иначе пользователь видит ошибку, которую пока физически нельзя исправить.
   */

  // v2807: синхронизацию ошибки категории делаем внутри дочернего компонента Formik (BLOCK 7),
  // чтобы избежать циклов setState и корректно пройти eslint rules-of-hooks.

  const handleSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    /**
     * v2807
     * ============================================================
     * BLOCK 5. Отправка формы + toast при ошибках валидации
     * ============================================================
     * Что делает:
     * - Валидирует форму ДО отправки API-запроса.
     * - Если есть ошибки валидации: показывает toast и прекращает submit.
     *
     * Зачем нужно:
     * - Требование продукта: ошибки показывать только при submit, и дополнительно давать общий сигнал
     *   пользователю (toast), что нужно исправить форму.
     *
     * Важно:
     * - Мы всё равно опираемся на Formik/Yup, чтобы они заполнили `errors`, а наша система анимированных
     *   ошибок уже отображает сообщения по полям.
     */
    // Проверяем ошибки валидации перед отправкой
    const validationErrors = await formikHelpers.validateForm();
    if (Object.keys(validationErrors).length > 0) {
      // v2807 Показываем toast с сообщением об ошибках валидации
      toast.error("Будь ласка, виправте помилки в формі");
      return;
    }

    try {
      setIsLoading(true);

      // Проверка размера файла перед отправкой (дополнительная проверка)
      if (!toolId && values.images) {
        const maxSize = 1 * 1024 * 1024; // 1 МБ (соответствует бэкенду)
        if (values.images.size > maxSize) {
          formikHelpers.setFieldError(
            "images",
            "Розмір файлу не може перевищувати 1 МБ"
          );
          formikHelpers.setFieldTouched("images", true);
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
  };

  const isFirstRender = useRef(true);

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <h1 className={css["form-title"]}>
        {toolId ? "Редагувати інструмент" : "Публікація інструменту"}
      </h1>
      <Formik
        key={formikKey}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={getValidationSchema(!!toolId)}
        validateOnChange={true}
        validateOnBlur={true}
        enableReinitialize={false}
      >
        {({
          values,
          errors,
          handleChange,
          handleBlur,
          setFieldValue,
          setFieldTouched,
          setValues,
          submitCount,
        }) => {
          // v2807: все useEffect/таймауты вынесены в отдельный React-компонент ниже,
          // чтобы ESLint rules-of-hooks не ругался на хуки внутри callback Formik.

          const handleImageChange = (
            e: React.ChangeEvent<HTMLInputElement>
          ) => {
            const file = e.target.files?.[0];
            if (file) {
              selectedFileRef.current = file; // Сохраняем файл в ref
              setFieldValue("images", file);
              if (submitCount > 0) {
                suppressFieldError("images");
              }
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64 = reader.result as string;
                setImagePreview(base64);
              };
              reader.readAsDataURL(file);
            }
          };

          return (
            <Form>
              <AddEditToolFormFormikEffects
                toolId={toolId}
                draft={draft}
                draftLoadedRef={draftLoadedRef}
                selectedFileRef={selectedFileRef}
                setValues={setValues}
                submitCount={submitCount}
                errors={errors as Record<string, string | undefined>}
                values={values}
                isLoadingCategories={isLoadingCategories}
                displayErrorsRef={displayErrorsRef}
                setDisplayErrors={setDisplayErrors}
                errorTexts={errorTexts}
                setErrorTexts={setErrorTexts}
                errorVisible={errorVisible}
                setErrorVisible={setErrorVisible}
                errorTextsRef={errorTextsRef}
                errorVisibleRef={errorVisibleRef}
                errorsRef={errorsRef}
                errorTimeoutsRef={errorTimeoutsRef}
                suppressedFieldsRef={suppressedFieldsRef}
                lastSubmitCountRef={lastSubmitCountRef}
                setDraft={setDraft}
                isFirstRender={isFirstRender}
              />
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
                    {!toolId && (
                      <div
                        className={`${css["error-wrapper"]} ${errorVisible.images ? css["error-wrapper-visible"] : ""}`}
                      >
                        <div className={css["error-message"]}>
                          {errorTexts.images || ""}
                        </div>
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
                      value={values.name}
                      onChange={(e) => {
                        handleChange(e);
                        if (submitCount > 0) suppressFieldError("name");
                      }}
                      onBlur={handleBlur}
                      className={`${css.input} ${
                        errorTexts.name ? css["input-error"] : ""
                      }`}
                      placeholder="Введить назву"
                    />
                    <div
                      className={`${css["error-wrapper"]} ${errorVisible.name ? css["error-wrapper-visible"] : ""}`}
                    >
                      <div className={css["error-message"]}>
                        {errorTexts.name || ""}
                      </div>
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
                      value={values.pricePerDay}
                      onChange={(e) => {
                        handleChange(e);
                        if (submitCount > 0) suppressFieldError("pricePerDay");
                      }}
                      onKeyDown={(e) => {
                        if (submitCount === 0) return;
                        // v2807 number input может игнорировать буквы, не вызывая onChange,
                        // v2807 поэтому подавляем ошибку на любое осмысленное нажатие клавиши
                        const k = e.key;
                        const isMeaningful =
                          k.length === 1 ||
                          k === "Backspace" ||
                          k === "Delete" ||
                          k === "Enter";
                        if (isMeaningful) suppressFieldError("pricePerDay");
                      }}
                      onPaste={() => {
                        if (submitCount > 0) suppressFieldError("pricePerDay");
                      }}
                      onBlur={handleBlur}
                      className={`${css.input} ${
                        errorTexts.pricePerDay ? css["input-error"] : ""
                      }`}
                      placeholder="500"
                      min="0"
                      step="0.01"
                    />
                    <div
                      className={`${css["error-wrapper"]} ${errorVisible.pricePerDay ? css["error-wrapper-visible"] : ""}`}
                    >
                      <div className={css["error-message"]}>
                        {errorTexts.pricePerDay || ""}
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
                      value={values.category}
                      onChange={(value) => {
                        setFieldValue("category", value, false);
                        setFieldTouched("category", true, false);
                        if (submitCount > 0) suppressFieldError("category");
                      }}
                      onBlur={() => {
                        setFieldTouched("category", true, false);
                      }}
                      options={categories.map((category) => ({
                        value: category._id,
                        label: category.title,
                      }))}
                      placeholder="Категорія"
                      disabled={isLoadingCategories}
                      hasError={
                        !!(
                          submitCount > 0 &&
                          errors.category &&
                          !isLoadingCategories &&
                          !values.category
                        )
                      }
                    />
                    <div
                      className={`${css["error-wrapper"]} ${errorVisible.category ? css["error-wrapper-visible"] : ""}`}
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
                      value={values.rentalTerms}
                      onChange={(e) => {
                        handleChange(e);
                        if (submitCount > 0) suppressFieldError("rentalTerms");
                      }}
                      onBlur={handleBlur}
                      className={`${css.textarea} ${css["textarea-rental-terms"]} ${
                        errorTexts.rentalTerms ? css["input-error"] : ""
                      }`}
                      placeholder="Застава 8000 грн. Станина та бак для води надаються окремо."
                    />
                    <div
                      className={`${css["error-wrapper"]} ${errorVisible.rentalTerms ? css["error-wrapper-visible"] : ""}`}
                    >
                      <div className={css["error-message"]}>
                        {errorTexts.rentalTerms || ""}
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
                      value={values.description}
                      onChange={(e) => {
                        handleChange(e);
                        if (submitCount > 0) suppressFieldError("description");
                      }}
                      onBlur={handleBlur}
                      className={`${css.textarea} ${
                        errorTexts.description ? css["input-error"] : ""
                      }`}
                      placeholder="Ваш опис"
                    />
                    <div
                      className={`${css["error-wrapper"]} ${errorVisible.description ? css["error-wrapper-visible"] : ""}`}
                    >
                      <div className={css["error-message"]}>
                        {errorTexts.description || ""}
                      </div>
                    </div>
                  </div>

                  <div className={css["form-group"]}>
                    <label
                      htmlFor="specifications"
                      className={css["form-label"]}
                    >
                      Характеристики
                    </label>
                    <textarea
                      id="specifications"
                      name="specifications"
                      value={values.specifications}
                      onChange={(e) => {
                        handleChange(e);
                        if (submitCount > 0)
                          suppressFieldError("specifications");
                      }}
                      onBlur={handleBlur}
                      className={`${css.textarea} ${
                        errorTexts.specifications ? css["input-error"] : ""
                      }`}
                    />
                    {!values.specifications && (
                      <p className={css.hint}>
                        Потужність: 1.2 кВт
                        <br />
                        Напруга: 220 В
                      </p>
                    )}

                    <div
                      className={`${css["error-wrapper"]} ${errorVisible.specifications ? css["error-wrapper-visible"] : ""}`}
                    >
                      <div className={css["error-message"]}>
                        {errorTexts.specifications || ""}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={css["form-actions"]}>
                  <button
                    type="submit"
                    disabled={isLoading || isLoadingCategories}
                    className={css["submit-button"]}
                  >
                    {isLoading ? (
                      <BeatLoader color="#fff" size={8} />
                    ) : (
                      "Опублікувати"
                    )}
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
            </Form>
          );
        }}
      </Formik>
    </>
  );
}

type AddEditToolFormFormikEffectsProps = {
  toolId?: string;
  draft: CreatedFormData;
  draftLoadedRef: React.MutableRefObject<boolean>;
  selectedFileRef: React.MutableRefObject<File | null>;
  setValues: (
    values: FormValues,
    shouldValidate?: boolean
  ) => Promise<void | import("formik").FormikErrors<FormValues>>;
  submitCount: number;
  errors: Record<string, string | undefined>;
  values: FormValues;
  isLoadingCategories: boolean;
  displayErrorsRef: React.MutableRefObject<Record<string, string>>;
  setDisplayErrors: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  errorTexts: Record<string, string>;
  setErrorTexts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  errorVisible: Record<string, boolean>;
  setErrorVisible: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  errorTextsRef: React.MutableRefObject<Record<string, string>>;
  errorVisibleRef: React.MutableRefObject<Record<string, boolean>>;
  errorsRef: React.MutableRefObject<Record<string, string>>;
  errorTimeoutsRef: React.MutableRefObject<
    Record<string, ReturnType<typeof setTimeout>>
  >;
  suppressedFieldsRef: React.MutableRefObject<Set<keyof FormValues>>;
  lastSubmitCountRef: React.MutableRefObject<number>;
  setDraft: (creating: CreatedFormData) => void;
  isFirstRender: React.MutableRefObject<boolean>;
};

function AddEditToolFormFormikEffects({
  toolId,
  draft,
  draftLoadedRef,
  selectedFileRef,
  setValues,
  submitCount,
  errors,
  values,
  isLoadingCategories,
  displayErrorsRef,
  setDisplayErrors,
  errorTexts,
  setErrorTexts,
  errorVisible,
  setErrorVisible,
  errorTextsRef,
  errorVisibleRef,
  errorsRef,
  errorTimeoutsRef,
  suppressedFieldsRef,
  lastSubmitCountRef,
  setDraft,
  isFirstRender,
}: AddEditToolFormFormikEffectsProps) {
  /**
   * v2807
   * ============================================================
   * BLOCK 5. Toast on invalid submit (Formik can block onSubmit)
   * ============================================================
   * Проблема:
   * - При наличии ошибок валидации Formik НЕ вызывает `onSubmit`, поэтому тостер из `handleSubmit`
   *   на “пустой форме” никогда не сработает.
   *
   * Решение:
   * - Слушаем `submitCount` + `errors` и показываем тост ровно 1 раз на попытку отправки,
   *   даже если Formik заблокировал вызов `onSubmit`.
   */
  const lastToastSubmitCountRef = useRef(0);

  useEffect(() => {
    if (submitCount === 0) {
      lastToastSubmitCountRef.current = 0;
      return;
    }
    if (lastToastSubmitCountRef.current === submitCount) return;

    const hasErrors = Object.values(errors).some((v) => !!v);
    if (!hasErrors) return;

    lastToastSubmitCountRef.current = submitCount;
    toast.error("Будь ласка, виправте помилки в формі");
  }, [submitCount, errors]);

  /**
   * v2807
   * ============================================================
   * BLOCK 6. Черновик -> Formik: одноразовое восстановление (только create)
   * ============================================================
   * Что делает:
   * - На странице создания (`!toolId`), если есть persisted черновик — восстанавливаем его
   *   ровно один раз через `setValues`.
   *
   * Зачем нужно:
   * - `initialValues` у Formik должны быть стабильными (для create держим их пустыми),
   *   иначе Formik может реинициализироваться и неожиданно сбрасывать touched/errors.
   * - Zustand persist гидратируется асинхронно; useEffect позволяет дождаться, когда черновик
   *   реально содержит данные.
   *
   * Взаимодействие с «force empty»:
   * - `forceEmptyForm()` ставит `draftLoadedRef.current = true`, поэтому этот блок восстановления
   *   пропускается на текущем заходе.
   */
  useEffect(() => {
    if (toolId) return;
    if (draftLoadedRef.current) return;

    const hasData =
      (draft.name && draft.name.trim()) ||
      (draft.description && draft.description.trim()) ||
      (draft.rentalTerms && draft.rentalTerms.trim()) ||
      (draft.category && draft.category.trim()) ||
      (draft.pricePerDay && draft.pricePerDay.trim()) ||
      (draft.specifications && draft.specifications.trim());

    if (!hasData) return;

    draftLoadedRef.current = true;
    setValues(
      {
        name: draft.name || "",
        pricePerDay: draft.pricePerDay || "",
        category: draft.category || "",
        rentalTerms: draft.rentalTerms || "",
        description: draft.description || "",
        specifications: draft.specifications || "",
        images: selectedFileRef.current,
      },
      false
    );
  }, [toolId, draft, setValues, draftLoadedRef, selectedFileRef]);

  /**
   * v2807
   * ============================================================
   * BLOCK 7. Синхронизация ошибки категории (анимированный wrapper + красная рамка селекта)
   * ============================================================
   * Почему отдельно от других полей:
   * - Категория использует `displayErrors` (отдельный state), потому что завязана на
   *   асинхронную загрузку категорий и проп `hasError` у CustomSelect.
   *
   * Важно:
   * - Не добавляем `displayErrors` в deps, читаем текущее значение через `displayErrorsRef`,
   *   иначе можно поймать цикл setState -> effect -> setState.
   */
  useEffect(() => {
    if (submitCount === 0) return;

    const categoryError = errors.category;
    const shouldShow =
      !!categoryError &&
      !suppressedFieldsRef.current.has("category") &&
      !isLoadingCategories &&
      !values.category;

    if (shouldShow) {
      setDisplayErrors((prev) => {
        if (prev.category === categoryError) return prev;
        return { ...prev, category: categoryError as string };
      });
      setErrorVisible((prev) => {
        if (prev.category) return prev;
        return { ...prev, category: true };
      });
      if (errorTimeoutsRef.current.category) {
        clearTimeout(errorTimeoutsRef.current.category);
        delete errorTimeoutsRef.current.category;
      }
      return;
    }

    if (!displayErrorsRef.current.category) return;

    setErrorVisible((prev) => {
      if (!prev.category) return prev;
      const next = { ...prev };
      delete next.category;
      return next;
    });

    if (errorTimeoutsRef.current.category) {
      clearTimeout(errorTimeoutsRef.current.category);
    }
    errorTimeoutsRef.current.category = setTimeout(() => {
      const latestErr = (
        errorsRef.current as Record<string, string | undefined>
      ).category;
      const latestSuppressed = suppressedFieldsRef.current.has("category");
      if (latestErr && !latestSuppressed) {
        delete errorTimeoutsRef.current.category;
        return;
      }
      setDisplayErrors((prev) => {
        if (!prev.category) return prev;
        const next = { ...prev };
        delete next.category;
        return next;
      });
      delete errorTimeoutsRef.current.category;
    }, 500);
  }, [
    submitCount,
    errors.category,
    values.category,
    isLoadingCategories,
    setDisplayErrors,
    setErrorVisible,
    displayErrorsRef,
    errorTimeoutsRef,
    errorsRef,
    suppressedFieldsRef,
  ]);

  /**
   * v2807
   * ============================================================
   * BLOCK 8. Анимированный рендер ошибок по полям (text inputs)
   * ============================================================
   * Что делает:
   * - После первой попытки submit зеркалит Formik `errors[field]` в наши состояния:
   *   - `errorTexts[field]` (строка, которую рендерим)
   *   - `errorVisible[field]` (управляет CSS-переходом)
   *
   * Зачем существует:
   * - Если рендерить ошибки напрямую из Formik, текст мгновенно размонтируется → анимации скрытия нет.
   * - Мы держим текст ещё ~500ms после скрытия видимости, чтобы CSS-переход успел завершиться.
   *
   * Почему нужен `errorsRef`:
   * - Таймауты срабатывают позже; нам нужен актуальный снимок ошибок, чтобы не удалить текст,
   *   если ошибка вернулась в течение окна анимации.
   *
   * Взаимодействие с `suppressedFieldsRef`:
   * - После submit, как только пользователь начал менять поле, мы держим его ошибку скрытой до
   *   следующего submit — это убирает мигание из‑за временных Formik errors.
   */
  useEffect(() => {
    if (submitCount === 0) {
      // v2807: важно не вызывать setState «всегда», иначе получим бесконечный цикл ререндеров
      // (React считает новый {} новым значением и снова вызывает эффект).
      setErrorTexts((prev) => (Object.keys(prev).length ? {} : prev));
      setErrorVisible((prev) => (Object.keys(prev).length ? {} : prev));
      setDisplayErrors((prev) => (Object.keys(prev).length ? {} : prev));
      errorTextsRef.current = {};
      errorVisibleRef.current = {};
      suppressedFieldsRef.current.clear();
      lastSubmitCountRef.current = 0;
      Object.values(errorTimeoutsRef.current).forEach((timeout) =>
        clearTimeout(timeout)
      );
      Object.keys(errorTimeoutsRef.current).forEach((k) => {
        delete errorTimeoutsRef.current[k];
      });
      return;
    }

    if (submitCount > lastSubmitCountRef.current) {
      suppressedFieldsRef.current.clear();
      lastSubmitCountRef.current = submitCount;
    }

    const fields: Array<keyof FormValues> = [
      "name",
      "pricePerDay",
      "rentalTerms",
      "description",
      "specifications",
      "images",
    ];

    fields.forEach((field) => {
      const err = errors[field];
      const isSuppressed = suppressedFieldsRef.current.has(field);

      if (err && !isSuppressed) {
        setErrorTexts((prev) => {
          if (prev[field] === err) return prev;
          return { ...prev, [field]: err };
        });
        setErrorVisible((prev) => {
          if (prev[field]) return prev;
          return { ...prev, [field]: true };
        });
        if (errorTimeoutsRef.current[field]) {
          clearTimeout(errorTimeoutsRef.current[field]);
          delete errorTimeoutsRef.current[field];
        }
        return;
      }

      if (!errorTextsRef.current[field]) return;

      setErrorVisible((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });

      if (errorTimeoutsRef.current[field]) {
        clearTimeout(errorTimeoutsRef.current[field]);
      }
      errorTimeoutsRef.current[field] = setTimeout(() => {
        const latestErr = (
          errorsRef.current as Record<string, string | undefined>
        )[field];
        const latestSuppressed = suppressedFieldsRef.current.has(field);
        if (latestErr && !latestSuppressed) {
          delete errorTimeoutsRef.current[field];
          return;
        }
        setErrorTexts((prev) => {
          if (!prev[field]) return prev;
          const next = { ...prev };
          delete next[field];
          return next;
        });
        delete errorTimeoutsRef.current[field];
      }, 500);
    });
  }, [
    submitCount,
    errors,
    setErrorTexts,
    setErrorVisible,
    setDisplayErrors,
    errorTextsRef,
    errorVisibleRef,
    errorsRef,
    errorTimeoutsRef,
    suppressedFieldsRef,
    lastSubmitCountRef,
  ]);

  /**
   * v2807
   * ============================================================
   * BLOCK 9. Синхронизация refs для корректной работы таймаутов
   * ============================================================
   * Зачем:
   * - Таймауты выполняются после рендера; переменные state внутри замыканий могут быть «устаревшими».
   * - Refs дают актуальный снимок без дополнительных перезапусков эффектов.
   */
  useEffect(() => {
    errorTextsRef.current = errorTexts;
  }, [errorTexts, errorTextsRef]);

  useEffect(() => {
    errorVisibleRef.current = errorVisible;
  }, [errorVisible, errorVisibleRef]);

  useEffect(() => {
    errorsRef.current = errors as Record<string, string>;
  }, [errors, errorsRef]);

  /**
   * v2807
   * ============================================================
   * BLOCK 10. Очистка таймаутов (только unmount)
   * ============================================================
   * Важный нюанс:
   * - Если чистить таймауты на каждом ререндере, анимации скрытия ломаются (таймауты не успевают сработать),
   *   и текст/рамка ошибки могут «застрять».
   * - Поэтому чистим таймауты только при unmount.
   */
  useEffect(() => {
    const timeouts = errorTimeoutsRef.current;
    return () => {
      Object.keys(timeouts).forEach((k) => {
        clearTimeout(timeouts[k]);
        delete timeouts[k];
      });
    };
  }, [errorTimeoutsRef]);

  /**
   * v2807
   * ============================================================
   * BLOCK 11. Сохранение черновика (только create)
   * ============================================================
   * Что делает:
   * - Дебаунс‑сохранение (500ms) текущих значений формы в persisted draft store.
   *
   * Зачем:
   * - Позволяет восстановить работу после перезагрузки.
   *
   * Важный нюанс:
   * - Пропускаем самый первый рендер (`isFirstRender`), чтобы не затереть реальный черновик
   *   пустыми значениями сразу после гидрации.
   */
  useEffect(() => {
    if (toolId) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      setDraft({
        name: values.name,
        pricePerDay: values.pricePerDay,
        category: values.category,
        rentalTerms: values.rentalTerms,
        description: values.description,
        specifications: values.specifications,
        images: "",
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    toolId,
    values.name,
    values.pricePerDay,
    values.category,
    values.rentalTerms,
    values.description,
    values.specifications,
    setDraft,
    isFirstRender,
  ]);

  return null;
}
