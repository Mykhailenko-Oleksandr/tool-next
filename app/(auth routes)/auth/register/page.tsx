"use client";

import css from "./RegistrationForm.module.css";
import { ApiError } from "@/app/api/api";
import { register, RegisterRequest } from "@/lib/api/clientApi";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

const RegistrationFormSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(32, "Name must be at most 32 characters")
    .required("Name is required"),

  email: Yup.string()
    .email("Email format is invalid")
    .max(64)
    .required("Email is required"),

  password: Yup.string().min(8).max(128).required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

export default function RegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/";
  const [error, setError] = useState("");

  const handleSubmit = async (values: RegisterRequest) => {
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      router.replace(redirectTo || "/");
    } catch (error) {
      setError(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          "Registration error"
      );
    }
  };

  return (
    <>
      <div className={css.pageWrapper}>
        <div className={css.contentWrapper}>
          <Link href="/">
            <svg width="92" height="20" className={css.logo}>
              <use href="/icons.svg#icon-logo"></use>
            </svg>
          </Link>
          <div className={css.formWrapper}>
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={RegistrationFormSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, isValid, dirty }) => (
                <Form className={css.form}>
                  <fieldset>
                    <legend className={css.title}>Реєстрація</legend>
                    <div className={css.inputWrapper}>
                      <label htmlFor="name">Ім&#39;я*</label>
                      <Field
                        id="name"
                        name="name"
                        type="text"
                        className={css.formInput}
                        placeholder="Ваше ім'я"
                      />
                      <ErrorMessage
                        name="name"
                        component="span"
                        className={css.formError}
                      />
                    </div>

                    <div className={css.inputWrapper}>
                      <label htmlFor="email">Пошта*</label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className={css.formInput}
                        placeholder="Ваша пошта"
                      />
                      <ErrorMessage
                        name="email"
                        component="span"
                        className={css.formError}
                      />
                    </div>

                    <div className={css.inputWrapper}>
                      <label htmlFor="password">Пароль*</label>
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        className={css.formInput}
                        placeholder="*******"
                      />
                      <ErrorMessage
                        name="password"
                        component="span"
                        className={css.formError}
                      />
                    </div>

                    <div className={css.inputWrapper}>
                      <label htmlFor="confirmPassword">
                        Підтвердіть пароль*
                      </label>
                      <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className={css.formInput}
                        placeholder="*******"
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="span"
                        className={css.formError}
                      />
                    </div>
                    <button
                      type="submit"
                      className={css.btn}
                      disabled={isSubmitting || !isValid || !dirty}
                    >
                      Зареєструватися
                    </button>
                  </fieldset>
                </Form>
              )}
            </Formik>
            <p className={css.formText}>
              Вже маєте акаунт?{" "}
              <Link href="/auth/login" className={css.textLink}>
                Вхід
              </Link>
            </p>
          </div>
          <p className={css.formFooterText}>&#169; 2025 ToolNext</p>
        </div>

        <div className={css.formImg}>
          <Image
            src="/images/login.jpg"
            width={704}
            height={900}
            alt="Tools"
            priority
          />
        </div>
      </div>
    </>
  );
}
