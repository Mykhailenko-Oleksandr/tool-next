"use client";

import css from "./LoginPage.module.css";
import { ApiError } from "@/app/api/api";
import { login, UserRequest } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import * as Yup from "yup";

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

  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (values: UserRequest) => {
    try {
      const res = await login(values);
      setUser(res);
      router.push("/profile");
      return;
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
    <>
      <div className={css.pageWrapper}>
        <div className={`container ${css.contentWrapper}`}>
          <div className={css.leftBoxContent}>
            <Link href="/" className={css.logoLink}>
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
                {({ isSubmitting, isValid, dirty }) => (
                  <Form className={css.form}>
                    <fieldset>
                      <legend className={css.title}>Вхід</legend>
                      <div className={css.inputWrapper}>
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
                          type="password"
                          name="password"
                          className={css.formInput}
                          placeholder="*******"
                          required
                        />
                        <ErrorMessage
                          name="password"
                          component="span"
                          className={css.formError}
                        />
                      </div>
                      <button
                        type="submit"
                        className={css.btn}
                        disabled={isSubmitting || !isValid || !dirty}
                      >
                        Увійти
                      </button>
                    </fieldset>
                  </Form>
                )}
              </Formik>
              <p className={css.formText}>
                Не маєте аккаунту?{" "}
                <Link className={css.textLink} href="/auth/register">
                  Реєстрація
                </Link>
              </p>
            </div>
            <p className={css.formFooterText}>&#169; 2025 ToolNext</p>
          </div>

          <picture className={css.formImg}>
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
      </div>
    </>
  );
}
