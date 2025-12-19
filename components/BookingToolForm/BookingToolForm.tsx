"use client";

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { useId } from "react";
import * as Yup from "yup";
import css from "./BookingToolForm.module.css";
import { Tool } from "@/types/tool";
import { bookingTool } from "@/lib/api/clientApi";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { redirect } from "next/navigation";
import { useBookingDraftStore } from "@/lib/store/bookingStore";
import DateRangeCalendar from "@/components/DateRangeCalendar/DateRangeCalendar";

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

  const handleDateSelect = (
    date: Date,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const dateStr = date.toISOString().split("T")[0];
    const dateOnly = new Date(dateStr);
    dateOnly.setHours(0, 0, 0, 0);

    const currentStart = draft.startDate ? new Date(draft.startDate) : null;
    if (currentStart) currentStart.setHours(0, 0, 0, 0);

    const currentEnd = draft.endDate ? new Date(draft.endDate) : null;
    if (currentEnd) currentEnd.setHours(0, 0, 0, 0);

    // If no start date is selected, set it
    if (!currentStart) {
      setFieldValue("startDate", dateStr);
      setDraft({ ...draft, startDate: dateStr });
      return;
    }

    // If clicked date is before or equal to start date, reset and set new start date
    if (dateOnly <= currentStart) {
      setFieldValue("startDate", dateStr);
      setFieldValue("endDate", "");
      setDraft({ ...draft, startDate: dateStr, endDate: "" });
      return;
    }

    // If start date is selected and clicked date is after it, set as end date
    if (dateOnly > currentStart) {
      setFieldValue("endDate", dateStr);
      setDraft({ ...draft, endDate: dateStr });
      return;
    }
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
      const err = error as AxiosError;

      console.log("error", error);

      toast.error(err.response?.statusText || err.message);
    }
  };

  return (
    <Formik
      initialValues={draft}
      onSubmit={handleSubmit}
      validationSchema={BookingSchema}
      enableReinitialize>
      {({ values, setFieldValue }) => {
        const totalPrice =
          values.startDate && values.endDate
            ? getDaysCount(values.startDate, values.endDate) * tool.pricePerDay
            : 0;
        return (
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
              />
              <ErrorMessage
                name="phone"
                component="span"
                className={css.error}
              />
            </fieldset>

            <fieldset className={css.fieldset}>
              <label className={css.label}>
                Виберіть період бронювання
              </label>
              <DateRangeCalendar
                startDate={values.startDate}
                endDate={values.endDate}
                onDateSelect={(date) => handleDateSelect(date, setFieldValue)}
                unavailableDates={tool.bookedDates}
                fieldId={fieldId}
              />
              {/* Hidden inputs for Formik validation */}
              <Field
                type="hidden"
                name="startDate"
                value={values.startDate}
              />
              <Field
                type="hidden"
                name="endDate"
                value={values.endDate}
              />
              <ErrorMessage
                name="startDate"
                component="span"
                className={css.error}
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
                onChange={handleChange}
              />
              <ErrorMessage
                name="deliveryCity"
                component="span"
                className={css.error}
              />
              <label
                htmlFor={`${fieldId}-deliveryBranch`}
                className={css.label}>
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
            </fieldset>

            <div className={css.priceRow}>
              <p className={css.price}>Ціна: {totalPrice} грн</p>
              <button
                type="submit"
                className={css.submitBtn}>
                Забронювати
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
