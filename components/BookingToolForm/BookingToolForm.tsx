"use client";

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { useId } from "react";
import * as Yup from "yup";
import css from "./BookingToolForm.module.css";
import { Tool } from "@/types/tool";
import { bookingTool } from "@/lib/api/clientApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useBookingDraftStore } from "@/lib/store/bookingStore";
import { ApiError } from "@/app/api/api";

function getDaysCount(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays || 1;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  startDate: string;
  endDate: string;
  deliveryCity: string;
  deliveryBranch: string;
}

const BookingSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, "Мінімум 3 символи")
    .max(50, "Максимум 50 символів")
    .required("Імʼя обовʼязкове"),
  lastName: Yup.string()
    .min(2, "Мінімум 2 символи")
    .max(50, "Максимум 50 символів")
    .required("Прізвище обовʼязкове"),
  phone: Yup.string()
    .matches(/^\+?[0-9]{10,15}$/, "Некоректний номер телефону")
    .required("Телефон обовʼязковий"),
  startDate: Yup.date()
    .required("Оберіть дату початку")
    .min(
      new Date().toISOString().split("T")[0],
      "Дата не може бути в минулому"
    ),
  endDate: Yup.date()
    .required("Оберіть дату завершення")
    .when("startDate", ([startDate], schema) => {
      if (!startDate) return schema;

      const minDate = new Date(startDate);
      minDate.setDate(minDate.getDate() + 1);

      return schema.min(
        minDate,
        "Дата завершення має бути пізніше за дату початку"
      );
    }),
  deliveryCity: Yup.string().required("Місто обовʼязкове"),
  deliveryBranch: Yup.string().required("Відділення обовʼязкове"),
});

interface Props {
  tool: Tool;
}

export default function BookingToolForm({ tool }: Props) {
  const { draft, setDraft, clearDraft } = useBookingDraftStore();
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
      await bookingTool(values, tool._id);
      formikHelpers.resetForm();
      clearDraft();
      router.push("/confirm/booking");
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
    <Formik
      initialValues={draft}
      onSubmit={handleSubmit}
      validationSchema={BookingSchema}
      enableReinitialize
    >
      {({ values }) => {
        const totalPrice =
          values.startDate && values.endDate
            ? Math.max(
                0,
                getDaysCount(values.startDate, values.endDate) *
                  tool.pricePerDay
              )
            : 0;
        return (
          <div className={css.wrapper}>
            <Form className={css.form}>
              {/* Ім’я + Прізвище */}
              <fieldset className={css.fieldset}>
                <div className={css.control}>
                  <label htmlFor={`${fieldId}-firstName`} className={css.label}>
                    Ім&apos;я
                  </label>
                  <Field
                    type="text"
                    name="firstName"
                    placeholder="Ваше ім'я"
                    id={`${fieldId}-firstName`}
                    className={css.input}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="firstName"
                    component="span"
                    className={css.error}
                  />
                </div>
                <div className={css.control}>
                  <label htmlFor={`${fieldId}-lastName`} className={css.label}>
                    Прізвище
                  </label>
                  <Field
                    type="text"
                    name="lastName"
                    placeholder="Ваше прізвище"
                    id={`${fieldId}-lastName`}
                    className={css.input}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="lastName"
                    component="span"
                    className={css.error}
                  />
                </div>
              </fieldset>

              {/* Телефон */}
              <fieldset className={`${css.fieldset} ${css.single}`}>
                <div className={css.control}>
                  <label htmlFor={`${fieldId}-phone`} className={css.label}>
                    Номер телефону
                  </label>
                  <Field
                    type="tel"
                    name="phone"
                    placeholder="+38 (XXX) XXX XX XX"
                    id={`${fieldId}-phone`}
                    className={css.input}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="phone"
                    component="span"
                    className={css.error}
                  />
                </div>
              </fieldset>

              {/* Дати */}
              <fieldset className={css.fieldset}>
                <div className={css.control}>
                  <label htmlFor={`${fieldId}-startDate`} className={css.label}>
                    Дата початку
                  </label>
                  <Field
                    type="date"
                    name="startDate"
                    id={`${fieldId}-startDate`}
                    className={css.input}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="startDate"
                    component="span"
                    className={css.error}
                  />
                </div>
                <div className={css.control}>
                  <label htmlFor={`${fieldId}-endDate`} className={css.label}>
                    Дата завершення
                  </label>
                  <Field
                    type="date"
                    name="endDate"
                    id={`${fieldId}-endDate`}
                    className={css.input}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="endDate"
                    component="span"
                    className={css.error}
                  />
                </div>
              </fieldset>

              {/* Місто + Відділення */}
              <fieldset className={css.fieldset}>
                <div className={css.control}>
                  <label
                    htmlFor={`${fieldId}-deliveryCity`}
                    className={css.label}
                  >
                    Місто доставки
                  </label>
                  <Field
                    type="text"
                    name="deliveryCity"
                    placeholder="Ваше місто"
                    id={`${fieldId}-deliveryCity`}
                    className={css.input}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="deliveryCity"
                    component="span"
                    className={css.error}
                  />
                </div>
                <div className={css.control}>
                  <label
                    htmlFor={`${fieldId}-deliveryBranch`}
                    className={css.label}
                  >
                    Відділення Нової Пошти
                  </label>
                  <Field
                    type="text"
                    name="deliveryBranch"
                    placeholder="24"
                    id={`${fieldId}-deliveryBranch`}
                    className={css.input}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="deliveryBranch"
                    component="span"
                    className={css.error}
                  />
                </div>
              </fieldset>

              {/* Ціна + кнопка */}
              <div className={css.priceRow}>
                <p className={css.price}>Вартість: {totalPrice} грн</p>
                <button type="submit" className={css.submitBtn}>
                  Забронювати
                </button>
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
}
