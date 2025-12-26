"use client";

import { useCreatingDraftStore } from "@/lib/store/createToolStore";
import { useRouter } from "next/navigation";
import css from "./PrivateProfilePlaceholder.module.css";

// v2807 [REMOVABLE BLOCK] Сигнал «открыть форму создания пустой»
// v2807 Что/Зачем: то же, что и в Header/Footer — заставляет `/tools/new` открываться пустой несмотря на кеш UI и гидрацию persisted черновика.
const OPEN_CREATE_TOOL_EMPTY_KEY = "creating-draft:open-empty";
// v2807 [/REMOVABLE BLOCK]

export default function PrivateProfilePlaceholder() {
  const router = useRouter();
  const clearCreateToolDraft = useCreatingDraftStore((state) => state.clearDraft);

  return (
    <div className={css.profilePlaceholderContainer}>
      <h4 className={css.profilePlaceholderTitle}>
        У вас ще не опубліковано жодного інструменту
      </h4>
      <p className={css.profilePlaceholderText}>
        Мершій обулікуйте своє перше оголошення, щоб почати отримувати пасивний
        дохід
      </p>
      <button
        type="button"
        className={css.profilePlaceholderLink}
        onClick={() => {
          // v2807 [REMOVABLE BLOCK] Принудительно открыть форму создания пустой (CTA в профиле)
          // v2807 Зачем: навигация через router; `/tools/new` может быть закеширован и показать старые значения Formik.
          // v2807 Как: флаг в sessionStorage + очистка store + очистка persisted storage + событие (покрывает переход на тот же роут).
          try {
            sessionStorage.setItem(OPEN_CREATE_TOOL_EMPTY_KEY, "1");
          } catch {
            // ignore
          }
          clearCreateToolDraft();
          try {
            useCreatingDraftStore.persist.clearStorage();
          } catch {
            // ignore
          }
          try {
            window.dispatchEvent(new Event("creating-draft:open-empty"));
          } catch {
            // ignore
          }
          router.push("/tools/new");
          // v2807 [/REMOVABLE BLOCK]
        }}
      >
        Опублікувати інструмент
      </button>
    </div>
  );
}
