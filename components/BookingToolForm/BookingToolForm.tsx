"use client";

import { api } from "@/lib/api/api";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import * as Yup from "yup";
import "./BookingToolForm.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface BookingFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  startDate: string;
  endDate: string;
  city: string;
  postOffice: string;
}

interface BookedDate {
  startDate: string;
  endDate: string;
}

interface Tool {
  _id: string;
  name: string;
  pricePerDay: number;
  bookedDates: BookedDate[];
}

interface Props {
  tool: Tool;
}

export default function BookingToolForm({ tool }: Props) {
  const [status, setStatus] = useState<string | null>(null);

  const formik = useFormik<BookingFormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: "",
      startDate: "",
      endDate: "",
      city: "",
      postOffice: "",
    },

    validationSchema: Yup.object({
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
    }),

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setStatus(null);
      try {
        setSubmitting(true);

        const start = new Date(values.startDate);
        const end = new Date(values.endDate);

        const conflict = tool.bookedDates.find((b) => {
          const bookedStart = new Date(b.startDate);
          const bookedEnd = new Date(b.endDate);
          return start <= bookedEnd && end >= bookedStart;
        });

        if (conflict) {
          setStatus(
            `Інструмент зайнятий з ${new Date(
              conflict.from
            ).toLocaleDateString()} по ${new Date(
              conflict.to
            ).toLocaleDateString()}`
          );
          return;
        }

        const payload = {
          startDate: values.startDate,
          endDate: values.endDate,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          deliveryCity: values.city,
          deliveryBranch: values.postOffice,
        };
        console.log("SEND TO API:", payload);
        await api.post(`/api/bookings/${tool._id}`, payload);
        setStatus("✅ Бронювання успішне");
        resetForm();
      } catch {
        setStatus("Помилка при бронюванні");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const totalPrice = useMemo(() => {
    if (!formik.values.startDate || !formik.values.endDate) return 0;
    const start = new Date(formik.values.startDate);
    const end = new Date(formik.values.endDate);
    const days =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    return days * tool.pricePerDay;
  }, [formik.values.startDate, formik.values.endDate, tool.pricePerDay]);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = formik;

 return (
  <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)} noValidate>
    <h1 className={styles.title}>Підтвердження бронювання</h1>

    <div className={styles.row}>
      <div className={styles.field}>
        <label htmlFor="firstName" className={styles.label}>
          Ім&apos;я
        </label>
        <input
          id="firstName"
          type="text"
          placeholder="Ваше ім'я"
          className={errors.firstName ? styles.inputError : styles.input}
          {...register("firstName")}
        />
        {errors.firstName && (
          <span className={styles.error}>{errors.firstName.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="lastName" className={styles.label}>
          Прізвище
        </label>
        <input
          id="lastName"
          type="text"
          placeholder="Ваше прізвище"
          className={errors.lastName ? styles.inputError : styles.input}
          {...register("lastName")}
        />
        {errors.lastName && (
          <span className={styles.error}>{errors.lastName.message}</span>
        )}
      </div>
    </div>

    <div className={styles.field}>
      <label htmlFor="phone" className={styles.label}>
        Номер телефону
      </label>
      <input
        id="phone"
        type="tel"
        placeholder="+38 (XXX) XXX XX XX"
        className={errors.phone ? styles.inputError : styles.input}
        {...register("phone")}
      />
      {errors.phone && (
        <span className={styles.error}>{errors.phone.message}</span>
      )}
    </div>

    <div className={styles.row}>
      <div className={styles.field}>
        <label htmlFor="startDate" className={styles.label}>
          Дата початку
        </label>
        <input
          id="startDate"
          type="date"
          className={styles.input}
          {...register("startDate")}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="endDate" className={styles.label}>
          Дата завершення
        </label>
        <input
          id="endDate"
          type="date"
          className={styles.input}
          {...register("endDate")}
        />
      </div>
    </div>

    <div className={styles.row}>
      <div className={styles.field}>
        <label htmlFor="deliveryCity" className={styles.label}>
          Місто доставки
        </label>
        <input
          id="deliveryCity"
          type="text"
          placeholder="Ваше місто"
          className={errors.deliveryCity ? styles.inputError : styles.input}
          {...register("city")}
        />
        {errors.city && (
          <span className={styles.error}>{errors.city.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="novaPoshtaBranch" className={styles.label}>
          Відділення Нової Пошти
        </label>
        <input
          id="novaPoshtaBranch"
          type="text"
          placeholder="24"
          className={errors.postOffice ? styles.inputError : styles.input}
          {...register("postOffice")}
        />
        {errors.postOffice && (
          <span className={styles.error}>{errors.postOffice.message}</span>
        )}
      </div>
    </div>

    <div className={styles.priceRow}>
      <span className={styles.price}>Вартість: {totalPrice} грн</span>
      <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
        {isSubmitting ? "Бронювання..." : "Забронювати"}
      </button>
    </div>

    {status && <div className={styles.formStatus}>{status}</div>}
  </form>
);