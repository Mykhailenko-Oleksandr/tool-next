'use client';

import css from "./LoginPage.module.css";
import { ApiError } from "@/app/api/api";
import { login, LoginRequest } from "@/lib/api/clientApi";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

const LoginPageSchema = Yup.object().shape({
    email: Yup.string()
        .email('Email format is invalid')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be at most 128 characters')
        .required('Password is required'),
});

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('from') || '/';
    const [error, setError] = useState('');

    const handleSubmit = async (values: LoginRequest) => {
        try {
            const res = await login(values);
            if (res) {
                router.push(redirectTo);
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            setError(
                (error as ApiError).response?.data?.error ??
                (error as ApiError).message ??
                'There are some error'
            )
        }
     };

    return (<>
        <div className={css.pageWrapper}>
            <div className={css.contentWrapper}>
                <a href="/">
                    <svg width="92" height="20" className={css.logo}>
                        <use href="/icons.svg#icon-logo-toolnext"></use>
                    </svg>
                </a>
                <div className={css.formWrapper}>
                    <Formik
                        initialValues={{
                            email: '',
                            password: '',
                        }}
                        onSubmit={handleSubmit}
                        validationSchema={LoginPageSchema}
                    >
                        {({ isSubmitting }) => (
                            <Form className={css.form}>
                                <fieldset>
                                    <legend className={css.formTitle}>Вхід</legend>
                                    <div className={css.formGroup}>
                                        <label htmlFor="email" className={css.formLable}>Пошта*</label>
                                        <Field
                                            id="email"
                                            type="email"
                                            name="email"
                                            className={css.formInput}
                                            placeholder="Ваша пошта"
                                            required />
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
                                            required />
                                        <ErrorMessage name="password" component="span" className={css.formError} />
                                    </div>
                                    <button
                                        type="submit"
                                        className={css.formButton}
                                        disabled={isSubmitting}
                                    >
                                        Увійти
                                    </button>
                                </fieldset>
                            </Form>
                        )}
                    </Formik>
                    <p className={css.formText}>Не маєте аккаунту? <a href="/auth/register">Реєстрація</a></p>
                </div>
                <p className={css.formFooterText}>&#169; 2025 ToolNext</p>
            </div>
        
            <div className={css.formImgWrapper}>
                <Image
                    src="/images/login.jpg"
                    width={704 }
                    height={900}
                    alt="Tools"
                    priority
                />
            </div>
        </div>
    </>
    );
};
