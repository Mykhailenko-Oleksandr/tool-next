"use client";

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { useId } from "react";
import * as Yup from "yup";
import css from "./BookingToolForm.module.css";
import { Tool } from "@/types/tool";
import { bookingTool } from "@/lib/api/clientApi";
import toast from "react-hot-toast";

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

const defaultFormData: FormData = {
  firstName: "",
  lastName: "",
  phone: "",
  startDate: "",
  endDate: "",
  deliveryCity: "",
  deliveryBranch: "",
};

const BookingSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Мінімум 2 символи")
    .required("Імʼя обовʼязкове"),
  lastName: Yup.string()
    .min(2, "Мінімум 2 символи")
    .required("Прізвище обовʼязкове"),
  phone: Yup.string()
    .matches(/^\+?[0-9]{10,15}$/, "Некоректний номер телефону")
    .required("Телефон обовʼязковий"),
  startDate: Yup.date().required("Оберіть дату початку"),
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
  const fieldId = useId();

  const handleSubmit = async (
    values: FormData,
    formikHelpers: FormikHelpers<FormData>
  ) => {
    try {
      const res = await bookingTool(values, tool._id);
      console.log(res);

      // formikHelpers.resetForm();
    } catch (error) {
      console.log("error", error);

      // toast.error(error)
    }
  };

  return (
    <Formik
      initialValues={defaultFormData}
      onSubmit={handleSubmit}
      validationSchema={BookingSchema}
    >
      {({ values }) => {
        const totalPrice =
          values.startDate && values.endDate
            ? getDaysCount(values.startDate, values.endDate) * tool.pricePerDay
            : 0;

        return (
          <Form className={css.form}>
            <fieldset className={css.fieldset}>
              <label htmlFor={`${fieldId}-firstName`} className={css.label}>
                Ім&apos;я
              </label>
              <Field
                type="text"
                name="firstName"
                placeholder="Ваше ім'я"
                id={`${fieldId}-firstName`}
                className={css.input}
              />
              <ErrorMessage
                name="firstName"
                component="span"
                className={css.error}
              />
              <label htmlFor={`${fieldId}-lastName`} className={css.label}>
                Прізвище
              </label>
              <Field
                type="text"
                name="lastName"
                placeholder="Ваше прізвище"
                id={`${fieldId}-lastName`}
                className={css.input}
              />
              <ErrorMessage
                name="lastName"
                component="span"
                className={css.error}
              />
            </fieldset>
            <fieldset className={css.fieldset}>
              <label htmlFor={`${fieldId}-phone`} className={css.label}>
                Номер телефону
              </label>
              <Field
                type="tel"
                name="phone"
                placeholder="+38 (XXX) XXX XX XX"
                id={`${fieldId}-phone`}
                className={css.input}
              />
              <ErrorMessage
                name="phone"
                component="span"
                className={css.error}
              />
            </fieldset>

            <fieldset className={css.fieldset}>
              <label htmlFor={`${fieldId}-startDate`} className={css.label}>
                Дата початку
              </label>
              <Field
                type="date"
                name="startDate"
                id={`${fieldId}-startDate`}
                className={css.input}
              />
              <ErrorMessage
                name="startDate"
                component="span"
                className={css.error}
              />
              <label htmlFor={`${fieldId}-endDate`} className={css.label}>
                Дата завершення
              </label>
              <Field
                type="date"
                name="endDate"
                id={`${fieldId}-endDate`}
                className={css.input}
              />
              <ErrorMessage
                name="endDate"
                component="span"
                className={css.error}
              />
            </fieldset>

            <fieldset className={css.fieldset}>
              <label htmlFor={`${fieldId}-deliveryCity`} className={css.label}>
                Місто доставки
              </label>
              <Field
                type="text"
                name="deliveryCity"
                placeholder="Ваше місто"
                id={`${fieldId}-deliveryCity`}
                className={css.input}
              />
              <ErrorMessage
                name="deliveryCity"
                component="span"
                className={css.error}
              />
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
              />
              <ErrorMessage
                name="deliveryBranch"
                component="span"
                className={css.error}
              />
            </fieldset>

            <div className={css.priceRow}>
              <p className={css.price}>Вартість: {totalPrice} грн</p>
              <button type="submit" className={css.submitBtn}>
                Забронювати
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
