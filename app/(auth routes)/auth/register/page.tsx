"use client";

import css from "./RegistrationForm.module.css";
import { ApiError } from "@/app/api/api";
import { register, RegisterRequest } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as Yup from "yup";

const RegistrationFormSchema = Yup.object({
  name: Yup.string()
    .min(2, "Ім’я повинно містити щонайменше 2 символи")
    .max(32, "Ім’я повинно містити не більше 32 символів")
    .required("Ім’я є обов’язковим"),

  email: Yup.string()
    .email("Неправильний формат електронної пошти")
    .max(64, "Електронна пошта повинна містити не більше 64 символів")
    .required("Електронна пошта є обов’язковою"),

  password: Yup.string()
    .min(8, "Пароль повинний містити щонайменше 8 символів")
    .max(128, "Пароль повинний містити не більше 128 символів")
    .required("Пароль є обов’язковим"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Паролі не співпадають")
    .required("Підтвердження пароля є обов’язковим"),
});

export default function RegistrationForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleSubmit = async (values: RegisterRequest) => {
    try {
      const newUser = await register({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      setUser(newUser);
      router.replace("/profile");
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
            <Link className={css.logoLink} href="/">
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
                Вже маєте акаунт?&nbsp;
                <Link href="/auth/login" className={css.textLink}>
                  Вхід
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
