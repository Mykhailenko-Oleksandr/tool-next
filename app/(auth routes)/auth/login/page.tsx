"use client";

import css from "./LoginPage.module.css";
import { ApiError } from "@/app/api/api";
import { login, UserRequest } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
//* Потрібно добавити для оновлення стану глобального стору після логіну
import { useAuthStore } from "../../../../lib/store/authStore";

const LoginPageSchema = Yup.object().shape({
  email: Yup.string()
    .email("Невірний формат електронної пошти")
    .required("Електронна пошта є обов'язковою"),
  password: Yup.string()
    .min(8, "Пароль повинен містити щонайменше 8 символів")
    .max(128, "Пароль повинен містити не більше 128 символів")
    .required("Пароль є обов'язковим"),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/";
  const [error, setError] = useState("");

  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (values: UserRequest) => {
    try {
      const res = await login(values);
      if (res) {
        setUser(res);
        router.push(redirectTo);
        return;
      } else {
        setError("Недійсна електронна пошта або пароль");
      }
    } catch (error) {
      setError(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          "Сталася помилка"
      );
    }
  };

  return (
    <>
      <div className={`container ${css.contentWrapper}`}>
        <div className={css.leftContentWrapper}>
          <Link href="/" className={css.formLogoLink}>
            <svg width="92" height="20" className={css.logo}>
              <use href="/icons.svg#icon-logo"></use>
            </svg>
          </Link>
          <div className={css.formWrapper}>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              onSubmit={handleSubmit}
              validationSchema={LoginPageSchema}
            >
              {({ isSubmitting }) => (
                <Form className={css.form}>
                  <fieldset>
                    <legend className={css.formTitle}>Вхід</legend>
                    <div className={css.formGroup}>
                      <label htmlFor="email" className={css.formLable}>
                        Пошта*
                      </label>
                      <Field
                        id="email"
                        type="email"
                        name="email"
                        className={css.formInput}
                        placeholder="Ваша пошта"
                        required
                      />
                      <ErrorMessage name="email" component="span" className={css.formError} />
                    </div>
                    <div className={css.formGroup}>
                      <label htmlFor="password">Пароль*</label>
                      <Field
                        id="password"
                        type="password"
                        name="password"
                        className={css.formInput}
                        placeholder="*******"
                        required
                      />
                      <ErrorMessage name="password" component="span" className={css.formError} />
                    </div>
                    <button type="submit" className={css.formButton} disabled={isSubmitting}>
                      Увійти
                    </button>
                  </fieldset>
                </Form>
              )}
            </Formik>
            <p className={css.formText}>
              Не маєте аккаунту? <Link href="/auth/register">Реєстрація</Link>
            </p>
          </div>
          <p className={css.formFooterText}>&#169; 2025 ToolNext</p>
        </div>

        <picture className={css.formImgWrapper}>
          <source srcSet="/images/login.jpg 1x, /images/login@2x.jpg 2x" />
          <Image
            src="/images/login.jpg"
            width={704}
            height={900}
            alt="Tools"
            priority
          />
        </picture>
      </div>
    </>
  );
}
