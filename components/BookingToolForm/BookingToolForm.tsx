"use client";

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { useId } from "react";
import * as Yup from "yup";
import css from "./BookingToolForm.module.css";
import { Tool } from "@/types/tool";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  startDate: string;
  endDate: string;
  city: string;
  postOffice: string;
}

const defaultFormData: FormData = {
  firstName: "",
  lastName: "",
  phone: "",
  startDate: "",
  endDate: "",
  city: "",
  postOffice: "",
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
    .min(Yup.ref("startDate"), "Дата завершення не може бути раніше")
    .required("Оберіть дату завершення"),
  city: Yup.string().required("Місто обовʼязкове"),
  postOffice: Yup.string().required("Відділення обовʼязкове"),
});

interface Props {
  tool: Tool;
}

export default function BookingToolForm({ tool }: Props) {
  const fieldId = useId();

  const totalPrice = 100;

  const handleSubmit = (
    values: FormData,
    formikHelpers: FormikHelpers<FormData>
  ) => {
    console.log("values", values);
    formikHelpers.resetForm();
  };

  return (
    <Formik
      initialValues={defaultFormData}
      // className={css.form}
      onSubmit={handleSubmit}
      validationSchema={BookingSchema}>
      <Form className={css.form}>
        <fieldset className={css.fieldset}>
          <label
            htmlFor={`${fieldId}-firstName`}
            className={css.label}>
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
          <label
            htmlFor={`${fieldId}-lastName`}
            className={css.label}>
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
          <label
            htmlFor={`${fieldId}-phone`}
            className={css.label}>
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
          <label
            htmlFor={`${fieldId}-startDate`}
            className={css.label}>
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
          <label
            htmlFor={`${fieldId}-endDate`}
            className={css.label}>
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
          <label
            htmlFor={`${fieldId}-deliveryCity`}
            className={css.label}>
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
            htmlFor={`${fieldId}-novaPoshtaBranch`}
            className={css.label}>
            Відділення Нової Пошти
          </label>
          <Field
            type="text"
            name="novaPoshtaBranch"
            placeholder="24"
            id={`${fieldId}-novaPoshtaBranch`}
            className={css.input}
          />
          <ErrorMessage
            name="novaPoshtaBranch"
            component="span"
            className={css.error}
          />
        </fieldset>

        <div className={css.priceRow}>
          <p className={css.price}>Вартість: {totalPrice} грн</p>
          <button
            type="submit"
            className={css.submitBtn}>
            Забронювати
          </button>
        </div>
      </Form>
    </Formik>
  );
}
