"use client";

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { useId } from "react";
import * as Yup from "yup";
import css from "./BookingToolForm.module.css";
import { Tool } from "@/types/tool";
import { bookingTool } from "@/lib/api/clientApi";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import { useBookingDraftStore } from "@/lib/store/bookingStore";
import { ApiError } from "@/app/api/api";
import DateRangeCalendar from "../DateRangeCalendar/DateRangeCalendar";

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
  const { draft, setDraft, clearDraft } = useBookingDraftStore();
  const fieldId = useId();

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
      const res = await bookingTool(values, tool._id);
      console.log(res);
      formikHelpers.resetForm();
      clearDraft();
      redirect("/");
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
      {({ values, setFieldValue }) => {
        const totalPrice =
          values.startDate && values.endDate
            ? getDaysCount(values.startDate, values.endDate) * tool.pricePerDay
            : 0;
        return (
          <Form className={css.form}>
            <h1 className={css.title}>Підтвердження бронювання</h1>

            {/* Name */}
            <div className={css.grid}>
              <div className={css.field}>
                <label className={css.label}>Імʼя</label>
                <Field
                  name="firstName"
                  placeholder="Ваше імʼя"
                  className={css.input}
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="firstName"
                  component="span"
                  className={css.error}
                />
              </div>

              <div className={css.field}>
                <label className={css.label}>Прізвище</label>
                <Field
                  name="lastName"
                  placeholder="Ваше прізвище"
                  className={css.input}
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="lastName"
                  component="span"
                  className={css.error}
                />
              </div>
            </div>

            {/* Phone */}
            <div className={css.field}>
              <label className={css.label}>Номер телефону</label>
              <Field
                name="phone"
                placeholder="+38 (XXX) XXX XX XX"
                className={css.input}
                onChange={handleChange}
              />
              <ErrorMessage
                name="phone"
                component="span"
                className={css.error}
              />
            </div>

            {/* Calendar */}
            <div className={css.calendarSection}>
              <p className={css.calendarLabel}>Виберіть період бронювання</p>
              <DateRangeCalendar
                startDate={values.startDate ? new Date(values.startDate) : null}
                endDate={values.endDate ? new Date(values.endDate) : null}
                onRangeChange={(start, end) => {
                  const formatDate = (date: Date) => {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    return `${year}-${month}-${day}`;
                  };
                  setFieldValue("startDate", start ? formatDate(start) : "");
                  setFieldValue("endDate", end ? formatDate(end) : "");
                }}
              />
            </div>

            {/* Delivery */}
            <div className={css.grid}>
              <div className={css.field}>
                <label className={css.label}>Місто доставки</label>
                <Field
                  name="deliveryCity"
                  placeholder="Ваше місто"
                  className={css.input}
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="deliveryCity"
                  component="span"
                  className={css.error}
                />
              </div>

              <div className={css.field}>
                <label className={css.label}>Відділення Нової Пошти</label>
                <Field
                  name="deliveryBranch"
                  placeholder="24"
                  className={css.input}
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="deliveryBranch"
                  component="span"
                  className={css.error}
                />
              </div>
            </div>

            {/* Footer */}
            <div className={css.footer}>
              <span className={css.price}>Ціна: {totalPrice} грн</span>
              <button type="submit" className={css.submit}>
                Забронювати
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
