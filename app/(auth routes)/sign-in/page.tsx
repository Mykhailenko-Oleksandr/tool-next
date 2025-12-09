"use client";

import { ApiError } from "@/app/api/api";
import { login, UserRequest } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignInPage.module.css";

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    try {
      const formValues = Object.fromEntries(formData) as UserRequest;
      const res = await login(formValues);

      if (res) {
        setUser(res);
        router.push("/profile");
      }
    } catch (error) {
      setError(
        (error as ApiError).response?.data?.response?.validation?.body
          ?.message ??
          (error as ApiError).response?.data?.response?.message ??
          "Oops... some error"
      );
    }
  };

  return (
    <main className={css.mainContent}>
      <form
        action={handleSubmit}
        className={css.form}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}>
            Log in
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
