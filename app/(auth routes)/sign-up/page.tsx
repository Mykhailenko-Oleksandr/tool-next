"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { register, UserRequest } from "@/lib/api/clientApi";
import { ApiError } from "@/app/api/api";
import css from "./SignUpPage.module.css";

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    try {
      const formValues = Object.fromEntries(formData) as UserRequest;
      const res = await register(formValues);
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
      <h1 className={css.formTitle}>Sign up</h1>
      <form
        action={handleSubmit}
        className={css.form}>
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
            Register
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
